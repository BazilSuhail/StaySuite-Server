const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  notifications: {
    type: [
      {
        type: mongoose.Schema.Types.Mixed,
      }
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', NotificationSchema);
