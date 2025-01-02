import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose'; 

@Schema()
export class ListingReview extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Listing', required: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: Number,
    default: 0,
    set: (value: number) => parseFloat(value.toFixed(2)),
  })
  averageRating: number;

  @Prop({
    type: [
      {
        rating: { type: Number, min: 1, max: 5, required: true },
        review: { type: String, required: true },
        date: { type: Date, default: Date.now },
        userID: { type: MongooseSchema.Types.ObjectId, ref: 'User', required: true },
      },
    ],
    default: [],
  })
  reviews: {
    rating: number;
    review: string;
    date: Date;
    userID: MongooseSchema.Types.ObjectId;
  }[];
}

export const ListingReviewSchema = SchemaFactory.createForClass(ListingReview);
