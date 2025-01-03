import { Controller, Post, Get, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ListingRatingService } from './listingRating.service';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Controller('air-bnb/listing-rating')
export class ListingRatingController {
  constructor(private readonly listingRatingService: ListingRatingService) {}

  @Post('add-review')
  @UseGuards(JwtAuthGuard)
  async addRating(@Req() req: any, @Body() reviewData: any) {
    const userId = req.user.id;
    return this.listingRatingService.addRating(userId, reviewData);
  }

  @Get('get-reviews/:listingId')
  async getPaginatedReviews(
    @Param('listingId') listingId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.listingRatingService.getPaginatedReviews(
      listingId,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get('rating-review-count/:listingId')
  async getRatingAndReviewCount(@Param('listingId') listingId: string) {
    return this.listingRatingService.getRatingAndReviewCount(listingId);
  }
}
