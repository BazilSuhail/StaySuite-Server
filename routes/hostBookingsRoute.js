const express = require('express');
const router = express.Router();
const { getHostBookings, updateBookingStatus, getUserDetailsById, getBookingDetailsForNotification } = require('../controllers/hostBookingsController');
const  authenticate  = require('../middleware/authMiddleware');  
 
router.get('/host-listings-bookings', authenticate, getHostBookings);

router.put('/update-booking-status', authenticate, updateBookingStatus);

router.get('/get-reservers-details/:userId', getUserDetailsById);

router.get('/booking-details/:bookingId', getBookingDetailsForNotification);


module.exports = router;
