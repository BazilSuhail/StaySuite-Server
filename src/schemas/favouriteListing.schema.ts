import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FavouriteListings extends Document {
  @Prop({ type: [String], default: [] })
  favourites: string[];
}

export const FavouriteListingsSchema = SchemaFactory.createForClass(FavouriteListings);
