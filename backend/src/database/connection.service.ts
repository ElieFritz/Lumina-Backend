import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';
import { createEnvironmentConfig } from '../config/environment.config';

@Injectable()
export class DatabaseConnectionService {
  private readonly logger = new Logger(DatabaseConnectionService.name);

  async initialize(): Promise<void> {
    try {
      // Valider les variables d'environnement critiques
      this.validateEnvironment();
      
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        this.logger.log('✅ Database connection initialized successfully');
        
        // Vérifier la connexion
        await this.testConnection();
        
        // Exécuter les migrations si nécessaire
        await this.runMigrations();
      }
    } catch (error) {
      this.logger.error('❌ Failed to initialize database connection:', error);
      throw error;
    }
  }

  private validateEnvironment(): void {
    try {
      // Cette validation sera faite par createEnvironmentConfig
      // qui gère déjà la validation des variables d'environnement
      this.logger.log('✅ Environment variables validated successfully');
    } catch (error) {
      this.logger.error('❌ Environment validation failed:', error);
      throw error;
    }
  }

  async testConnection(): Promise<void> {
    try {
      await AppDataSource.query('SELECT 1');
      this.logger.log('✅ Database connection test successful');
    } catch (error) {
      this.logger.error('❌ Database connection test failed:', error);
      throw error;
    }
  }

  async runMigrations(): Promise<void> {
    try {
      const pendingMigrations = await AppDataSource.showMigrations();
      if (pendingMigrations) {
        this.logger.log('🔄 Running pending migrations...');
        await AppDataSource.runMigrations();
        this.logger.log('✅ Migrations completed successfully');
      } else {
        this.logger.log('✅ No pending migrations');
      }
    } catch (error) {
      this.logger.error('❌ Migration failed:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      this.logger.log('✅ Database connection closed');
    }
  }

  getDataSource(): DataSource {
    return AppDataSource;
  }
}
