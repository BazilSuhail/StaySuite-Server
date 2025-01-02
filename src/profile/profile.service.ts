import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { FavouriteListings } from '../schemas/favouriteListing.schema';
import { Listing } from '../schemas/listing.schema';
import { Notification } from '../schemas/notifications.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(FavouriteListings.name) private readonly favouriteListingsModel: Model<FavouriteListings>,
    @InjectModel(Listing.name) private readonly listingModel: Model<Listing>,
    @InjectModel(Notification.name) private readonly notificationModel: Model<Notification>,
  ) {}

  async getProfile(userId: string): Promise<User> {
    console.log(`Fetching profile for userId: ${userId}`);
  
    // Attempt to find the user by ID
    const user = await this.userModel.findById(userId).select('-password').exec();
    
    // Log the result of the user search
    console.log('User found:', user);
  
    // If user not found, throw an exception and log it
    if (!user) {
      console.error('User not found');
      throw new NotFoundException('User not found');
    }
  
    // Log successful user retrieval
    console.log('Returning user profile:', user);
  
    return user;
  }
  

  async updateProfile(userId: string, updateData: any): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async getFavoriteListings(userId: string, page: number = 1) {
    const pageSize = 5;
    const userFavorites = await this.favouriteListingsModel.findById(userId).exec();

    if (!userFavorites || userFavorites.favourites.length === 0) {
      throw new NotFoundException('No favorite listings found');
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const favoriteListingIds = userFavorites.favourites.slice(startIndex, endIndex);

    const favoriteListings = await Promise.all(
      favoriteListingIds.map((id) => this.listingModel.findById(id).exec()),
    );

    const validListings = favoriteListings.filter((listing) => listing !== null);

    return {
      listings: validListings,
      currentPage: page,
      totalPages: Math.ceil(userFavorites.favourites.length / pageSize),
    };
  }

  async getUserNotifications(userId: string) {
    const userNotifications = await this.notificationModel.findById(userId).select('notifications').exec();

    if (!userNotifications || !userNotifications.notifications) {
      throw new NotFoundException('No notifications found');
    }

    return userNotifications.notifications;
  }
}
