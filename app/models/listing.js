var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Listing', new Schema({
    title: String,
    username: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['As new', 'Good', 'Ok', 'Not Good']
    },
    available: {
        type: Boolean,
        default: true
    }
}))