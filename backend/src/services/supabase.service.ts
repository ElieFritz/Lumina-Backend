import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSupabaseConfig, SupabaseConfig } from '../config/supabase.config';
import { SupabaseException, ErrorCode } from '../common/exceptions/custom.exceptions';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private readonly config: SupabaseConfig;

  constructor(private configService: ConfigService) {
    this.config = createSupabaseConfig(configService);
  }

  /**
   * Make a request to Supabase REST API with enhanced error handling
   */
  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.url}/rest/v1/${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'apikey': this.config.anonKey,
      'Authorization': `Bearer ${this.config.anonKey}`,
    };

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      this.logger.debug(`Making request to: ${url}`);
      
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        await this.handleSupabaseError(response, endpoint, url);
      }

      const data = await response.json();
      this.logger.debug(`Request successful: ${endpoint}`);
      return data;
    } catch (error) {
      this.handleRequestError(error, endpoint, url);
    }
  }

  /**
   * Handle Supabase-specific errors
   */
  private async handleSupabaseError(response: Response, endpoint: string, url: string): Promise<never> {
    let errorDetails: any;
    
    try {
      errorDetails = await response.json();
    } catch {
      errorDetails = await response.text();
    }

    this.logger.error(`Supabase API error: ${response.status} ${response.statusText}`, {
      endpoint,
      url,
      status: response.status,
      statusText: response.statusText,
      details: errorDetails,
    });

    // Map HTTP status codes to our error codes
    let errorCode: ErrorCode;
    let message: string;

    switch (response.status) {
      case 400:
        errorCode = ErrorCode.VALIDATION_ERROR;
        message = 'Invalid request to Supabase';
        break;
      case 401:
        errorCode = ErrorCode.UNAUTHORIZED;
        message = 'Supabase authentication failed';
        break;
      case 403:
        errorCode = ErrorCode.SUPABASE_RLS_ERROR;
        message = 'Supabase RLS policy denied access';
        break;
      case 404:
        errorCode = ErrorCode.RECORD_NOT_FOUND;
        message = 'Resource not found in Supabase';
        break;
      case 409:
        errorCode = ErrorCode.DUPLICATE_RECORD;
        message = 'Duplicate record in Supabase';
        break;
      case 422:
        errorCode = ErrorCode.INVALID_INPUT;
        message = 'Invalid input data for Supabase';
        break;
      case 429:
        errorCode = ErrorCode.RATE_LIMIT_EXCEEDED;
        message = 'Supabase rate limit exceeded';
        break;
      case 500:
        errorCode = ErrorCode.SUPABASE_CONNECTION_FAILED;
        message = 'Supabase internal server error';
        break;
      case 502:
      case 503:
      case 504:
        errorCode = ErrorCode.SUPABASE_CONNECTION_FAILED;
        message = 'Supabase service unavailable';
        break;
      default:
        errorCode = ErrorCode.SUPABASE_QUERY_FAILED;
        message = `Supabase API error: ${response.status}`;
    }

    throw new SupabaseException(message, {
      status: response.status,
      statusText: response.statusText,
      endpoint,
      url,
      supabaseError: errorDetails,
    });
  }

  /**
   * Handle network and other request errors
   */
  private handleRequestError(error: any, endpoint: string, url: string): never {
    this.logger.error(`Request failed: ${endpoint}`, {
      error: error.message,
      endpoint,
      url,
      stack: error.stack,
    });

    // Check for specific network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new SupabaseException(
        'Cannot connect to Supabase service',
        {
          code: error.code,
          endpoint,
          url,
        }
      );
    }

    if (error.code === 'ETIMEDOUT') {
      throw new SupabaseException(
        'Supabase request timeout',
        {
          code: error.code,
          endpoint,
          url,
        }
      );
    }

    if (error.message && error.message.includes('fetch failed')) {
      throw new SupabaseException(
        'Network error connecting to Supabase',
        {
          message: error.message,
          endpoint,
          url,
        }
      );
    }

    // Generic Supabase error
    throw new SupabaseException(
      'Supabase request failed',
      {
        originalError: error.message,
        endpoint,
        url,
      }
    );
  }

  /**
   * Get Supabase configuration
   */
  getConfig(): SupabaseConfig {
    return this.config;
  }

  /**
   * Test Supabase connection
   */
  async testConnection(): Promise<{ status: string; error?: string }> {
    try {
      // Test with a simple GET request instead of HEAD to avoid JSON parsing issues
      const response = await fetch(`${this.config.url}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': this.config.anonKey,
          'Authorization': `Bearer ${this.config.anonKey}`,
        },
      });
      
      if (response.ok) {
        return { status: 'connected' };
      } else {
        return { 
          status: 'error', 
          error: `HTTP ${response.status}: ${response.statusText}` 
        };
      }
    } catch (error) {
      return { 
        status: 'error', 
        error: error.message 
      };
    }
  }
}