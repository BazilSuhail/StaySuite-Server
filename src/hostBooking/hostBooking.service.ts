import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../schemas/booking.schema';
import { Listing } from '../schemas/listing.schema';
import { HostBookings } from '../schemas/hostBookings.schema';
import { Notification } from '../schemas/notifications.schema';
import { User } from '../schemas/user.schema';
import { SocketGateway } from '../socket-gateway';

@Injectable()
export class HostBookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
    @InjectModel(Listing.name) private readonly listingModel: Model<Listing>,
    @InjectModel(HostBookings.name) private readonly hostBookingModel: Model<HostBookings>,
    @InjectModel(Notification.name) private readonly notificationModel: Model<Notification>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly socketGateway: SocketGateway
  ) { }

  // Get Host's Bookings
  async getHostBookings(userId: string) {
    const hostedBookings = await this.hostBookingModel.findOne({ userId });

    if (!hostedBookings) {
      throw new NotFoundException('No bookings found for this host.');
    }

    const enrichedBookings = await Promise.all(
      hostedBookings.bookings.map(async (bookingId) => {
        const booking = await this.bookingModel.findById(bookingId);
        if (!booking) return null;

        const listing = await this.listingModel.findById(booking.listingId).select('name property_type');
        return {
          ...booking.toObject(),
          listingDetails: listing,
        };
      })
    );

    return enrichedBookings.filter((booking) => booking !== null);
  }

  // Update Booking Status
  async updateBookingStatus(bookingID: string, status: string) {
    const updatedBooking = await this.bookingModel.findByIdAndUpdate(bookingID, { status }, { new: true });

    if (!updatedBooking) {
      throw new NotFoundException('Booking not found.');
    }

    const host = await this.listingModel.findById(updatedBooking.listingId).select('hostID address');
    const hostName = await this.userModel.findById(host.hostID).select('username');

    const newCheckIn = new Date(updatedBooking.checkIn).toDateString();
    const newCheckOut = new Date(updatedBooking.checkOut).toDateString();

    const message = {
      message: 'Your reservation is updated',
      title: `Reservation Status Updated to ${status}`,
      details: `Your reservation for "${host.address.suburb}" between "${newCheckIn}" and "${newCheckOut}" has been updated to "${status}" by Host "${hostName.username}".`,
      address: `${host.address.suburb}, ${host.address.country}`,
      checkInOut: `"${newCheckIn}" and "${newCheckOut}"`,
      UpdatedStatus: status,
      host: hostName.username,
      listingId: updatedBooking.listingId,
    };

    this.socketGateway.sendMessageToUser(String(updatedBooking.userID), message);

    // Saving notification
    const saveNotification = await this.notificationModel.findById(updatedBooking.userID);
    saveNotification.notifications.push(message);
    await saveNotification.save();

    return updatedBooking;
  }

  // Get User Details
  async getUserDetailsById(userId: string) {
    //console.log(userId)
    const user = await this.userModel.findById(userId).select('location username email bio socialLinks');
    //console.log(user)
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const user_detials = {
      location: user.location,
      username: user.username,
      email: user.email,
      bio: user.bio,
      socialLinks: user.socialLinks,
    }
    return user_detials;
    /*return {
       location: user.location,
       username: user.username,
       email: user.email,
       bio: user.bio,
       socialLinks: user.socialLinks,
    };*/
  }

  // Get Booking Details for Notification
  async getBookingDetailsForNotification(bookingId: string) {
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found.');
    }

    const listing = await this.listingModel.findById(booking.listingId).select('name property_type');
    return { booking, listing };
  }
}
