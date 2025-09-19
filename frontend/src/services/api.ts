// API service for Lumina Africa Frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Venue {
  id: string; // Changed to string for UUID
  name: string;
  description: string;
  category: string;
  address: string; // Simplified from location object
  city: string;
  country: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating: number;
  review_count?: number;
  price_range: string; // Changed from priceRange
  capacity?: number;
  opening_hours: any; // Changed from string
  amenities?: string[];
  images: string[];
  is_active: boolean; // Changed from isOpen
  is_verified?: boolean;
  status?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string; // Changed to string for UUID
  title: string;
  description: string;
  venue_id: string; // Changed from venueId
  venue_name: string; // Added for convenience
  category: string;
  start_date: string; // Changed from date
  end_date: string; // Added
  price: number;
  currency: string;
  available_tickets: number; // Changed from availableTickets
  total_tickets: number; // Changed from totalTickets
  images: string[];
  is_active: boolean; // Changed from isActive
  status: string; // Added
  created_at: string;
  updated_at: string;
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
          errorData = await response.text(); // Fallback to text if not JSON
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
    }>('/api/health');
  }

  async ping() {
    return this.request<{ message: string }>('/api/health/ping');
  }

  // Venues endpoints
  async getVenues(category?: string, city?: string, status?: string, page: number = 1, limit: number = 10): Promise<ApiResponse<Venue[]>> {
    let endpoint = `/api/venues?page=${page}&limit=${limit}`;
    if (category) endpoint += `&category=${category}`;
    if (city) endpoint += `&city=${city}`;
    if (status) endpoint += `&status=${status}`;
    return this.request<ApiResponse<Venue[]>>(endpoint);
  }

  async getVenueById(id: string): Promise<Venue> {
    const response = await this.request<ApiResponse<Venue[]>>(`/api/venues/${id}`);
    return response.data[0]; // Assuming the backend returns an array for single item
  }

  async getVenuesByCategory(category: string, page: number = 1, limit: number = 10): Promise<ApiResponse<Venue[]>> {
    return this.request<ApiResponse<Venue[]>>(`/api/venues?category=${category}&page=${page}&limit=${limit}`);
  }

  // Events endpoints
  async getEvents(category?: string, venueId?: string, page: number = 1, limit: number = 10): Promise<ApiResponse<Event[]>> {
    let endpoint = `/api/events?page=${page}&limit=${limit}`;
    if (category) endpoint += `&category=${category}`;
    if (venueId) endpoint += `&venue_id=${venueId}`;
    return this.request<ApiResponse<Event[]>>(endpoint);
  }

  async getEventById(id: string): Promise<Event> {
    const response = await this.request<ApiResponse<Event[]>>(`/api/events/${id}`);
    return response.data[0]; // Assuming the backend returns an array for single item
  }

  async getEventsByVenue(venueId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<Event[]>> {
    return this.request<ApiResponse<Event[]>>(`/api/events?venue_id=${venueId}&page=${page}&limit=${limit}`);
  }
}

export const apiService = new ApiService();
