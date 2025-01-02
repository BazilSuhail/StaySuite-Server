import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
    MongooseModule.forRoot(process.env.MONGODB_URI), // Connect to MongoDB
    AuthModule, // Auth module
    ProfileModule, // Auth module
  ],
})
export class AppModule {}
