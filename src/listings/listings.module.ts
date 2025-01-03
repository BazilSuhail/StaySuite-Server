import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { Listing, ListingSchema } from '../schemas/listing.schema';
import { FavouriteListings, FavouriteListingsSchema } from '../schemas/favouriteListing.schema';
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
      { name: FavouriteListings.name, schema: FavouriteListingsSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class ListingsModule { }
