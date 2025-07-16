var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reportSchema = new Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    default: null
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reporteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  text: {
    type: String,
    required: true,
    maxlength: 2000
  }

});
  module.exports = mongoose.model('Report', reportSchema);



