import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './controllers/health.controller';
import { VenuesController } from './controllers/venues.controller';
import { EventsController } from './controllers/events.controller';
import { AuthSimpleController } from './controllers/auth-simple.controller';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    HealthController,
    VenuesController,
    EventsController,
    AuthSimpleController,
  ],
})
export class AppNoDbModule {}
