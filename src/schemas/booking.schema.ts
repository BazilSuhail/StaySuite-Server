import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class Booking extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Listing', required: true, index: true })
  listingId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userID: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date, required: true })
  checkIn: Date;

  @Prop({ type: Date, required: true })
  checkOut: Date;

  @Prop({
    type: {
      adults: { type: Number, required: true, default: 1 },
      children: { type: Number, required: true, default: 0 },
      infants: { type: Number, required: true, default: 0 },
    },
  })
  guests: {
    adults: number;
    children: number;
    infants: number;
  };

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({ type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' })
  paymentStatus: string;

  @Prop({ type: String, default: '' })
  specialRequests: string;

  @Prop({
    type: String,
    enum: ['pending', 'confirmed', 'approved', 'rejected', 'completed'],
    default: 'pending',
  })
  status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
