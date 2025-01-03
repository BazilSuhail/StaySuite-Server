import { IsString, IsNumber, IsArray, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString()
  street: string;

  @IsString()
  suburb: string;

  @IsString()
  country: string;
}

class ImagesDto {
  @IsString()
  placePicture: string;

  @IsString()
  coverPicture: string;

  @IsArray()
  @IsString({ each: true })
  additionalPictures: string[];
}

export class CreateListingDto {
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
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  @IsObject()
  @ValidateNested()
  @Type(() => ImagesDto)
  images: ImagesDto;

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
