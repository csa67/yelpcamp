const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = new Schema({
    userName: String,
    reviewText: String,
    rating: Number
})

module.exports = mongoose.model('Review', Review);