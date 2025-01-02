import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class HostListing extends Document {
  @Prop({ type: [String], default: [] })
  listings: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  hostID: MongooseSchema.Types.ObjectId;
}

export const HostListingSchema = SchemaFactory.createForClass(HostListing);
