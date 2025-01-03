import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { HostBookingsService } from './hostBooking.service';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Controller('air-bnb/manage-bookings')
export class HostBookingsController {
  constructor(private readonly hostBookingsService: HostBookingsService) {}

  // Get Host's Bookings
  @Get('/host-listings-bookings')
  @UseGuards(JwtAuthGuard)
  async getHostBookings(@Param('userId') userId: string) {
    return await this.hostBookingsService.getHostBookings(userId);
  }

  // Update Booking Status
  @Put('/update-booking-status')
  @UseGuards(JwtAuthGuard)
  async updateBookingStatus(@Body() body: { bookingID: string, status: string }) {
    return await this.hostBookingsService.updateBookingStatus(body.bookingID, body.status);
  }

  // Get User Details by ID
  @Get('/get-reservers-details/:userId')
  async getUserDetailsById(@Param('userId') userId: string) {
    return await this.hostBookingsService.getUserDetailsById(userId);
  }

  // Get Booking Details for Notification
  @Get('/booking-details/:bookingId')
  async getBookingDetailsForNotification(@Param('bookingId') bookingId: string) {
    return await this.hostBookingsService.getBookingDetailsForNotification(bookingId);
  }
}
