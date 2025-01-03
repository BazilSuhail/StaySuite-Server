import { IsNotEmpty, IsString } from 'class-validator';

export class FinalizeBookingDto {
  @IsNotEmpty()
  @IsString()
  bookingId: string;
}
