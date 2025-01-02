import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { User, UserSchema } from '../schemas/user.schema';
import { FavouriteListings, FavouriteListingsSchema } from '../schemas/favouriteListing.schema';
import { Listing, ListingSchema } from '../schemas/listing.schema';
import { Notification, NotificationSchema } from '../schemas/notifications.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6h' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: FavouriteListings.name, schema: FavouriteListingsSchema },
      { name: Listing.name, schema: ListingSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule { }
