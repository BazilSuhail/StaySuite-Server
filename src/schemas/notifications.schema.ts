import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notification extends Document {
  @Prop({
    type: [
      {
        type: Object,
      },
    ],
    default: [],
  })
  notifications: any[];

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
