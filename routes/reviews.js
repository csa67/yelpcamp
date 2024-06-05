const express = require('express')
const router = express.Router({ mergeParams: true });
const Campground = require('../model/campground');
const wrapAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Review = require('../model/review');
const Joi = require('joi');
const { requireLogin } = require('../utils/authenticate.js');
const User = require('../model/user');

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
        throw new AppError(msg, 405)
    } else {
        next();
    }
}

const isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    const currentUser = await User.findById(req.session.user_id);
    if (!review.userName === currentUser.username) {
        req.flash('error', 'You do not have permission to do this.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

router.delete('/:reviewId', requireLogin, isReviewAuthor, wrapAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndDelete(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Deletion of review successful!');
    res.redirect(`/campgrounds`);
}))

router.post('/', requireLogin, validateReview, wrapAsync(async (req, res, next) => {
    const camp = await Campground
        .findById(req.params.id);
    const review = new Review(req.body.review);
    const currentUser = await User.findById(req.session.user_id);
    review.userName = currentUser.username;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}))

module.exports = router;
