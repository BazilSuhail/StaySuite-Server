import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { FinalizeBookingDto } from './dto/finalize-booking.dto';
import { Booking } from 'src/schemas/booking.schema';
import { Listing } from 'src/schemas/listing.schema';
import { GuestBookings } from 'src/schemas/guestBookings.schema';
import { HostBooking } from 'src/schemas/hostBookings.schema';
import { ListingBooking } from 'src/schemas/listingBookings.schema';
import { SocketGateway } from '../socket-gateway';

@Injectable()
export class GuestBookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
    @InjectModel(Listing.name) private readonly listingModel: Model<Listing>,
    @InjectModel(GuestBookings.name) private readonly guestBookingModel: Model<GuestBookings>,
    @InjectModel(HostBooking.name) private readonly hostBookingModel: Model<HostBooking>,
    @InjectModel(ListingBooking.name) private readonly listingBookingModel: Model<ListingBooking>,
    private readonly socketGateway: SocketGateway,
  ) { }

  // Create a new booking
  async createBooking(createBookingDto: CreateBookingDto, userId: string) {
    const { listingId, hostId, checkIn, checkOut, guests, totalAmount, specialRequests } = createBookingDto;

    const newBooking = new this.bookingModel({ listingId, userID: userId, checkIn, checkOut, guests, totalAmount, specialRequests });
    //await newBooking.save();

    const listingBooking = await this.listingBookingModel.findById(listingId);
    if (!listingBooking) throw new NotFoundException('Listing booking not found');
    listingBooking.bookings.push(newBooking._id.toString());
    await listingBooking.save();

    const guestBooking = await this.guestBookingModel.findById(userId);
    if (!guestBooking) throw new NotFoundException('Guest booking document kajsdnj not found');
    //console.log("asd = > " + userId);

    guestBooking.bookings.push(newBooking._id.toString());
    await guestBooking.save();

    const hostBooking = await this.hostBookingModel.findById(hostId);
    if (hostBooking) {
      hostBooking.bookingsMade += 1;
      hostBooking.bookings.push(newBooking._id.toString());
      await hostBooking.save();
    }
    else {
      const newHostBooking = new this.hostBookingModel({ _id: hostId, bookingsMade: 1, bookings: [newBooking._id] });
      await newHostBooking.save();
    }
 
    const ListingAddress = await this.listingModel.findById(listingId).select("address");
    const message = {
      message: "Your Listing has a new reservation",
      location: ListingAddress.address.suburb + ", " + ListingAddress.address.country,
      details: specialRequests,
      listing_Id: listingId,
      bookingId: newBooking._id,
    };
    this.socketGateway.sendMessageToUser(hostId, message);

    await newBooking.save();
    return { message: 'Booking created successfully!', booking: newBooking };
  }


  // Get blocked dates for a listing
  async getBlockedDates(listingId: string) {
    const listingBooking = await this.listingBookingModel.findById(listingId);
    if (!listingBooking) throw new NotFoundException('Listing not found');

    const bookings = await Promise.all(
      listingBooking.bookings.map((id) => this.bookingModel.findById(id))
    );

    const blockedDates = bookings.flatMap((booking) => {
      if (!booking) return [];

      const dates = [];
      const current = new Date(booking.checkIn);
      while (current <= new Date(booking.checkOut)) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    });

    return { blockedDates };
  }


  // Get all bookings for a guest
  async getGuestBookings(userId: string) {
    const guestBookings = await this.guestBookingModel.findById(userId);
    if (!guestBookings) throw new NotFoundException('No bookings found for this user');

    const bookingsDetails = await Promise.all(
      guestBookings.bookings.map(async (bookingId) => {
        const booking = await this.bookingModel.findById(bookingId);
        if (!booking) return null;

        const listing = await this.listingModel.findById(booking.listingId).select('name property_type bedrooms bathrooms');
        return {
          ...booking.toObject(),
          listing: listing ? listing.toObject() : null,
        };
      })
    );

    return { bookings: bookingsDetails.filter((b) => b !== null) };
  }

  // Get booking history for a guest
  async getGuestBookingsHistory(userId: string) {
    const guestBookings = await this.guestBookingModel.findById(userId);
    if (!guestBookings || !guestBookings.bookingHistory.length) throw new NotFoundException('No bookings history found for this user');

    return { bookings: guestBookings.bookingHistory };
  }

  // Finalize a booking
  async finalizeBooking(finalizeBookingDto: FinalizeBookingDto, userId: string) {
    const { bookingId } = finalizeBookingDto;

    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');

    const listing = await this.listingModel.findById(booking.listingId);
    if (!listing) throw new NotFoundException('Listing not found');

    const bookingObject = {
      listingId: booking.listingId,
      listingImage: listing.images.placePicture,
      listingSuburb: listing.address.suburb,
      listingCountry: listing.address.country,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      totalAmount: booking.totalAmount,
    };

    let guestBooking = await this.guestBookingModel.findById(userId);
    if (!guestBooking) {
      guestBooking = new this.guestBookingModel({
        _id: userId,
        bookingHistory: [bookingObject],
      });
    } else {
      guestBooking.bookings = guestBooking.bookings.filter((id) => id !== bookingId);
      guestBooking.bookingHistory.push(bookingObject);
    }
    await guestBooking.save();

    let listingBooking = await this.listingBookingModel.findById(booking.listingId);
    if (!listingBooking) {
      listingBooking = new this.listingBookingModel({
        _id: booking.listingId,
        previousBookings: [bookingObject],
      });
    } else {
      listingBooking.previousBookings.push(bookingObject);
    }
    await listingBooking.save();

    listing.bookingsMade = (listing.bookingsMade || 0) + 1;
    await listing.save();

    const hostBooking = await this.hostBookingModel.findById(listing.hostID);
    if (hostBooking) {
      hostBooking.bookingsMade = (hostBooking.bookingsMade || 0) + 1;
      hostBooking.bookings = hostBooking.bookings.filter((id) => id !== bookingId);
      await hostBooking.save();
    }

    return { message: 'Booking finalized successfully.' };
  }
}
