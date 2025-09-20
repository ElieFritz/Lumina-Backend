// Vercel API handler for NestJS
const express = require('express');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

const app = express();
let nestApp;

async function createNestApp() {
  if (!nestApp) {
    try {
      nestApp = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log'],
      });
      nestApp.setGlobalPrefix('api');
      await nestApp.init();
    } catch (error) {
      console.error('Error creating NestJS app:', error);
      throw error;
    }
  }
  return nestApp;
}

app.use(async (req, res, next) => {
  try {
    const nestApp = await createNestApp();
    const expressApp = nestApp.getHttpAdapter().getInstance();
    expressApp(req, res, next);
  } catch (error) {
    console.error('Error in Vercel handler:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = app;