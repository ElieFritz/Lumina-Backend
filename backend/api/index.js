// Vercel API handler for NestJS
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

let app;

async function createApp() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    await app.init();
  }
  return app;
}

module.exports = async (req, res) => {
  try {
    const nestApp = await createApp();
    return nestApp.getHttpAdapter().getInstance()(req, res);
  } catch (error) {
    console.error('Error creating NestJS app:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
