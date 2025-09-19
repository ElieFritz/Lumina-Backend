import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware de sécurité
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://lumina-africa-frontend.vercel.app',
      'https://lumina-africa.vercel.app'
    ],
    credentials: true,
  });

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Lumina Africa API')
    .setDescription('API pour la plateforme Lumina Africa utilisant Supabase')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Configuration du port
  const port = process.env.PORT || 3001;
  
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Lumina Africa API is running on port: ${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  console.log(`🗄️  Database: Supabase (${process.env.NEXT_PUBLIC_SUPABASE_URL})`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
}

bootstrap().catch((error) => {
  console.error('❌ Error starting the application:', error);
  process.exit(1);
});