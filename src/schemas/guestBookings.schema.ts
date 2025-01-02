import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class GuestListingBooking extends Document {
  @Prop({
    type: [
      {
        listingId: { type: MongooseSchema.Types.ObjectId, ref: 'Listings' },
        listingImage: { type: String },
        listingSuburb: { type: String },
        listingCountry: { type: String },
        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },
        guests: {
          adults: { type: Number, required: true },
          children: { type: Number, required: true },
          infants: { type: Number, required: true },
        },
        totalAmount: { type: Number, required: true },
      },
    ],
    _id: false,
    default: [],
  })
  bookingHistory: {
    listingId: MongooseSchema.Types.ObjectId;
    listingImage: string;
    listingSuburb: string;
    listingCountry: string;
    checkIn: Date;
    checkOut: Date;
    guests: {
      adults: number;
      children: number;
      infants: number;
    };
    totalAmount: number;
  }[];

  @Prop({ type: [String], default: [] })
  bookings: string[];
}

export const GuestListingBookingSchema = SchemaFactory.createForClass(GuestListingBooking);
