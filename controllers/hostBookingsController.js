const HostListings = require('../models/hosted_listings');
const Listing = require('../models/listings');
const HostBookings = require('../models/host_bookings');
const Booking = require('../models/bookings');
const Notification = require('../models/notifications');
const User = require('../models/user');
const { sendMessageToUser } = require('../socket');
 
exports.getHostBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const hostedBookings = await HostBookings.findById(userId);

    if (!hostedBookings) {
      return res.status(404).json({ message: 'No bookings found for this host.' });
    }

    const enrichedBookings = await Promise.all(
      hostedBookings.bookings.map(async (bookingId) => {
        const booking = await Booking.findById(bookingId);
        if (!booking) return null;

        const listing = await Listing.findById(booking.listingId).select('name property_type');

        return {
          ...booking.toObject(),
          listingDetails: listing,
        };
      })
    );

    const filteredBookings = enrichedBookings.filter((booking) => booking !== null);

    res.status(200).json({ bookings: filteredBookings });
  }
  catch (error) {
    console.error('Error fetching host bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings for host listings.' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingID, status } = req.body;
 
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingID,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const host_Id = await Listing.findById(updatedBooking.listingId).select("hostID address");
    //console.log(host_Id)
    const hostName = await User.findById(host_Id.hostID).select("username");
    //console.log(hostName)

    const newCheckIn = new Date(updatedBooking.checkIn).toDateString();
    const newCheckOut = new Date(updatedBooking.checkOut).toDateString();
    // Notify the host
    const message = {
      message: "Your reservation is updated",
      title: "Reservation Status Updated to ",
      details: `Your reservation for "${host_Id.address.suburb}","${host_Id.address.country}" between "${updatedBooking.checkIn}" and "${updatedBooking.checkOut}" has been update to "${status}" by Host "${hostName.username}".`,
      address: host_Id.address.suburb + ", " + host_Id.address.country,
      checkInOut: `"${newCheckIn}" and "${newCheckOut}"`,
      UpdatedStatus: status,
      host: hostName.username,
      listingId: updatedBooking.listingId
    };


    sendMessageToUser(String(updatedBooking.userID), message);
    // saving notification
    const saveNotification = await Notification.findById(updatedBooking.userID);
    
    saveNotification.notifications.push(message);
    await saveNotification.save();

    res.status(200).json({ message: 'Booking status updated.', booking: updatedBooking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status.' });
  }
};

exports.getUserDetailsById = async (req, res) => {
  try {
    const userId = req.params.userId;
    //console.log(userId)
    const user = await User.findById(userId).select('location username email bio socialLinks');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({
      message: 'User details fetched successfully.',
      user: {
        location: user.location,
        username: user.username,
        email: user.email,
        bio: user.bio,
        socialLinks: user.socialLinks,
      },
    });
  }
  catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details. Please try again later.' });
  }
};

/* notificaiotn */


exports.getBookingDetailsForNotification = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    console.log(bookingId)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    //console.log(booking)

    const listing = await Listing.findById(booking.listingId).select('name property_type');
 
    res.json({ booking, listing });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching booking details' });
  }
};
