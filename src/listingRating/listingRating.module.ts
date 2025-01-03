import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListingRatingController } from './listingRating.controller';
import { ListingRatingService } from './listingRating.service';
import { Listing, ListingSchema } from '../schemas/listing.schema';
import { ListingReview, ListingReviewSchema } from '../schemas/listingReviews.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6h' },
    }),
    MongooseModule.forFeature([
      { name: Listing.name, schema: ListingSchema },
      { name: ListingReview.name, schema: ListingReviewSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ListingRatingController],
  providers: [ListingRatingService],
})
export class ListingRatingModule { }
