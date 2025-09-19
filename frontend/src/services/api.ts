// API service for Lumina Africa Frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Venue {
  id: number;
  name: string;
  description: string;
  category: string;
  location: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  rating: number;
  priceRange: string;
  images: string[];
  isOpen: boolean;
  openingHours: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  venueId: number;
  venueName: string;
  category: string;
  date: string;
  time: string;
  price: number;
  currency: string;
  availableTickets: number;
  totalTickets: number;
  images: string[];
  isActive: boolean;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }

        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        (error as any).data = errorData;
        (error as any).requestId = requestId;
        (error as any).url = url;
        
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, {
        error: error.message,
        status: (error as any).status,
        requestId,
        url,
      });
      throw error;
    }
  }

  // Health endpoints
  async getHealth() {
    return this.request<{
      status: string;
      timestamp: string;
      service: string;
      version: string;
      environment: string;
    }>('/api/health');
  }

  async ping() {
    return this.request<{ message: string }>('/api/health/ping');
  }

  // Venues endpoints
  async getVenues(category?: string): Promise<ApiResponse<Venue[]>> {
    const endpoint = category ? `/api/venues?category=${category}` : '/api/venues';
    return this.request<ApiResponse<Venue[]>>(endpoint);
  }

  async getVenueById(id: number): Promise<ApiResponse<Venue>> {
    return this.request<ApiResponse<Venue>>(`/api/venues/${id}`);
  }

  async getVenuesByCategory(category: string): Promise<ApiResponse<Venue[]>> {
    return this.request<ApiResponse<Venue[]>>(`/api/venues/category/${category}`);
  }

  // Events endpoints
  async getEvents(category?: string): Promise<ApiResponse<Event[]>> {
    const endpoint = category ? `/api/events?category=${category}` : '/api/events';
    return this.request<ApiResponse<Event[]>>(endpoint);
  }

  async getEventById(id: number): Promise<ApiResponse<Event>> {
    return this.request<ApiResponse<Event>>(`/api/events/${id}`);
  }

  async getEventsByVenue(venueId: number): Promise<ApiResponse<Event[]>> {
    return this.request<ApiResponse<Event[]>>(`/api/events/venue/${venueId}`);
  }
}

export const apiService = new ApiService();
