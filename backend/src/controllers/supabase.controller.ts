import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../services/supabase.service';

@Controller('api')
export class SupabaseController {
  private readonly logger = new Logger(SupabaseController.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  // === HEALTH CHECK ===
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Lumina Africa API',
      database: 'Supabase',
      version: '1.0.0',
    };
  }

  @Get('health/supabase')
  async getSupabaseStatus() {
    try {
      const connectionStatus = await this.supabaseService.testConnection();
      const config = this.supabaseService.getConfig();

      return {
        status: connectionStatus.status,
        supabase_url: config.url,
        timestamp: new Date().toISOString(),
        error: connectionStatus.error,
      };
    } catch (error) {
      this.logger.error('Supabase health check failed', error);
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // === USERS ===
  @Get('users')
  async getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    try {
      let url = `users?select=*&order=created_at.desc`;
      
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;
      
      url += `&offset=${offset}&limit=${limitNum}`;
      
      if (search) {
        url += `&or=(first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%)`;
      }

      const [users, countResponse] = await Promise.all([
        this.supabaseService.request(url),
        this.supabaseService.request(`users?select=count`),
      ]);

      return {
        users,
        total: countResponse.length,
        page: pageNum,
        limit: limitNum,
      };
    } catch (error) {
      this.logger.error('Failed to fetch users', error);
      throw error;
    }
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    try {
      const users = await this.supabaseService.request(`users?id=eq.${id}&select=*`);
      return users[0] || null;
    } catch (error) {
      this.logger.error(`Failed to fetch user ${id}`, error);
      throw error;
    }
  }

  @Post('users')
  async createUser(@Body() userData: any) {
    try {
      return await this.supabaseService.request('users', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Prefer': 'return=representation',
        },
      });
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw error;
    }
  }

  @Patch('users/:id')
  async updateUser(@Param('id') id: string, @Body() userData: any) {
    try {
      return await this.supabaseService.request(`users?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify(userData),
        headers: {
          'Prefer': 'return=representation',
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update user ${id}`, error);
      throw error;
    }
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.supabaseService.request(`users?id=eq.${id}`, {
        method: 'DELETE',
      });
      return { message: 'User deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete user ${id}`, error);
      throw error;
    }
  }

  // === VENUES ===
  @Get('venues')
  async getVenues(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('category') category?: string,
    @Query('city') city?: string,
    @Query('status') status?: string,
  ) {
    try {
      let url = `venues?select=*&order=created_at.desc`;
      
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;
      
      url += `&offset=${offset}&limit=${limitNum}`;
      
      // Add filters
      if (category) {
        url += `&category=eq.${category}`;
      }
      
      if (city) {
        url += `&city=ilike.%${city}%`;
      }
      
      if (status) {
        const isActive = status === 'active';
        url += `&is_active=eq.${isActive}`;
      }

      const [venues, countResponse] = await Promise.all([
        this.supabaseService.request(url),
        this.supabaseService.request(`venues?select=count`),
      ]);

      return {
        venues,
        total: countResponse.length,
        page: pageNum,
        limit: limitNum,
      };
    } catch (error) {
      this.logger.error('Failed to fetch venues', error);
      throw error;
    }
  }

  @Get('venues/:id')
  async getVenue(@Param('id') id: string) {
    try {
      const venues = await this.supabaseService.request(`venues?id=eq.${id}&select=*,owner:users(*),venue_images(*),reviews:reviews(*,user:users(*))`);
      return venues[0] || null;
    } catch (error) {
      this.logger.error(`Failed to fetch venue ${id}`, error);
      throw error;
    }
  }

  @Post('venues')
  async createVenue(@Body() venueData: any) {
    try {
      return await this.supabaseService.request('venues', {
        method: 'POST',
        body: JSON.stringify(venueData),
        headers: {
          'Prefer': 'return=representation',
        },
      });
    } catch (error) {
      this.logger.error('Failed to create venue', error);
      throw error;
    }
  }

  @Patch('venues/:id')
  async updateVenue(@Param('id') id: string, @Body() venueData: any) {
    try {
      return await this.supabaseService.request(`venues?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify(venueData),
        headers: {
          'Prefer': 'return=representation',
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update venue ${id}`, error);
      throw error;
    }
  }

  @Delete('venues/:id')
  async deleteVenue(@Param('id') id: string) {
    try {
      await this.supabaseService.request(`venues?id=eq.${id}`, {
        method: 'DELETE',
      });
      return { message: 'Venue deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete venue ${id}`, error);
      throw error;
    }
  }

  // === EVENTS ===
  @Get('events')
  async getEvents(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('venue_id') venueId?: string,
  ) {
    try {
      let url = `events?select=*,organizer:users(*),venue:venues(*),event_images(*)&order=start_date.asc`;
      
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;
      
      url += `&offset=${offset}&limit=${limitNum}`;
      
      if (venueId) {
        url += `&venue_id=eq.${venueId}`;
      }

      const [events, countResponse] = await Promise.all([
        this.supabaseService.request(url),
        this.supabaseService.request(`events?select=count`),
      ]);

      return {
        events,
        total: countResponse.length,
        page: pageNum,
        limit: limitNum,
      };
    } catch (error) {
      this.logger.error('Failed to fetch events', error);
      throw error;
    }
  }

  @Get('events/:id')
  async getEvent(@Param('id') id: string) {
    try {
      const events = await this.supabaseService.request(`events?id=eq.${id}&select=*,organizer:users(*),venue:venues(*),event_images(*),bookings:bookings(*,user:users(*))`);
      return events[0] || null;
    } catch (error) {
      this.logger.error(`Failed to fetch event ${id}`, error);
      throw error;
    }
  }

  @Post('events')
  async createEvent(@Body() eventData: any) {
    try {
      return await this.supabaseService.request('events', {
        method: 'POST',
        body: JSON.stringify(eventData),
        headers: {
          'Prefer': 'return=representation',
        },
      });
    } catch (error) {
      this.logger.error('Failed to create event', error);
      throw error;
    }
  }

  // === BOOKINGS ===
  @Get('bookings')
  async getBookings(@Query('user_id') userId?: string) {
    try {
      let url = 'bookings?select=*,event:events(*,venue:venues(*)),user:users(*),payment:payments(*)&order=created_at.desc';
      
      if (userId) {
        url += `&user_id=eq.${userId}`;
      }

      return await this.supabaseService.request(url);
    } catch (error) {
      this.logger.error('Failed to fetch bookings', error);
      throw error;
    }
  }

  @Post('bookings')
  async createBooking(@Body() bookingData: any) {
    try {
      return await this.supabaseService.request('bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
        headers: {
          'Prefer': 'return=representation',
        },
      });
    } catch (error) {
      this.logger.error('Failed to create booking', error);
      throw error;
    }
  }

  // === REVIEWS ===
  @Get('reviews')
  async getReviews(@Query('venue_id') venueId?: string) {
    try {
      let url = 'reviews?select=*,user:users(*),venue:venues(*)&order=created_at.desc';
      
      if (venueId) {
        url += `&venue_id=eq.${venueId}`;
      }

      return await this.supabaseService.request(url);
    } catch (error) {
      this.logger.error('Failed to fetch reviews', error);
      throw error;
    }
  }

  @Post('reviews')
  async createReview(@Body() reviewData: any) {
    try {
      return await this.supabaseService.request('reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
        headers: {
          'Prefer': 'return=representation',
        },
      });
    } catch (error) {
      this.logger.error('Failed to create review', error);
      throw error;
    }
  }

  // === STATS ===
  @Get('stats')
  async getStats() {
    try {
      const [usersCount, venuesCount, eventsCount, bookingsCount] = await Promise.all([
        this.supabaseService.request('users?select=count').catch(() => []),
        this.supabaseService.request('venues?select=count').catch(() => []),
        this.supabaseService.request('events?select=count').catch(() => []),
        this.supabaseService.request('bookings?select=count').catch(() => []),
      ]);

      return {
        users: usersCount.length,
        venues: venuesCount.length,
        events: eventsCount.length,
        bookings: bookingsCount.length,
      };
    } catch (error) {
      this.logger.error('Failed to fetch stats', error);
      return {
        users: 0,
        venues: 0,
        events: 0,
        bookings: 0,
      };
    }
  }
}
