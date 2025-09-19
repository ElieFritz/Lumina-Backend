import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LuminaException, ErrorCode } from '../exceptions/custom.exceptions';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const requestId = this.generateRequestId();
    const timestamp = new Date().toISOString();

    let status: number;
    let errorResponse: any;

    if (exception instanceof LuminaException) {
      // Custom Lumina exceptions
      status = exception.statusCode;
      errorResponse = this.formatLuminaError(exception, requestId);
      this.logLuminaError(exception, request);
    } else if (exception instanceof HttpException) {
      // NestJS HTTP exceptions
      status = exception.getStatus();
      errorResponse = this.formatHttpError(exception, requestId);
      this.logHttpError(exception, request);
    } else {
      // Unknown errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = this.formatUnknownError(exception, requestId);
      this.logUnknownError(exception, request);
    }

    // Add common headers
    response.setHeader('X-Request-ID', requestId);
    response.setHeader('X-Timestamp', timestamp);

    response.status(status).json(errorResponse);
  }

  private formatLuminaError(exception: LuminaException, requestId: string): any {
    return {
      success: false,
      error: {
        code: exception.code,
        message: exception.message,
        details: exception.details,
        timestamp: exception.timestamp,
        requestId,
      },
      path: '/api' + (exception as any).url || 'unknown',
    };
  }

  private formatHttpError(exception: HttpException, requestId: string): any {
    const response = exception.getResponse();
    const message = typeof response === 'string' ? response : (response as any).message;

    return {
      success: false,
      error: {
        code: this.mapHttpStatusToErrorCode(exception.getStatus()),
        message: Array.isArray(message) ? message.join(', ') : message,
        timestamp: new Date().toISOString(),
        requestId,
      },
    };
  }

  private formatUnknownError(exception: unknown, requestId: string): any {
    return {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? String(exception) : undefined,
        timestamp: new Date().toISOString(),
        requestId,
      },
    };
  }

  private mapHttpStatusToErrorCode(status: number): ErrorCode {
    switch (status) {
      case 400:
        return ErrorCode.VALIDATION_ERROR;
      case 401:
        return ErrorCode.UNAUTHORIZED;
      case 403:
        return ErrorCode.FORBIDDEN;
      case 404:
        return ErrorCode.RECORD_NOT_FOUND;
      case 409:
        return ErrorCode.DUPLICATE_RECORD;
      case 422:
        return ErrorCode.INVALID_INPUT;
      case 429:
        return ErrorCode.RATE_LIMIT_EXCEEDED;
      case 500:
        return ErrorCode.INTERNAL_SERVER_ERROR;
      case 502:
        return ErrorCode.SUPABASE_CONNECTION_FAILED;
      case 503:
        return ErrorCode.SERVICE_UNAVAILABLE;
      default:
        return ErrorCode.INTERNAL_SERVER_ERROR;
    }
  }

  private logLuminaError(exception: LuminaException, request: Request): void {
    const logContext = {
      requestId: exception.requestId,
      method: request.method,
      url: request.url,
      userAgent: request.get('User-Agent'),
      ip: request.ip,
    };

    if (exception.statusCode >= 500) {
      this.logger.error(
        `Lumina Error: ${exception.code} - ${exception.message}`,
        exception.stack,
        JSON.stringify(logContext)
      );
    } else {
      this.logger.warn(
        `Lumina Error: ${exception.code} - ${exception.message}`,
        JSON.stringify(logContext)
      );
    }
  }

  private logHttpError(exception: HttpException, request: Request): void {
    const logContext = {
      method: request.method,
      url: request.url,
      userAgent: request.get('User-Agent'),
      ip: request.ip,
    };

    if (exception.getStatus() >= 500) {
      this.logger.error(
        `HTTP Error: ${exception.getStatus()} - ${exception.message}`,
        exception.stack,
        JSON.stringify(logContext)
      );
    } else {
      this.logger.warn(
        `HTTP Error: ${exception.getStatus()} - ${exception.message}`,
        JSON.stringify(logContext)
      );
    }
  }

  private logUnknownError(exception: unknown, request: Request): void {
    const logContext = {
      method: request.method,
      url: request.url,
      userAgent: request.get('User-Agent'),
      ip: request.ip,
    };

    this.logger.error(
      'Unknown Error occurred',
      exception instanceof Error ? exception.stack : String(exception),
      JSON.stringify(logContext)
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
