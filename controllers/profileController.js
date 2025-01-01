const User = require('../models/user');
const FavouriteListings = require('../models/favourite_listings');
const Listing = require('../models/listings');

const Notification = require('../models/notifications');


exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getFavoriteListings = async (req, res) => {
  try {
    const userId = req.user.id;
    //console.log(userId);
    const { page = 1 } = req.query;
    const pageSize = 5;

    const userFavorites = await FavouriteListings.findById(userId);

    if (!userFavorites || userFavorites.favourites.length === 0) {
      return res.status(404).json({ error: 'No favorite listings found.' });
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const favoriteListingIds = userFavorites.favourites.slice(startIndex, endIndex);

    const favoriteListings = await Promise.all(
      favoriteListingIds.map((listingId) => Listing.findById(listingId))
    );

    const validListings = favoriteListings.filter((listing) => listing !== null);

    res.status(200).json({
      listings: validListings,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(userFavorites.favourites.length / pageSize),
    });
  } catch (error) {
    console.error('Error fetching favorite listings:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

/*  notificaiotns */

// Get bookings for all host's listings with listing details
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    //console.log(userId)

    const Usernotifications = await Notification.findById(userId).select("notifications");
    const notifications = Usernotifications.notifications;

    //console.log(notifications)

    if (!notifications) {
      return res.status(404).json({ message: 'No notifications found for the host.' });
    }

    res.status(200).json(notifications);
  }
  catch (error) {
    console.error('Error fetching host bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings for host listings.' });
  }
};