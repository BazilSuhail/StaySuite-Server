import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class HostBooking extends Document {
  @Prop({ type: Number, required: true })
  bookingsMade: number;

  @Prop({ type: [String], default: [] })
  bookings: string[];
}

export const HostBookingSchema = SchemaFactory.createForClass(HostBooking);
