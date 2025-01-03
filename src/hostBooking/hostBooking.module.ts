import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HostBookingsController } from './hostBooking.controller';
import { HostBookingsService } from './hostBooking.service';
import { Booking, BookingSchema } from '../schemas/booking.schema';
import { Listing, ListingSchema } from '../schemas/listing.schema';
import { HostBookings, HostBookingSchema } from '../schemas/hostBookings.schema';
import { Notification, NotificationSchema } from '../schemas/notifications.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { SocketGateway } from '../socket-gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6h' },
    }),
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Listing.name, schema: ListingSchema },
      { name: HostBookings.name, schema: HostBookingSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [HostBookingsController],
  providers: [HostBookingsService, SocketGateway],
})
export class HostBookingsModule { }
