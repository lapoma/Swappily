const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  username: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['As new', 'Good', 'Ok', 'Not Good'],
    required: true
  },
  available: {
    type: Boolean,
    default: true,
    required: true
  },
  listing_url: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 10'],
    default: []
  }
});

function arrayLimit(val) {
  return val.length <= 10;
}

module.exports = mongoose.model('Listing', ListingSchema);
