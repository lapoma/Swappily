var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports= mongoose.model('Exchange',new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    offeredListing:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    requestedListing:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    date:{
        type: Date,
        default: Date.now
    }
}))