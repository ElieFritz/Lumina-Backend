import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import * as Redis from 'redis';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private redisClient: Redis.RedisClientType;

  constructor() {
    // Initialiser Redis client
    this.redisClient = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
  }

  async checkDatabase(): Promise<{ status: string; message: string; details?: any }> {
    try {
      if (!AppDataSource.isInitialized) {
        return {
          status: 'error',
          message: 'Database not initialized',
        };
      }

      // Test de connexion
      await AppDataSource.query('SELECT 1');
      
      // Vérifier les tables principales
      const tables = await AppDataSource.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'venues', 'events', 'bookings', 'reviews')
      `);

      return {
        status: 'healthy',
        message: 'Database connection successful',
        details: {
          tables: tables.map(t => t.table_name),
          totalTables: tables.length,
        },
      };
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return {
        status: 'error',
        message: 'Database connection failed',
        details: { error: error.message },
      };
    }
  }

  async checkRedis(): Promise<{ status: string; message: string; details?: any }> {
    try {
      if (!this.redisClient.isOpen) {
        await this.redisClient.connect();
      }

      // Test de ping
      const pong = await this.redisClient.ping();
      
      if (pong === 'PONG') {
        return {
          status: 'healthy',
          message: 'Redis connection successful',
        };
      } else {
        return {
          status: 'error',
          message: 'Redis ping failed',
        };
      }
    } catch (error) {
      this.logger.error('Redis health check failed:', error);
      return {
        status: 'error',
        message: 'Redis connection failed',
        details: { error: error.message },
      };
    }
  }

  async checkElasticsearch(): Promise<{ status: string; message: string; details?: any }> {
    try {
      const response = await fetch(process.env.ELASTICSEARCH_URL || 'http://localhost:9200');
      
      if (response.ok) {
        const data = await response.json();
        return {
          status: 'healthy',
          message: 'Elasticsearch connection successful',
          details: {
            version: data.version?.number,
            cluster: data.cluster_name,
          },
        };
      } else {
        return {
          status: 'error',
          message: 'Elasticsearch connection failed',
          details: { status: response.status },
        };
      }
    } catch (error) {
      this.logger.error('Elasticsearch health check failed:', error);
      return {
        status: 'error',
        message: 'Elasticsearch connection failed',
        details: { error: error.message },
      };
    }
  }

  async getOverallHealth(): Promise<{
    status: string;
    timestamp: string;
    services: {
      database: any;
      redis: any;
      elasticsearch: any;
    };
  }> {
    const [database, redis, elasticsearch] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkElasticsearch(),
    ]);

    const allHealthy = [database, redis, elasticsearch].every(
      service => service.status === 'healthy'
    );

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database,
        redis,
        elasticsearch,
      },
    };
  }
}


