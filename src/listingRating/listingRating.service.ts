import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Listing } from '../schemas/listing.schema';
import { ListingReview } from '../schemas/listingReviews.schema';
import { User } from '../schemas/user.schema';
import { CreateReviewDto } from './dto/listingReview.dto';

@Injectable()
export class ListingRatingService {
  constructor(
    @InjectModel(Listing.name) private readonly listingModel: Model<Listing>,
    @InjectModel(ListingReview.name) private readonly listingReviewModel: Model<ListingReview>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async addRating(userId: string, reviewData: CreateReviewDto) {
    const { listingId, rating, review } = reviewData;

    // Validate rating
    if (!listingId || !rating || rating < 1 || rating > 5) {
      throw new BadRequestException('Invalid data. Rating must be between 1 and 5.');
    }

    // Check if listing review exists
    let listingReview = await this.listingReviewModel.findById(listingId).exec();

    if (!listingReview) {
      listingReview = new this.listingReviewModel({ _id: listingId, reviews: [], averageRating: 0 });
    }

    // Add new review
    const newReview = {
      rating: parseFloat(rating.toFixed(2)),
      review,
      userID: new Types.ObjectId(userId), // Convert string to ObjectId
      date: new Date(), // Add required date field
    };

    listingReview.reviews.push(newReview);

    // Calculate the average rating
    const totalRatings = listingReview.reviews.length;
    const totalScore = listingReview.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    listingReview.averageRating = parseFloat((totalScore / totalRatings).toFixed(2));

    // Update listing's average rating
    const listingDocument = await this.listingModel.findById(listingId).exec();
    if (listingDocument) {
      listingDocument.rating = listingReview.averageRating;
      await listingDocument.save();
    }

    // Save the review
    await listingReview.save();

    return {
      message: 'Review added successfully.',
      listingReview,
    };
  }

  async getRatingAndReviewCount(listingId: string) {
    const listingReview = await this.listingReviewModel.findById(listingId).select('averageRating reviews').exec();

    if (!listingReview) {
      throw new NotFoundException('Listing Reviews not found.');
    }

    return {
      averageRating: listingReview.averageRating,
      reviewCount: listingReview.reviews.length,
    };
  }

  async getPaginatedReviews(listingId: string, page: number = 1, limit: number = 5) {
    const listingReview = await this.listingReviewModel.findById(listingId).exec();

    if (!listingReview) {
      throw new NotFoundException('Listing reviews not found.');
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = listingReview.reviews.slice(startIndex, endIndex);

    const reviewsWithUserDetails = await Promise.all(
      paginatedReviews.map(async (review) => {
        const user = await this.userModel.findById(review.userID).select('username profilePicture location').exec();
        return {
          rating: review.rating,
          review: review.review,
          date: review.date,
          userID: review.userID,
          user: user ? { username: user.username, profilePicture: user.profilePicture, location: user.location } : null,
        };
      }),
    );

    return {
      reviews: reviewsWithUserDetails,
      currentPage: page,
      totalPages: Math.ceil(listingReview.reviews.length / limit),
    };
  }
}
