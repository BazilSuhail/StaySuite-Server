import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true }) // Automatically manages `createdAt` and `updatedAt`
export class User extends Document {
  @Prop({ default: 'New User', trim: true })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ minlength: 6 })
  password: string;

  @Prop({ default: '03000000000' })
  phoneNumber: string;

  @Prop({ enum: ['Host', 'Guest'], default: 'Guest' })
  role: string;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop()
  dob: Date;

  @Prop({ default: '1' })
  profilePicture: string;

  @Prop({ default: 'Hi, I’m new here!', maxlength: 500 })
  bio: string;

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: (v: string[]) => v.length <= 10,
      message: 'You can specify up to 10 interests only.',
    },
  })
  interests: string[];

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: (v: string[]) => v.length <= 5,
      message: 'You can specify up to 5 languages only.',
    },
  })
  languages: string[];

  @Prop({
    type: {
      city: { type: String, default: '' },
      country: { type: String, default: '' },
    },
  })
  location: { city: string; country: string };

  @Prop({ default: '' })
  occupation: string;

  @Prop({ default: 'Tell us more about yourself!', maxlength: 1000 })
  about: string;

  @Prop({
    type: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
  })
  socialLinks: { facebook: string; instagram: string; linkedin: string };

  @Prop({ default: false })
  verified: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'HostListing',
    default: null,
  })
  hosted_listings: MongooseSchema.Types.ObjectId | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add index for email
//UserSchema.index({ email: 1 });
