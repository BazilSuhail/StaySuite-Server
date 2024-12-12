const mongoose = require('mongoose');

const hostListingSchema = new mongoose.Schema({
  listings: { 
    type: [String], 
    default: [] 
  },
  hostID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',   
    required: true 
  }
});

module.exports = mongoose.model('HostListing', hostListingSchema);
