import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listing } from '../schemas/listing.schema';
import { FavouriteListings } from '../schemas/favouriteListing.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name) private readonly listingModel: Model<Listing>,
    @InjectModel(FavouriteListings.name) private readonly favouriteListingsModel: Model<FavouriteListings>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getListings(page: number = 1, limit: number = 10, category: string = 'All') {
    const skip = (page - 1) * limit;
    const query = category === 'All' ? {} : { category };
    const listings = await this.listingModel.find(query).skip(skip).limit(limit).exec();
    const totalListings = await this.listingModel.countDocuments(query);

    return {
      listings,
      totalPages: Math.ceil(totalListings / limit),
      currentPage: page,
    };
  }

  async getListingsByFiltersFromClient(filters: any) {
    const { title, suburb, country, minPrice, maxPrice, category, beds, bathrooms } = filters;
    const query: any = {};

    if (title) query.title = { $regex: title, $options: 'i' };
    if (suburb) query['address.suburb'] = { $regex: suburb, $options: 'i' };
    if (country) query['address.country'] = { $regex: country, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = { ...(minPrice && { $gte: minPrice }), ...(maxPrice && { $lte: maxPrice }) };
    }
    if (category) query.category = category;
    if (beds) query.beds = { $gte: beds };
    if (bathrooms) query.bathrooms = { $gte: bathrooms };

    const listings = await this.listingModel.find(query);
    return listings;
  }

  async getListingById(listingId: string, userId: string) {
    if (!listingId) throw new BadRequestException('Invalid listing ID.');

    const listing = await this.listingModel.findById(listingId).exec();
    if (!listing) throw new NotFoundException('Listing not found.');

    const host = await this.userModel.findById(listing.hostID).select('createdAt username email').exec();
    if (!host) throw new NotFoundException('Host not found.');

    const favouriteListings = await this.favouriteListingsModel.findById(userId).exec();
    const isLiked = favouriteListings?.favourites.includes(listingId) || false;

    return {
      listing,
      isLiked,
      hostDetails: {
        createdAt: host.createdAt,
        name: host.username,
        email: host.email,
      },
    };
  }

  async getListingByIdForUsers(listingId: string) {
    if (!listingId) throw new BadRequestException('Invalid listing ID.');

    const listing = await this.listingModel.findById(listingId).exec();
    if (!listing) throw new NotFoundException('Listing not found.');

    const host = await this.userModel.findById(listing.hostID).select('createdAt username email').exec();
    if (!host) throw new NotFoundException('Host not found.');

    return {
      listing,
      hostDetails: {
        createdAt: host.createdAt,
        name: host.username,
        email: host.email,
      },
    };
  }

  async toggleFavoriteListing(userId: string, listingId: string) {
    const listing = await this.listingModel.findById(listingId).exec();
    if (!listing) throw new NotFoundException('Listing not found.');

    let favouriteListings = await this.favouriteListingsModel.findById(userId).exec();
    if (!favouriteListings) {
      favouriteListings = new this.favouriteListingsModel({ _id: userId, favourites: [] });
    }

    const isFavorite = favouriteListings.favourites.includes(listingId);
    if (isFavorite) {
      favouriteListings.favourites = favouriteListings.favourites.filter((id) => id !== listingId);
      listing.favourite_count = Math.max(0, (listing.favourite_count || 0) - 1);
    } else {
      favouriteListings.favourites.push(listingId);
      listing.favourite_count = (listing.favourite_count || 0) + 1;
    }

    await favouriteListings.save();
    await listing.save();

    return {
      message: isFavorite
        ? 'Listing removed from favorites.'
        : 'Listing added to favorites.',
      favorites: favouriteListings.favourites,
    };
  }
}
