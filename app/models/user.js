var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//set up a mongoose model
module.exports = mongoose.model('Student', new Schema({
    username: String,
    name: String,
    surname: String,
    email: String,
    password: String
}))