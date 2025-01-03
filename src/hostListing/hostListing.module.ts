import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HostListingsController } from './hostListing.controller';
import { HostListingsService } from './hostListing.service';
import { HostListing, HostListingSchema } from '../schemas/hostListings.schema';
import { Listing, ListingSchema } from '../schemas/listing.schema'; // Import Listing schema
import { User, UserSchema } from '../schemas/user.schema'; // Import User schema
import { ListingBooking, ListingBookingSchema } from 'src/schemas/listingBookings.schema';
import { ListingReview, ListingReviewSchema } from 'src/schemas/listingReviews.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6h' },
    }),
    MongooseModule.forFeature([
      { name: Listing.name, schema: ListingSchema },
      { name: User.name, schema: UserSchema },
      { name: HostListing.name, schema: HostListingSchema },
      { name: ListingBooking.name, schema: ListingBookingSchema },
      { name: ListingReview.name, schema: ListingReviewSchema },
    ]),
  ],
  controllers: [HostListingsController],
  providers: [HostListingsService],
})
export class HostListingsModule { }
