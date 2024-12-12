const Listing = require('../models/listings');
const User = require('../models/user');
const ListingBooking = require('../models/listing_bookings');
const HostingListings = require('../models/hosted_listings');
const user = require('../models/user');
const ListingReview = require('../models/listings_reviews');
const path = require('path');

exports.addListing = async (req, res) => {
  try {
    const { name, summary, property_type, bedrooms, maxGuests,category, bathrooms, price, address, amenities, images } = req.body;
    const userId = req.user.id;

    const newListing = new Listing({
      name,
      summary,
      category,
      property_type,
      maxGuests,
      bedrooms,
      bathrooms,
      price,
      address,
      amenities,
      images,
      bookingsMade: 0,
      favourite_count: 0,
      hostID: userId,
    });
    await newListing.save();


    const user = await User.findById(userId).select('role hosted_listings');
    if (user && user.role === 'Host') {
      const newListingBooking = new ListingBooking({
        _id: newListing._id,
        bookings: [],
      });
      await newListingBooking.save();

      const hostingListingsId = user.hosted_listings;
      const hostingListingsDoc = await HostingListings.findById(hostingListingsId);

      if (hostingListingsDoc) {
        hostingListingsDoc.listings.push(newListing._id);
        await hostingListingsDoc.save();
      }

      user.hosted_listings = hostingListingsId;
      await user.save();
    }

    const newListingReview = new ListingReview({
      _id: newListing._id,
      reviews: [],
    });
    await newListingReview.save();

    res.status(201).json({
      message: 'Listing and listing booking added successfully!',
      listing: newListing,
    });
  }
  catch (error) {
    console.error('Error adding listing:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

exports.addListingWithImages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, summary, property_type, maxGuests,category, bedrooms, bathrooms, price, address, amenities } = req.body;

    // Validate uploaded files
    if (!req.files || !req.files.placeImage || !req.files.coverImage || !req.files.additionalImages) {
      return res.status(400).json({ error: 'All images (place, cover, and additional) are required' });
    }

    const baseImageUrl = process.env.SERVER_URL;
    console.log(baseImageUrl)

    /*const placeImagePath =  path.posix.join(baseImageUrl, 'listing_images', req.files.placeImage[0].filename);
    const coverImagePath =  path.posix.join(baseImageUrl, 'listing_images', req.files.coverImage[0].filename);
    const additionalImagePaths = req.files.additionalImages.map((file) =>
       path.posix.join(baseImageUrl, 'listing_images', file.filename)
    );*/

    const placeImagePath = baseImageUrl + 'listing_images/' + req.files.placeImage[0].filename;
    const coverImagePath = baseImageUrl + 'listing_images/' + req.files.coverImage[0].filename;
    const additionalImagePaths = req.files.additionalImages.map((file) =>
      baseImageUrl + 'listing_images/' + file.filename
    );

    const newListing = new Listing({
      name,
      summary,
      property_type,
      maxGuests,
      bedrooms,
      category,
      bathrooms,
      price,
      address,
      amenities,
      images: {
        placePicture: placeImagePath,
        coverPicture: coverImagePath,
        additionalPictures: additionalImagePaths,
      },
      bookingsMade: 0,
      favourite_count: 0,
      hostID: userId,
    });
    await newListing.save();

    const user = await User.findById(userId).select('role hosted_listings');
    if (user && user.role === 'Host') {
      const newListingBooking = new ListingBooking({
        _id: newListing._id,
        bookings: [],
      });
      await newListingBooking.save();

      const hostingListingsId = user.hosted_listings;
      const hostingListingsDoc = await HostingListings.findById(hostingListingsId);

      if (hostingListingsDoc) {
        hostingListingsDoc.listings.push(newListing._id);
        await hostingListingsDoc.save();
      }

      user.hosted_listings = hostingListingsId;
      await user.save();
    }

    
    const newListingReview = new ListingReview({
      _id: newListing._id,
      reviews: [],
    });
    await newListingReview.save();

    res.status(201).json({
      message: 'Listing with images added successfully!',
      listing: newListing,
    });
  } 
  catch (error) {
    console.error('Error adding listing:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};


exports.getHostedListings = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId, 'hosted_listings role');

    if (!user || user.role !== 'Host') {
      return res.status(403).json({ error: 'Access denied. User is not a host.' });
    }

    const hostListing = await HostingListings.findById(user.hosted_listings, 'listings');

    if (!hostListing) {
      return res.status(404).json({ error: 'Hosted listings not found.' });
    }

    const listings = await Listing.find({ _id: { $in: hostListing.listings } });

    res.status(200).json({ listings });
  }
  catch (error) {
    console.error('Error fetching hosted listings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const listing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.status(200).json({ message: 'Listing updated successfully', listing });
  }
  catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.deleteListing = async (req, res) => {
  const listingId = req.params.id;
  const userId = req.user.id;
  //console.log(userId)
  try {
    const user = await User.findById(userId).select("hosted_listings");
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const hostListing = await HostingListings.findById(user.hosted_listings);
    if (!hostListing) {
      return res.status(404).json({ message: 'No hosted listings found for this user.' });
    }

    const updatedHostListing = await HostingListings.findByIdAndUpdate(
      hostListing._id,
      { $pull: { listings: listingId } },
      { new: true }
    );

    if (!updatedHostListing) {
      return res.status(404).json({ message: 'Failed to update hosted listings.' });
    }

    const deletedListing = await Listing.findByIdAndDelete(listingId);
    if (!deletedListing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    res.status(200).json({
      message: 'Listing deleted successfully.',
      data: { deletedListing, updatedHostListing },
    });
  }
  catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};