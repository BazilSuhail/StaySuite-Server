const Booking = require('../models/bookings');
const Listing = require('../models/listings');
const ListingBooking = require('../models/listing_bookings');
const GuestBooking = require('../models/guest_bookings');
const HostBooking = require('../models/host_bookings');
const Notification = require('../models/notifications');
const { sendMessageToUser } = require('../socket'); // Import helper functions


exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listingId, hostId, checkIn, checkOut, guests, totalAmount, specialRequests } = req.body;

    const newBooking = new Booking({
      listingId,
      userID: userId,
      checkIn,
      checkOut,
      guests,
      totalAmount,
      specialRequests,
    });
    await newBooking.save();
    //console.log(newBooking._id)

    const listingBooking = await ListingBooking.findById(listingId);
    if (!listingBooking) {
      return res.status(404).json({ error: 'Listing\'s booking document not found.' });
    }

    listingBooking.bookings.push(newBooking._id);
    await listingBooking.save();

    const guestBooking = await GuestBooking.findById(userId);
    if (!guestBooking) {
      return res.status(404).json({ error: 'User guest booking document not found.' });
    }

    guestBooking.bookings.push(newBooking._id);
    await guestBooking.save();

    const hostBooking = await HostBooking.findById(hostId);

    if (!hostBooking) {
      const newHostBooking = new HostBooking({
        _id: hostId,
        bookingsMade: 1,
        bookings: [newBooking._id],
      });
      await newHostBooking.save();
    }
    else {
      hostBooking.bookingsMade += 1;
      hostBooking.bookings.push(newBooking._id);
      await hostBooking.save();
    }

    const ListingAddress = await Listing.findById(listingId).select("address");
    //console.log(ListingAddress.country);

    // Notify the host
    const message = {
      message: "Your Listing has a new reservation",
      location: ListingAddress.address.suburb + ", " + ListingAddress.address.country,
      details: specialRequests,
      listing_Id: listingId,
      bookingId: newBooking._id,
    };

    sendMessageToUser(hostId, message);

    // saving notification
    const saveNotification = await Notification.findById(hostId);

    saveNotification.notifications.push(message);
    await saveNotification.save();

    res.status(201).json({
      message: 'Booking created successfully!',
      booking: newBooking,
    });
  }
  catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};


exports.getBlockedDates = async (req, res) => {
  try {
    const listingId = req.params.listingId;
    //console.log(listingId);

    const listingBooking = await ListingBooking.findById(listingId);
    if (!listingBooking) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (!listingBooking.bookings || listingBooking.bookings.length === 0) {
      return res.status(200).json({ message: 'No bookings found', blockedDates: [] });
    }

    const bookings = await Promise.all(
      listingBooking.bookings.map(async (bookingId) => {
        return await Booking.findById(bookingId).lean();
      })
    );

    let blockedDates = [];
    bookings.forEach((booking) => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);

      for (let date = checkIn; date <= checkOut; date.setDate(date.getDate() + 1)) {
        blockedDates.push(new Date(date));
      }
    });;

    res.status(200).json({ blockedDates });
  }
  catch (error) {
    console.error('Error fetching blocked dates:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

exports.getGuestBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const guestBookings = await GuestBooking.findById(userId);

    if (!guestBookings) {
      return res.status(404).json({ message: 'No bookings found for this user.' });
    }

    const bookingsDetails = await Promise.all(
      guestBookings.bookings.map(async (bookingId) => {
        const booking = await Booking.findById(bookingId);

        if (!booking) {
          return null;
        }

        const listing = await Listing.findById(booking.listingId).select('name property_type bedrooms bathrooms');

        return {
          ...booking.toObject(),
          listing: listing
            ? {
              name: listing.name,
              property_type: listing.property_type,
              bedrooms: listing.bedrooms,
              bathrooms: listing.bathrooms,
            }
            : null,
        };
      })
    );

    res.status(200).json({ bookings: bookingsDetails });
  } catch (error) {
    console.error('Error fetching guest bookings:', error);
    res.status(500).json({ error: 'Failed to fetch guest bookings.' });
  }
};

exports.getGuestBookingsHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch guest bookings by userId
    const guestBookings = await GuestBooking.findById(userId);

    if (!guestBookings || !guestBookings.bookingHistory.length) {
      return res.status(404).json({ message: 'No bookings found for this user.' });
    }
    //console.log(guestBookings.bookingHistory)

    res.status(200).json({ bookings: guestBookings.bookingHistory });
  } catch (error) {
    console.error('Error fetching guest bookings:', error);
    res.status(500).json({ error: 'Failed to fetch guest bookings.' });
  }
};


exports.finalizeBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    // Fetch the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const listing = await Listing.findById(booking.listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found.' });
    }
    // Create booking object to store
    const bookingObject = {
      listingId: booking.listingId,
      listingImage: listing.images.placePicture,
      listingSuburb: listing.address.suburb,
      listingCountry: listing.address.country,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      totalAmount: booking.totalAmount,
    };

    // Update GuestBooking collection
    let guestBooking = await GuestBooking.findById(userId);
    if (!guestBooking) {
      guestBooking = new GuestBooking({
        _id: userId,
        booking: [], // Ensure array is initialized if not present
        bookingHistory: [bookingObject],
      });
    }
    else {
      // Remove the booking ID from the 'booking' array if it exists
      const bookingIndex = guestBooking.bookings.indexOf(bookingId);
      if (bookingIndex > -1) {
        guestBooking.bookings.splice(bookingIndex, 1);
      }
      guestBooking.bookingHistory.push(bookingObject);
    }
    await guestBooking.save();

    // Update ListingBooking collection
    let listingBooking = await ListingBooking.findById(booking.listingId);
    if (!listingBooking) {
      listingBooking = new ListingBooking({
        _id: booking.listingId,
        previousBookings: [bookingObject],
      });
    }
    else {
      listingBooking.previousBookings.push(bookingObject);
    }
    await listingBooking.save();

    // Update Listing collection
    listing.bookingsMade = (listing.bookingsMade || 0) + 1;
    await listing.save();

    // Update HostBooking collection
    const hostId = listing.hostID;
    let hostBooking = await HostBooking.findById(hostId);
    if (!hostBooking) {
      hostBooking = new HostBooking({
        _id: hostId,
        bookingsMade: 1,
      });
    }
    else {
      hostBooking.bookingsMade = (hostBooking.bookingsMade || 0) + 1;
      // Remove the booking ID from the host's bookings array if it exists
      const bookingIndex = hostBooking.bookings.indexOf(bookingId);
      if (bookingIndex > -1) {
        hostBooking.bookings.splice(bookingIndex, 1);
      }
    }
    await hostBooking.save();

    res.status(200).json({ message: 'Booking finalized successfully.' });
  } catch (error) {
    console.error('Error finalizing booking:', error);
    res.status(500).json({ error: 'Failed to finalize booking. Please try again later.' });
  }
};