const express = require('express');
const { createBooking, getBlockedDates, getGuestBookings, finalizeBooking, getGuestBookingsHistory } = require('../controllers/guestBookingsController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Route to create a booking
router.post('/create-booking', authenticate, createBooking);

router.get('/get-reserved-bookings/:listingId', getBlockedDates);

router.get('/made-reservations', authenticate, getGuestBookings);

router.get('/reservations-history', authenticate, getGuestBookingsHistory);

router.post('/finalize-booking', authenticate, finalizeBooking);

module.exports = router;
