import { Controller, Get } from '@nestjs/common';
import { HealthService } from '../services/health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth() {
    const health = await this.healthService.getOverallHealth();
    return {
      ...health,
      service: 'Lumina Africa API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('ping')
  ping() {
    return { message: 'pong' };
  }

  @Get('database')
  async checkDatabase() {
    return await this.healthService.checkDatabase();
  }

  @Get('redis')
  async checkRedis() {
    return await this.healthService.checkRedis();
  }

  @Get('elasticsearch')
  async checkElasticsearch() {
    return await this.healthService.checkElasticsearch();
  }
}
