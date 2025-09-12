import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

// Database configuration
import { databaseConfig } from './config/database.config';

// Controllers
import { HealthController } from './controllers/health.controller';
import { AuthSimpleController } from './modules/auth/auth-simple.controller';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database (sans entités pour éviter les conflits)
    TypeOrmModule.forRoot({
      ...databaseConfig,
      entities: [], // Pas d'entités pour commencer
      synchronize: false,
      logging: true,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
  ],
  controllers: [HealthController, AuthSimpleController],
})
export class AppAuthModule {}
