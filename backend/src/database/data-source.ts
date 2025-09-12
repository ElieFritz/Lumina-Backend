import { DataSource } from 'typeorm';
import { databaseConfig } from '../config/database.config';
import { User } from '../entities/user.entity';
import { Venue } from '../entities/venue.entity';
import { VenueImage } from '../entities/venue-image.entity';
import { Event } from '../entities/event.entity';
import { EventImage } from '../entities/event-image.entity';
import { Booking } from '../entities/booking.entity';
import { Review } from '../entities/review.entity';

export const AppDataSource = new DataSource({
  ...databaseConfig,
  entities: [User, Venue, VenueImage, Event, EventImage, Booking, Review],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false, // Désactivé pour utiliser les migrations
  logging: true,
});

export default AppDataSource;