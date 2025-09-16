import { ConfigService } from '@nestjs/config';
import { createEnvironmentConfig } from './environment.config';

// Factory function pour créer la configuration de base de données
export function createDatabaseConfig(configService: ConfigService) {
  const env = createEnvironmentConfig(configService);
  
  return {
    type: 'postgres' as const,
    host: env.database.host,
    port: env.database.port,
    username: env.database.username,
    password: env.database.password,
    database: env.database.database,
    synchronize: env.database.synchronize,
    logging: env.database.logging,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    ssl: env.isProduction ? { rejectUnauthorized: false } : false,
  };
}

// Factory function pour créer la configuration JWT
export function createJwtConfig(configService: ConfigService) {
  const env = createEnvironmentConfig(configService);
  
  return {
    secret: env.jwt.secret,
    expiresIn: env.jwt.expiresIn,
  };
}

// Configuration par défaut pour les cas où ConfigService n'est pas disponible
export const defaultDatabaseConfig = {
  type: 'postgres' as const,
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT) || 5433, // Port Docker par défaut
  username: process.env.POSTGRES_USER || 'lumina_user',
  password: process.env.POSTGRES_PASSWORD || 'lumina_password',
  database: process.env.POSTGRES_DB || 'lumina_africa',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

export const defaultJwtConfig = {
  secret: process.env.JWT_SECRET || 'dev-jwt-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

export const apiConfig = {
  port: parseInt(process.env.API_PORT || '3001'),
  host: process.env.API_HOST || 'localhost',
};

// Exports pour la compatibilité avec les anciens modules
export const databaseConfig = defaultDatabaseConfig;
export const jwtConfig = defaultJwtConfig;

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || '',
};

export const paymentConfig = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key',
  },
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY || 'sk_test_your_paystack_secret_key',
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_your_paystack_public_key',
  },
};
