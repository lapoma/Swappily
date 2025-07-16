var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    usertype: {
        type: String,
        enum: ['user', 'operator'],
        required: true
    },
    phone: {
        type: String,
        unique: true,
        default: ""
    },
    favorite: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Listing',
        default: []
    },
    followed: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'User',
        default: []
    },
    n_followed: {
        type: Number,
        default: 0
    },
    followers: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'User',
        default: []
    },
    n_followers: {
        type: Number,
        default: 0
    },
    blocklist: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'User',
        default: [],
    },
    n_exchanges: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        minlength: 0,
        maxlength: 2000,
        default: ""
    },
    profile_url: {
        type: String,
        default: ""
    }
}));