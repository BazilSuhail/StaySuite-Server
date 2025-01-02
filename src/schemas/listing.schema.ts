import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Listing extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  property_type: string;

  @Prop({ required: true })
  bedrooms: number;

  @Prop({ required: true })
  bathrooms: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  bookingsMade: number;

  @Prop({
    type: {
      street: { type: String, required: true },
      suburb: { type: String, required: true },
      country: { type: String, required: true },
    },
  })
  address: { street: string; suburb: string; country: string };

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({
    type: {
      placePicture: { type: String, default: '' },
      coverPicture: { type: String, default: '' },
      additionalPictures: {
        type: [String],
        default: [],
        validate: {
          validator: function (v) {
            return v.length <= 5;
          },
          message: 'You can add up to 5 additional images only.',
        },
      },
    },
  })
  images: {
    placePicture: string;
    coverPicture: string;
    additionalPictures: string[];
  };

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  hostID: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ListingBooking', required: false })
  listingBookingID: MongooseSchema.Types.ObjectId;

  @Prop({ default: 0 })
  favourite_count: number;

  @Prop({ default: 2, validate: { validator: (v) => v > 0, message: 'Number of guests must be greater than 0.' } })
  maxGuests: number;

  @Prop({ default: 'Apartment' })
  category: string;

  @Prop({
    default: 0,
    validate: {
      validator: (v) => v >= 0 && v <= 5,
      message: 'Rating must be between 0 and 5.',
    },
    get: (v) => parseFloat(v.toFixed(2)),
    set: (v) => parseFloat(v.toFixed(2)),
  })
  rating: number;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
