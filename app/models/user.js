var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    userId: {
        type: String
    },
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
        unique: true
    },
    favorite: {
        type: [String],
        default: []
    },
    followed: {
        type: [String],
        default: []
    },
    n_followed: {
        type: Number,
        default: 0
    },
    followers: {
        type: [String],
        default: []
    },
    n_followers: {
        type: Number,
        default: 0
    },
    blocklist: {
        type: [String],
        default: []
    },
    n_exchanges: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        minlength: 3,
        maxlength: 2000,
        default: ""
    },
    profile_url: {
        type: String
    }
}));
