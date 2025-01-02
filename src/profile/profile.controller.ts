import { Controller, Get, Put, Body, Req, Query, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Controller('air-bnb/profile')
@UseGuards(JwtAuthGuard) // Apply authentication guard
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('user-info')
  async getProfile(@Req() req: any) {
    const userId = req.user.id;
    console.log("sdsd" + userId)
    return this.profileService.getProfile(userId);
  }

  @Put('update-info')
  async updateProfile(@Req() req: any, @Body() updateData: any) {
    const userId = req.user.id;
    return this.profileService.updateProfile(userId, updateData);
  }

  @Get('guest-favourites')
  async getFavoriteListings(@Req() req: any, @Query('page') page: string) {
    const userId = req.user.id;
    return this.profileService.getFavoriteListings(userId, parseInt(page, 10));
  }

  @Get('notifications')
  async getUserNotifications(@Req() req: any) {
    const userId = req.user.id;
    return this.profileService.getUserNotifications(userId);
  }
}
