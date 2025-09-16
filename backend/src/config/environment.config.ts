import { ConfigService } from '@nestjs/config';

export interface EnvironmentConfig {
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  api: {
    port: number;
    host: string;
  };
}

export function createEnvironmentConfig(configService: ConfigService): EnvironmentConfig {
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const isDevelopment = nodeEnv === 'development';
  const isProduction = nodeEnv === 'production';
  const isTest = nodeEnv === 'test';

  // Validation des variables critiques en production
  if (isProduction) {
    const requiredVars = ['JWT_SECRET', 'POSTGRES_PASSWORD', 'REDIS_PASSWORD'];
    const missingVars = requiredVars.filter(varName => !configService.get(varName));
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables in production: ${missingVars.join(', ')}`);
    }
  }

  return {
    nodeEnv,
    isDevelopment,
    isProduction,
    isTest,
    database: {
      host: configService.get<string>('POSTGRES_HOST', 'localhost'),
      port: configService.get<number>('POSTGRES_PORT', isDevelopment ? 5433 : 5432),
      username: configService.get<string>('POSTGRES_USER', 'lumina_user'),
      password: configService.get<string>('POSTGRES_PASSWORD', 'lumina_password'),
      database: configService.get<string>('POSTGRES_DB', 'lumina_africa'),
      synchronize: isDevelopment,
      logging: isDevelopment,
    },
    jwt: {
      secret: configService.get<string>('JWT_SECRET', isDevelopment ? 'dev-jwt-secret-key' : ''),
      expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
    },
    redis: {
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
      password: configService.get<string>('REDIS_PASSWORD'),
    },
    api: {
      port: configService.get<number>('PORT', 3001),
      host: configService.get<string>('API_HOST', 'localhost'),
    },
  };
}


