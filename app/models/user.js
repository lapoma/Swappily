var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    userId: {
        type: Number,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
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
        required: true
    },
    followers: {
        type: [String],
        default: []
    },
    n_followers: {
        type: Number,
        required: true
    },
    blocklist: {
        type: [String],
        default: []
    },
    n_exchanges: {
        type: Number,
        required: true
    }
}));