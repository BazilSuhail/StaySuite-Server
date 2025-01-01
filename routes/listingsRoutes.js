const express = require('express');
const { getListings, getListingById, toggleFavoriteListing, getListingById_for_users, getSearchedListings, getListingsByFiltersFromClient } = require('../controllers/listingsController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/listings', getListings);

router.get('/listings/:id', authenticate, getListingById);

router.get('/listing-details/:id', getListingById_for_users);

router.get('/listing-searched/:guests/:location', getSearchedListings);

router.post('/filtered-listings', getListingsByFiltersFromClient);


router.post('/listings/:listingId/toggle-favorite', authenticate, toggleFavoriteListing);


module.exports = router;
