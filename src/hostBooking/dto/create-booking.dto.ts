import { IsNotEmpty, IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  listingId: string;

  @IsNotEmpty()
  @IsString()
  hostId: string;

  @IsNotEmpty()
  @IsDate()
  checkIn: Date;

  @IsNotEmpty()
  @IsDate()
  checkOut: Date;

  @IsNotEmpty()
  @IsNumber()
  guests: number;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsString()
  specialRequests?: string;
}
