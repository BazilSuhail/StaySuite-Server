const Listing = require('../models/listings');
const FavouriteListings = require('../models/favourite_listings');
const User = require('../models/user');

exports.getListings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const category = req.body.category || req.query.category || 'All';
    const query = category === 'All' ? {} : { category };
    const listings = await Listing.find(query).skip(skip).limit(limit).exec();

    const totalListings = await Listing.countDocuments(query);

    res.status(200).json({
      listings,
      totalPages: Math.ceil(totalListings / limit),
      currentPage: page,
    });
  }
  catch (error) {
    res.status(500).json({ message: 'Failed to fetch listings', error: error.message });
  }
};
 
exports.getListingsByFiltersFromClient = async (req, res) => {
  try {
    
    const { title, suburb, country, minPrice, maxPrice, category, beds, bathrooms, } = req.body;
    console.log(req.body);
    //  default values
    const defaultValues = { title: '', suburb: '', country: '', minPrice: 10, maxPrice: 130, category: 'Apartment', beds: 'Any', bathrooms: 'Any', };

    const query = {};

    if (title && title.trim() !== defaultValues.title) {
      query.title = { $regex: title.trim(), $options: 'i' };
    }
    if (suburb && suburb.trim() !== defaultValues.suburb) {
      query['address.suburb'] = { $regex: suburb.trim(), $options: 'i' };
    }
    if (country && country.trim() !== defaultValues.country) {
      query['address.country'] = { $regex: country.trim(), $options: 'i' };
    }
    if ((minPrice && minPrice !== defaultValues.minPrice) || (maxPrice && maxPrice !== defaultValues.maxPrice)) {
      query.price = {
        ...(minPrice && minPrice !== defaultValues.minPrice && { $gte: minPrice }),
        ...(maxPrice && maxPrice !== defaultValues.maxPrice && { $lte: maxPrice }),
      };
    }
    if (category && category !== defaultValues.category) {
      query.category = category;
    }
    if (beds && beds !== defaultValues.beds) {
      query.beds = { $gte: beds };
    }
    if (bathrooms && bathrooms !== defaultValues.bathrooms) {
      query.bathrooms = { $gte: bathrooms };
    }
    //console.log('mkaing Query:', query);
    const listings = await Listing.find(query);

    res.status(200).json( listings );
  }
  catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.getSearchedListings = async (req, res) => {
  try {
    const { guests, location } = req.params;
    const query = {};

    if (guests && !isNaN(guests)) {
      query.maxGuests = { $gte: parseInt(guests, 10) }; 
    }

    if (location && location.trim() !== "invalid") {
      query['address.country'] = { $eq: location.trim() };
    }

    console.log(query);
    const listings = await Listing.find(query);
    //console.log({listings});
    res.status(200).json({listings});
  } 
  catch (error) {
    console.error('Error fetching searched listings:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    if (!id) {
      return res.status(400).json({ error: 'Invalid listing ID' });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const host = await User.findById(listing.hostID, 'createdAt username email');

    if (!host) {
      return res.status(404).json({ error: 'Host not found' });
    }

    let isLiked = false;
    const favouriteListings = await FavouriteListings.findById(userId);
    if (favouriteListings && favouriteListings.favourites.includes(id)) {
      isLiked = true;
    }
    //console.log(isLiked)
    //console.log(host.username)
    res.status(200).json({
      listing,
      isLiked,
      hostDetails: {
        createdAt: host.createdAt,
        name: host.username,
        email: host.email,
      },
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getListingById_for_users = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Invalid listing ID' });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const host = await User.findById(listing.hostID, 'createdAt username email');

    if (!host) {
      return res.status(404).json({ error: 'Host not found' });
    }

    //console.log(host.username)
    res.status(200).json({
      listing,
      hostDetails: {
        createdAt: host.createdAt,
        name: host.username,
        email: host.email,
      },
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.toggleFavoriteListing = async (req, res) => {
  try {
    const userId = req.user.id;
    const listingId = req.params.listingId;
 
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found.' });
    }
 
    let favouriteListings = await FavouriteListings.findById(userId);
    if (!favouriteListings) {
      favouriteListings = new FavouriteListings({ _id: userId, favourites: [] });
    }

    const isFavorite = favouriteListings.favourites.includes(listingId);

    if (isFavorite) {
      favouriteListings.favourites = favouriteListings.favourites.filter(
        (id) => id !== listingId
      );
      
      listing.favourite_count = Math.max(0, (listing.favourite_count || 0) - 1);
    }
    else {
      favouriteListings.favourites.push(listingId);
      listing.favourite_count = (listing.favourite_count || 0) + 1;
    }

    await favouriteListings.save();
    await listing.save();

    res.status(200).json({
      message: isFavorite
        ? 'Listing removed from favorites.'
        : 'Listing added to favorites.',
      favorites: favouriteListings.favourites,
    });
  }
  catch (error) {
    console.error('Error toggling favorite listing:', error);
    res.status(500).json({ error: 'Failed to toggle favorite listing. Please try again.' });
  }
};