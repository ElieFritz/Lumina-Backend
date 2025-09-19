import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Méthodes utilitaires pour les requêtes complexes
  async findUserWithRelations(userId: string) {
    return this.user.findUnique({
      where: { id: userId },
      include: {
        venues: true,
        events: true,
        reviews: true,
        bookings: {
          include: {
            event: true,
            venue: true,
            payment: true,
          },
        },
      },
    });
  }

  async findVenueWithRelations(venueId: string) {
    return this.venue.findUnique({
      where: { id: venueId },
      include: {
        owner: true,
        events: true,
        reviews: {
          include: {
            user: true,
          },
        },
        images: true,
        bookings: {
          include: {
            user: true,
            event: true,
          },
        },
      },
    });
  }

  async findEventWithRelations(eventId: string) {
    return this.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: true,
        venue: true,
        images: true,
        bookings: {
          include: {
            user: true,
            payment: true,
          },
        },
      },
    });
  }

  // Méthodes pour les requêtes géospatiales
  async findVenuesNearLocation(lat: number, lng: number, radiusKm: number = 10) {
    // Note: Cette requête nécessite l'extension PostGIS
    // Pour l'instant, on retourne tous les venues
    // TODO: Implémenter la requête géospatiale avec PostGIS
    return this.venue.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        images: true,
        reviews: true,
      },
    });
  }

  // Méthodes pour les statistiques
  async getVenueStats(venueId: string) {
    const [totalBookings, totalRevenue, averageRating] = await Promise.all([
      this.booking.count({
        where: { venueId, status: 'COMPLETED' },
      }),
      this.payment.aggregate({
        where: {
          booking: { venueId },
          status: 'COMPLETED',
        },
        _sum: { amount: true },
      }),
      this.review.aggregate({
        where: { venueId },
        _avg: { rating: true },
      }),
    ]);

    return {
      totalBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
      averageRating: averageRating._avg.rating || 0,
    };
  }

  // Méthodes pour les recherches
  async searchVenues(query: string, filters?: {
    category?: string;
    city?: string;
    priceRange?: string;
    rating?: number;
  }) {
    const where: any = {
      status: 'ACTIVE',
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ],
    };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters?.priceRange) {
      where.priceRange = filters.priceRange;
    }

    if (filters?.rating) {
      where.rating = { gte: filters.rating };
    }

    return this.venue.findMany({
      where,
      include: {
        images: true,
        reviews: true,
        owner: true,
      },
      orderBy: { rating: 'desc' },
    });
  }
}
