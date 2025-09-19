import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError, timer } from 'rxjs';
import { retry, retryWhen, mergeMap, take } from 'rxjs/operators';
import { LuminaException, ErrorCode } from '../exceptions/custom.exceptions';

@Injectable()
export class RetryInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RetryInterceptor.name);
  private readonly maxRetries = 3;
  private readonly baseDelay = 1000; // 1 second

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, index) => {
            const retryAttempt = index + 1;
            
            // Only retry on network errors or Supabase connection issues
            if (this.shouldRetry(error) && retryAttempt <= this.maxRetries) {
              const delay = this.calculateDelay(retryAttempt);
              
              this.logger.warn(
                `Retry attempt ${retryAttempt}/${this.maxRetries} after ${delay}ms`,
                {
                  error: error.message,
                  url: context.switchToHttp().getRequest().url,
                }
              );
              
              return timer(delay);
            }
            
            // Don't retry, throw the error
            return throwError(() => error);
          }),
          take(this.maxRetries + 1)
        )
      )
    );
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return true;
    }

    // Retry on Supabase connection issues
    if (error instanceof LuminaException) {
      return error.code === ErrorCode.SUPABASE_CONNECTION_FAILED || 
             error.code === ErrorCode.NETWORK_ERROR;
    }

    // Retry on fetch failures
    if (error.message && error.message.includes('fetch failed')) {
      return true;
    }

    return false;
  }

  private calculateDelay(attempt: number): number {
    // Exponential backoff with jitter
    const exponentialDelay = this.baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 0.1 * exponentialDelay; // 10% jitter
    return Math.min(exponentialDelay + jitter, 10000); // Max 10 seconds
  }
}
