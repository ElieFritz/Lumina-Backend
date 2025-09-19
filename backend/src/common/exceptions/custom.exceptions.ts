export enum ErrorCode {
  // Database errors
  DATABASE_CONNECTION_FAILED = 'DATABASE_CONNECTION_FAILED',
  DATABASE_QUERY_FAILED = 'DATABASE_QUERY_FAILED',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_RECORD = 'DUPLICATE_RECORD',
  
  // Supabase errors
  SUPABASE_CONNECTION_FAILED = 'SUPABASE_CONNECTION_FAILED',
  SUPABASE_QUERY_FAILED = 'SUPABASE_QUERY_FAILED',
  SUPABASE_RLS_ERROR = 'SUPABASE_RLS_ERROR',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Business logic errors
  VENUE_NOT_AVAILABLE = 'VENUE_NOT_AVAILABLE',
  EVENT_FULL = 'EVENT_FULL',
  BOOKING_CONFLICT = 'BOOKING_CONFLICT',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  
  // System errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

export class LuminaException extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: any;
  public readonly timestamp: string;
  public readonly requestId?: string;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    details?: any,
    requestId?: string
  ) {
    super(message);
    this.name = 'LuminaException';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;
  }
}

export class DatabaseException extends LuminaException {
  constructor(message: string, details?: any, requestId?: string) {
    super(ErrorCode.DATABASE_QUERY_FAILED, message, 500, details, requestId);
  }
}

export class SupabaseException extends LuminaException {
  constructor(message: string, details?: any, requestId?: string) {
    super(ErrorCode.SUPABASE_QUERY_FAILED, message, 502, details, requestId);
  }
}

export class ValidationException extends LuminaException {
  constructor(message: string, details?: any, requestId?: string) {
    super(ErrorCode.VALIDATION_ERROR, message, 400, details, requestId);
  }
}

export class NotFoundException extends LuminaException {
  constructor(resource: string, id?: string, requestId?: string) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(ErrorCode.RECORD_NOT_FOUND, message, 404, { resource, id }, requestId);
  }
}

export class UnauthorizedException extends LuminaException {
  constructor(message: string = 'Unauthorized access', requestId?: string) {
    super(ErrorCode.UNAUTHORIZED, message, 401, undefined, requestId);
  }
}

export class ForbiddenException extends LuminaException {
  constructor(message: string = 'Forbidden access', requestId?: string) {
    super(ErrorCode.FORBIDDEN, message, 403, undefined, requestId);
  }
}
