const mongoose = require('mongoose');

const GuestListingBookingSchema = new mongoose.Schema({
  bookingHistory: {
    type: [
      {
        listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listings' },
        listingImage: { type: String },
        listingSuburb: { type: String },
        listingCountry: { type: String },
        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },
        guests: {
          adults: { type: Number, required: true },
          children: { type: Number, required: true },
          infants: { type: Number, required: true },
        },
        totalAmount: { type: Number, required: true },
      },
    ],
    _id: false,
    default: [],
  },
  bookings: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('guestbookings', GuestListingBookingSchema);
