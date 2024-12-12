const mongoose = require('mongoose');

const FavouriteListingsSchema = new mongoose.Schema({ 
  favourites: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('favouritelistings', FavouriteListingsSchema);
