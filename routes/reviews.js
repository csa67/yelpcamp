const express = require('express')
const router = express.Router({ mergeParams: true });
const Campground = require('../model/campground');
const wrapAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Review = require('../model/review');
const Joi = require('joi');
const { error } = require('console');

const validateReview = (req, res, next) => {
    const reviewSchema = Joi.object({
        review
            : Joi.object({
                reviewText: Joi.string().required(),
                rating: Joi.number().required().min(1)
                    .max(5)
            }).required()
    });
    const { result } = reviewSchema.validate(req.body);
    if (result) {
        const msg = result.details.map(el => el.message).join(',');
        throw new AppError(message, 405)
    } else {
        next();
    }
}

router.post('/', validateReview, wrapAsync(async (req, res, next) => {
    const camp = await Campground
        .findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}))

module.exports = router;
