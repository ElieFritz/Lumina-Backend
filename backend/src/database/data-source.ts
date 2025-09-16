import { DataSource } from 'typeorm';
import { defaultDatabaseConfig } from '../config/database.config';
import { User } from '../common/entities/user.entity';
import { Venue } from '../entities/venue.entity';
import { VenueImage } from '../entities/venue-image.entity';
import { Event } from '../entities/event.entity';
import { EventImage } from '../entities/event-image.entity';
import { Booking } from '../entities/booking.entity';
import { Review } from '../entities/review.entity';

export const AppDataSource = new DataSource({
  ...defaultDatabaseConfig,
  entities: [User, Venue, VenueImage, Event, EventImage, Booking, Review],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false, // Désactivé pour utiliser les migrations
  logging: process.env.NODE_ENV === 'development',
});

export default AppDataSource;