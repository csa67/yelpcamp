const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Campground = new Schema({
    title: String,
    price: Number,
    image: String,
    desc: String,
    loc: String
})

module.exports = mongoose.model('Campground', Campground);