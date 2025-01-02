import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Use environment variable for flexibility
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies and credentials
  });

  const port = process.env.PORT || 3001; // Use environment variable or default to 3001
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
