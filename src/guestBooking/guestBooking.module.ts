import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuestBookingsController } from './guestBooking.controller';
import { GuestBookingsService } from './guestBooking.service';

import { Booking, BookingSchema } from 'src/schemas/booking.schema';
import { Listing, ListingSchema } from '../schemas/listing.schema';
import { GuestBookings, GuestBookingSchema } from 'src/schemas/guestBookings.schema';
import { HostBookings, HostBookingSchema } from 'src/schemas/hostBookings.schema';
import { ListingBooking, ListingBookingSchema } from 'src/schemas/listingBookings.schema';

import { JwtModule } from '@nestjs/jwt';
import { SocketGateway } from 'src/socket-gateway';
import { Notification, NotificationSchema } from 'src/schemas/notifications.schema';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6h' },
    }),
    MongooseModule.forFeature([
      { name: Listing.name, schema: ListingSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: GuestBookings.name, schema: GuestBookingSchema },
      { name: ListingBooking.name, schema: ListingBookingSchema },
      { name: HostBookings.name, schema: HostBookingSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [GuestBookingsController],
  providers: [GuestBookingsService, SocketGateway],
})
export class GuestBookingsModule { }
