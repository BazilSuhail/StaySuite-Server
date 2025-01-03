import { IsString, IsNumber, IsArray, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  suburb?: string;

  @IsString()
  @IsOptional()
  country?: string;
}

class ImagesDto {
  @IsString()
  @IsOptional()
  placePicture?: string;

  @IsString()
  @IsOptional()
  coverPicture?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  additionalPictures?: string[];
}

export class UpdateListingDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  property_type?: string;

  @IsNumber()
  @IsOptional()
  bedrooms?: number;

  @IsNumber()
  @IsOptional()
  bathrooms?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  bookingsMade?: number;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsObject()
  @ValidateNested()
  @Type(() => ImagesDto)
  @IsOptional()
  images?: ImagesDto;

  @IsString()
  @IsOptional()
  hostID?: string;

  @IsNumber()
  @IsOptional()
  favourite_count?: number;

  @IsNumber()
  @IsOptional()
  maxGuests?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  rating?: number;
}
