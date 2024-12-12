const mongoose = require('mongoose');

const HostBookingSchema = new mongoose.Schema({ 
  bookingsMade: {
    type: Number,
    required: true,
  },
  bookings: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('hostbookings', HostBookingSchema);
