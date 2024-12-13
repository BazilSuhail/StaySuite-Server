const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const { getProfile, updateProfile, getFavoriteListings,getUserNotifications } = require('../controllers/profileController'); 

const router = express.Router();

router.get('/user-info', authenticate, getProfile);
router.put('/update-info', authenticate, updateProfile);
router.get('/guest-favourites', authenticate, getFavoriteListings);
router.get('/notifications', authenticate, getUserNotifications);

module.exports = router;
