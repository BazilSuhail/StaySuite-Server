const express = require('express');
const router = express.Router();
const { addRating, getPaginatedReviews, getRatingAndReviewCount } = require('../controllers/listingRatingController'); 
const authenticate  = require('../middleware/authMiddleware'); 

router.post('/add-review', authenticate, addRating); 
router.get('/get-reviews/:listingId', getPaginatedReviews); 
router.get('/rating-review-count/:listingId', getRatingAndReviewCount); 

module.exports = router;
