import { Controller, Get, Post, Param, Query, Body, Req, UseGuards } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Controller('air-bnb/home')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get('listings')
  async getListings(@Query('page') page: string, @Query('limit') limit: string, @Query('category') category: string) {
    return this.listingsService.getListings(parseInt(page, 10), parseInt(limit, 10), category);
  }

  @Get('listings/:id')
  @UseGuards(JwtAuthGuard)
  async getListingById(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    return this.listingsService.getListingById(id, userId);
  }

  @Get('listing-details/:id')
  async getListingByIdForUsers(@Param('id') id: string) {
    return this.listingsService.getListingByIdForUsers(id);
  }

  @Post('filtered-listings')
  async getListingsByFiltersFromClient(@Body() filters: any) {
    return this.listingsService.getListingsByFiltersFromClient(filters);
  }

  @Post('listings/:listingId/toggle-favorite')
  @UseGuards(JwtAuthGuard)
  async toggleFavoriteListing(@Param('listingId') listingId: string, @Req() req: any) {
    const userId = req.user.id;
    return this.listingsService.toggleFavoriteListing(userId, listingId);
  }
}
