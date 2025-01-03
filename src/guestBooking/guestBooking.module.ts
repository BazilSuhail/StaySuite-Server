import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuestBookingsController } from './guestBooking.controller';
import { GuestBookingsService } from './guestBooking.service';


import { Booking, BookingSchema } from 'src/schemas/booking.schema';
import { Listing, ListingSchema } from '../schemas/listing.schema'; // Import Listing schema
import { GuestBookings, GuestBookingSchema } from 'src/schemas/guestBookings.schema';
import { HostBooking, HostBookingSchema } from 'src/schemas/hostBookings.schema';
import { ListingBooking, ListingBookingSchema } from 'src/schemas/listingBookings.schema';

import { JwtModule } from '@nestjs/jwt';
import { SocketGateway } from 'src/socket-gateway';

/*

import { Booking, Listing, GuestBookings, HostBooking, ListingBooking } from '../schemas/'; // Replace with actual models
*/

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
      { name: HostBooking.name, schema: HostBookingSchema },
    ]),
  ],
  controllers: [GuestBookingsController],
  providers: [GuestBookingsService, SocketGateway],
})
export class GuestBookingsModule { }
