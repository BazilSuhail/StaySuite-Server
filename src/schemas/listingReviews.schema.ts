import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

// Subdocument schema for reviews
const ReviewSchema = new MongooseSchema({
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String, required: true },
  date: { type: Date, default: Date.now }, // Added default date field
  userID: { type: MongooseSchema.Types.ObjectId, ref: 'User', required: true },
});

@Schema()
export class ListingReview extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Listing', required: true })
  _id: Types.ObjectId;

  @Prop({
    type: Number,
    default: 0,
    set: (value: number) => parseFloat(value.toFixed(2)),
  })
  averageRating: number;

  @Prop({ type: [ReviewSchema], default: [] })
  reviews: {
    rating: number;
    review: string;
    date: Date; // Ensure 'date' field is required
    userID: Types.ObjectId;
  }[];
}

export const ListingReviewSchema = SchemaFactory.createForClass(ListingReview);
