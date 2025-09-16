import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { databaseConfig, jwtConfig } from './config/database.config';
import { User } from './common/entities/user.entity';
import { Venue } from './entities/venue.entity';
import { VenueImage } from './entities/venue-image.entity';
import { Event } from './entities/event.entity';
import { EventImage } from './entities/event-image.entity';
import { Booking } from './entities/booking.entity';
import { Review } from './entities/review.entity';
import { ImportedPlace } from './entities/imported-place.entity';
import { HealthController } from './controllers/health.controller';
import { VenuesController } from './controllers/venues.controller';
import { EventsController } from './controllers/events.controller';
import { AuthController } from './controllers/auth.controller';
import { PlacesImportController } from './controllers/places-import.controller';
import { PlacesImportPublicController } from './controllers/places-import-public.controller';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { PlacesImportService } from './services/places-import.service';
import { PlaceClaimService } from './services/place-claim.service';
import { GooglePlacesService } from './services/google-places.service';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Base de données
    TypeOrmModule.forRoot({
      ...databaseConfig,
      entities: [User, Venue, VenueImage, Event, EventImage, Booking, Review, ImportedPlace],
      synchronize: false, // Utiliser les migrations
      logging: true,
    }),
    // JWT
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expiresIn },
    }),
    // Entités
    TypeOrmModule.forFeature([User, Venue, VenueImage, Event, EventImage, Booking, Review, ImportedPlace]),
  ],
  controllers: [
    HealthController,
    VenuesController,
    EventsController,
    AuthController,
    PlacesImportController,
    PlacesImportPublicController,
  ],
  providers: [
    UserService,
    AuthService,
    PlacesImportService,
    PlaceClaimService,
    GooglePlacesService,
  ],
})
export class AppWithDbModule {}
