const mongoose = require('mongoose');

const guestbookSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Guestbook', guestbookSchema);
