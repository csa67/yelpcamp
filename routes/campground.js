const express = require('express')
const router = express.Router();
const Campground = require('../model/campground');
const wrapAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError')
const Joi = require('joi');
const { requireLogin } = require('../utils/authenticate,js');

const validateCampground = (req, res, next) => {
    const campgroundSchema = Joi.object({
        campground
            : Joi.object({
                title: Joi.string().required(),
                price: Joi.number().required()
                    .min(0),
                loc: Joi.string(),
                desc: Joi.string()
            }).required()
    })
    const { result } = campgroundSchema.validate(req.body);
    if (result) {
        const msg = result.details.map(el => el.message).join(',');
        throw new AppError(msg, 405)
    } else {
        next();
    }
}

router.get('/', wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground
        .find({});
    res.render('campgrounds/index', { title: 'Campgrounds', campgrounds })
}));

router.get('/new', requireLogin, (req, res) => {
    res.render('campgrounds/new', { title: 'Create New' });
});

router.post('/', validateCampground, wrapAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body.Campground);
    await newCamp.save();
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

router.get('/:id', wrapAsync(async (req, res, next) => {
    const currentcamp = await Campground
        .findById(req.params.id).populate('reviews')
    if (!currentcamp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { title: 'Details', currentcamp, defaultPrice: 10 });
}));

router.get('/:id/edit', requireLogin, wrapAsync(async (req, res, next) => {
    const currentcamp = await Campground.findById(req.params.id)
    if (!currentcamp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { title: 'Edit Campground', currentcamp });
}));

router.put('/:id', validateCampground, wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const editedCamp = await Campground
        .findByIdAndUpdate(id, {
            ...req.body.Campground

        });
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', requireLogin, wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    await Campground
        .findByIdAndDelete(id);
    req.flash('success', 'Deletion of campground successful!');
    res.redirect(`/campgrounds`);
}));



module.exports = router;