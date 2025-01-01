const Listing = require('../models/listings');
const ListingReview = require('../models/listings_reviews');
const User = require('../models/user');

exports.addRating = async (req, res) => {
  try {
    const { listingId, rating, review } = req.body;
    const userId = req.user.id;
    //console.log(userId)

    if (!listingId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid data. Rating must be between 1 and 5.' });
    }

    let listingReview = await ListingReview.findById(listingId);

    if (!listingReview) {
      listingReview = new ListingReview({ _id: listingId, reviews: [], averageRating: 0 });
    }

    const newReview = {
      rating: parseFloat(rating.toFixed(2)),
      review,
      userID: userId,
    };

    listingReview.reviews.push(newReview);

    const totalRatings = listingReview.reviews.length;
    const totalScore = listingReview.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    listingReview.averageRating = parseFloat((totalScore / totalRatings).toFixed(2));

    const listingDocumentRating = await Listing.findById(listingId);
    listingDocumentRating.rating = listingReview.averageRating;

    // saving both rating in document of listings
    await listingReview.save();
    await listingDocumentRating.save();

    res.status(201).json({
      message: 'Review added successfully.',
      listingReview,
    });
  }
  catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

exports.getRatingAndReviewCount = async (req, res) => {
  try {
    const listingId = req.params.listingId;
    let item = await ListingReview.findById(listingId).select('averageRating reviews');

    if (!item) {
      return res.status(404).json({ message: 'Listing Reviews not found' });
    }

    const response = {
      averageRating: item.averageRating,
      arraySize: item.reviews.length,
    };

    return res.json(response);
  }
  catch (error) {
    console.error('Error finding item:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getPaginatedReviews = async (req, res) => {
  try {
    const listingId = req.params.listingId;
    const { page = 1, limit = 5 } = req.query;
    //console.log(listingId);

    const listingReview = await ListingReview.findById(listingId);

    if (!listingReview) {
      return res.status(404).json({ error: 'Listing reviews not found.' });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit);
    const paginatedReviews = listingReview.reviews.slice(startIndex, endIndex);

    const reviewsWithUserDetails = await Promise.all(
      paginatedReviews.map(async (review) => {
        const user = await User.findById(review.userID).select('username profilePicture location');
        //console.log(user)
        return {
          ...review._doc,
          user: user ? { username: user.username, profilePicture: user.profilePicture, location: user.location } : null,
        };
      })
    );

    //console.log(reviewsWithUserDetails)

    res.status(200).json({
      reviews: reviewsWithUserDetails,
      currentPage: Number(page),
      totalPages: Math.ceil(listingReview.reviews.length / limit),
    });
  }
  catch (error) {
    console.error('Error fetching paginated reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews. Please try again later.' });
  }
};