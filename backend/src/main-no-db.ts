import { NestFactory } from '@nestjs/core';
import { AppNoDbModule } from './app-no-db.module';

async function bootstrap() {
  const app = await NestFactory.create(AppNoDbModule);
  
  // Configuration CORS
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  // Préfixe API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend démarré sur http://localhost:${port}`);
  console.log(`📊 API disponible sur http://localhost:${port}/api`);
  console.log(`✅ Mode développement sans base de données`);
}

bootstrap().catch((error) => {
  console.error('❌ Erreur lors du démarrage:', error);
  process.exit(1);
});
