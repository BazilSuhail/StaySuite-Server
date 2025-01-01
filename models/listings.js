const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  property_type: {
    type: String,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  bookingsMade: {
    type: Number,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    suburb: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  amenities: {
    type: [String],
    default: [],
  },
  images: {
    placePicture: {
      type: String,
      default: '',
    },
    coverPicture: {
      type: String,
      default: '',
    },
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
  hostID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  listingBookingID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ListingBooking',
    required: false,
  },
  favourite_count: {
    type: Number,
    default: 0,
  },
  maxGuests: {
    type: Number,
    default: 2, 
    validate: {
      validator: function (v) {
        return v > 0;
      },
      message: 'Number of guests must be greater than 0.',
    },
  },
  category: {
    type: String,
    default: 'Apartment',
  },
  rating: {
    type: Number,
    default: 0,
    validate: {
      validator: function (v) {
        return v >= 0 && v <= 5;
      },
      message: 'Rating must be between 0 and 5.',
    },
    get: (v) => parseFloat(v.toFixed(2)),
    set: (v) => parseFloat(v.toFixed(2)),
  },
});

module.exports = mongoose.model('Listing', ListingSchema);
