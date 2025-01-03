import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listing } from '../schemas/listing.schema';
import { User } from '../schemas/user.schema';
import { HostListing } from '../schemas/hostListings.schema';
import { ListingBooking } from '../schemas/listingBookings.schema';
import { ListingReview } from '../schemas/listingReviews.schema';

@Injectable()
export class HostListingsService {
  constructor(
    @InjectModel(Listing.name) private listingModel: Model<Listing>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(HostListing.name) private hostingListingsModel: Model<HostListing>,
    @InjectModel(ListingBooking.name) private listingBookingModel: Model<ListingBooking>,
    @InjectModel(ListingReview.name) private listingReviewModel: Model<ListingReview>,
  ) { }

  async addListing(createListingDto: any, userId: string): Promise<Listing> {
    const newListing = new this.listingModel({
      ...createListingDto,
      hostID: userId,
      bookingsMade: 0,
      favourite_count: 0,
    });
    await newListing.save();

    const user = await this.userModel.findById(userId).select('role hosted_listings');
    if (user && user.role === 'Host') {
      const newListingBooking = new this.listingBookingModel({
        _id: newListing._id,
        bookings: [],
      });
      await newListingBooking.save();

      const hostingListingsDoc = await this.hostingListingsModel.findById(user.hosted_listings);
      if (hostingListingsDoc) {
        hostingListingsDoc.listings.push(newListing._id.toString());
        await hostingListingsDoc.save();
      }

      user.hosted_listings = user.hosted_listings;
      await user.save();
    }

    const newListingReview = new this.listingReviewModel({
      _id: newListing._id,
      reviews: [],
    });
    await newListingReview.save();

    return newListing;
  }

  async getHostedListings(userId: string): Promise<Listing[]> {
    const user = await this.userModel.findById(userId).select('hosted_listings role');
    if (!user || user.role !== 'Host') {
      throw new ForbiddenException('Access denied. User is not a host.');
    }

    const hostingListingsDoc = await this.hostingListingsModel.findById(user.hosted_listings);
    if (!hostingListingsDoc) {
      throw new NotFoundException('Hosted listings not found.');
    }

    const listings = [];
    for (const listingId of hostingListingsDoc.listings) {
      const listing = await this.listingModel.findById(listingId);
      if (listing) {
        listings.push(listing);
      } 
      else {
        console.warn(`Listing with ID ${listingId} not found.`);
      }
    }
    // console.log(listings)
    return listings;
  }

  async updateListing(id: string, updateData: any): Promise<Listing> {
    const listing = await this.listingModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!listing) {
      throw new Error('Listing not found');
    }
    return listing;
  }

  async deleteListing(listingId: string, userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).select('hosted_listings');
    if (!user) {
      throw new Error('User not found');
    }

    const hostingListingsDoc = await this.hostingListingsModel.findById(user.hosted_listings);
    if (!hostingListingsDoc) {
      throw new Error('No hosted listings found for this user');
    }

    await this.hostingListingsModel.findByIdAndUpdate(user.hosted_listings, {
      $pull: { listings: listingId },
    });

    await this.listingModel.findByIdAndDelete(listingId);
    await this.listingReviewModel.findByIdAndDelete(listingId);
    await this.listingBookingModel.findByIdAndDelete(listingId);

    return { message: 'Listing deleted successfully' };
  }
}
