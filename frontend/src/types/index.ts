// Centralized type exports to avoid duplication
export * from './auth';
export * from './venue';

// Common utility types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  query?: string;
  location?: string;
  category?: string;
  date?: string;
  priceRange?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
