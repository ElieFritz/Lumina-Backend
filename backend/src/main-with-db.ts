import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppWithDbModule } from './app-with-db.module';

async function bootstrap() {
  const app = await NestFactory.create(AppWithDbModule);

  // Configuration CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Préfixe global pour l'API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log('🚀 Backend démarré sur http://localhost:' + port);
  console.log('📊 API disponible sur http://localhost:' + port + '/api');
  console.log('🗄️  Mode avec base de données PostgreSQL');
  console.log('🔗 Base de données: lumina_africa');
}

bootstrap().catch((error) => {
  console.error('❌ Erreur lors du démarrage:', error);
  process.exit(1);
});
