import { NestFactory } from '@nestjs/core';
import { AppSimpleModule } from './app-simple.module';

async function bootstrap() {
  const app = await NestFactory.create(AppSimpleModule);
  
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend démarré sur http://localhost:${port}`);
  console.log(`📊 API disponible sur http://localhost:${port}/api`);
  console.log(`✅ Mode développement avec base de données`);
}

bootstrap();