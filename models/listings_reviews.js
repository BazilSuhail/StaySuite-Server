const mongoose = require('mongoose');

const ListingReviewSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Listings', required: true },
  averageRating: {
    type: Number,
    default: 0,
    set: value => parseFloat(value.toFixed(2))
  },
  reviews: [
    {
      _id: false,
      rating: { type: Number, min: 1, max: 5, required: true },
      review: { type: String, required: true },
      date: { type: Date, default: Date.now },
      userID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    },
  ],
});

const ListingReview = mongoose.model('ListingReview', ListingReviewSchema);

module.exports = ListingReview;
