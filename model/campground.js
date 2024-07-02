const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const { coordinates } = require('@maptiler/client');
const Schema = mongoose.Schema;

const options = {toJSON: {virtuals: true}};

const Campground = new Schema({
    title: String,
    price: Number,
    images: [{
        url: String,
    }],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    desc: String,
    loc: String,
    author: {
        type: Schema.Types.ObjectId, ref: 'User',
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
},options)

Campground.virtual('properties.popUpMarkup').get(function(){
    return `<a href='/campgrounds/${this.id}'>${this.title}</a>`
})

Campground.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', Campground);