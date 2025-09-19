import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { SupabaseController } from './controllers/supabase.controller';
import { SupabaseService } from './services/supabase.service';
import { HealthController } from './controllers/health.controller';
import { HealthService } from './services/health.service';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { RetryInterceptor } from './common/interceptors/retry.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', '.env.production'],
    }),
  ],
  controllers: [SupabaseController, HealthController],
  providers: [
    SupabaseService,
    HealthService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RetryInterceptor,
    },
  ],
})
export class AppModule {}