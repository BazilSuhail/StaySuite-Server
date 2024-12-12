const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    //required: true, 
    //unique: true, 
    default: 'User 1',
    trim: true
  },
  email: {
    type: String,
    //required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    //required: true, 
    minlength: 6
  },
  phoneNumber: {
    type: String, 
    default: '03*********', 
  },
  role: {
    type: String,
    enum: ['Host', 'Guest'],
    default: 'Guest'
  },
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  dob: {
    type: Date,
    //required: true 
  },
  profilePicture: {
    type: String,
    default: 'https://example.com/default-profile.png'
  },
  phoneNumber: {
    type: String,
    //required: true, 
    validate: {
      validator: function (v) {
        return /^\+?[1-9]\d{1,14}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  bio: {
    type: String,
    default: 'Hi, I’m new here!',
    maxlength: 500
  },
  interests: {
    type: [String],
    default: [],
    validate: {
      validator: function (v) {
        return v.length <= 10;
      },
      message: 'You can specify up to 10 interests only.'
    }
  },
  languages: {
    type: [String],
    default: [],
    validate: {
      validator: function (v) {
        return v.length <= 5;
      },
      message: 'You can specify up to 5 languages only.'
    }
  },
  location: {
    city: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  occupation: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    default: 'Tell us more about yourself!',
    maxlength: 1000
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  hosted_listings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HostListing',  // Reference to the HostListing document
    default: null
  }
});

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
