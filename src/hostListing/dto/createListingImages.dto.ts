import { IsString, IsArray, IsOptional, IsNumber, IsObject } from 'class-validator';

export class CreateListingWithImagesDto {
  @IsString()
  name: string;

  @IsString()
  summary: string;

  @IsString()
  property_type: string;

  @IsNumber()
  bedrooms: number;

  @IsNumber()
  bathrooms: number;

  @IsNumber()
  price: number;

  @IsNumber()
  bookingsMade: number;

  @IsObject()
  address: { street: string; suburb: string; country: string };

  @IsArray()
  amenities: string[];

  @IsObject()
  images: { placePicture: string; coverPicture: string; additionalPictures: string[] };

  @IsString()
  hostID: string;

  @IsNumber()
  favourite_count: number;

  @IsNumber()
  maxGuests: number;

  @IsString()
  category: string;

  @IsNumber()
  rating: number;
}
