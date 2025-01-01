const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'listings',
    required: true,
    index: true, 
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  guests: {
    adults: {
      type: Number,
      required: true,
      default: 1,
    },
    children: {
      type: Number,
      required: true,
      default: 0,
    },
    infants: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending', 
  },
  specialRequests: {
    type: String, 
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'approved','rejected', 'completed'], 
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

module.exports = mongoose.model('Booking', BookingSchema);
