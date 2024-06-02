const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const Campground = new Schema({
    title: String,
    price: Number,
    image: String,
    desc: String,
    loc: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
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