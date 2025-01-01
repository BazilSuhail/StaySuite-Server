const mongoose = require('mongoose');

const ListingBookingSchema = new mongoose.Schema({
  bookings: {
    type: [String],
    default: [],
  },
  previousBookings: {
    type: [
      {
        listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listings'},
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
    default: [],
  },
});

module.exports = mongoose.model('ListingBooking', ListingBookingSchema);
