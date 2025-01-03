import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ListingsModule } from './listings/listings.module';
import { ListingRatingModule } from './listingRating/listingRating.module';
import { HostListingsModule } from './hostListing/hostListing.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SocketGateway } from './socket-gateway';
import { GuestBookingsModule } from './guestBooking/guestBooking.module';
//const SocketGateway = require('./socket-gateway');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'listing_images'), // Serve files from 'listing_images' directory
      serveRoot: '/listing-images', // Optional: Prefix path for static assets
    }),
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
    MongooseModule.forRoot(process.env.MONGODB_URI), // Connect to MongoDB
    AuthModule, // Auth module
    ProfileModule, // Auth module
    ListingsModule,
    ListingRatingModule,
    HostListingsModule,
    GuestBookingsModule,
  ],

  providers: [SocketGateway], // Register the WebSocket Gateway
})
export class AppModule { }
