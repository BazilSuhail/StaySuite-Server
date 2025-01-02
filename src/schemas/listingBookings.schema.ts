import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose'; 

@Schema()
export class ListingBooking extends Document {
  @Prop({ type: [String], default: [] })
  bookings: string[];

  @Prop({
    type: [
      {
        listingId: { type: MongooseSchema.Types.ObjectId, ref: 'Listing' },
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
    default: [],
  })
  previousBookings: {
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
}

export const ListingBookingSchema = SchemaFactory.createForClass(ListingBooking);
