import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { GuestBookingsService } from './guestBooking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { FinalizeBookingDto } from './dto/finalize-booking.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Controller('air-bnb/reservation')
export class GuestBookingsController {
  constructor(private readonly guestBookingsService: GuestBookingsService) {}

  @Post('create-booking')
  @UseGuards(JwtAuthGuard)
  async createBooking(@Body() createBookingDto: CreateBookingDto, @Req() req: any) {
    const userId = req.user.id;
    return this.guestBookingsService.createBooking(createBookingDto, userId);
  }

  @Get('get-reserved-bookings/:listingId')
  async getBlockedDates(@Param('listingId') listingId: string) {
    return this.guestBookingsService.getBlockedDates(listingId);
  }

  @Get('made-reservations')
  @UseGuards(JwtAuthGuard)
  async getGuestBookings(@Req() req: any) {
    const userId = req.user.id;
    return this.guestBookingsService.getGuestBookings(userId);
  }

  @Get('reservations-history')
  @UseGuards(JwtAuthGuard)
  async getGuestBookingsHistory(@Req() req: any) {
    const userId = req.user.id;
    return this.guestBookingsService.getGuestBookingsHistory(userId);
  }

  @Post('finalize-booking')
  @UseGuards(JwtAuthGuard)
  async finalizeBooking(@Body() finalizeBookingDto: FinalizeBookingDto, @Req() req: any) {
    const userId = req.user.id;
    return this.guestBookingsService.finalizeBooking(finalizeBookingDto, userId);
  }
}
