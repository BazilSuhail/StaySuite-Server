import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ default: 'New User', trim: true })
  username: string;

  @Prop({ unique: true, lowercase: true, trim: true })
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
      validator: function (v) {
        return v.length <= 10;
      },
      message: 'You can specify up to 10 interests only.',
    },
  })
  interests: string[];

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: function (v) {
        return v.length <= 5;
      },
      message: 'You can specify up to 5 languages only.',
    },
  })
  languages: string[];

  @Prop({
    type: Object,
    default: { city: '', country: '' },
    validate: {
      validator: function (v: any) {
        return typeof v.city === 'string' && typeof v.country === 'string';
      },
      message: 'Location should have city and country as strings.',
    },
  })
  location: { city: string; country: string };

  @Prop({ default: '' })
  occupation: string;

  @Prop({ default: 'Tell us more about yourself!', maxlength: 1000 })
  about: string;

  @Prop({
    type: Object,
    default: { facebook: '', instagram: '', linkedin: '' },
    validate: {
      validator: function (v: any) {
        return (
          typeof v.facebook === 'string' &&
          typeof v.instagram === 'string' &&
          typeof v.linkedin === 'string'
        );
      },
      message: 'Social links should have facebook, instagram, and linkedin as strings.',
    },
  })
  socialLinks: { facebook: string; instagram: string; linkedin: string };

  @Prop({ default: false })
  verified: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'HostListing', default: null })
  hosted_listings: mongoose.Schema.Types.ObjectId;

  // Explicitly define createdAt and updatedAt as part of the model
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
