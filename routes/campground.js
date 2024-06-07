const express = require('express')
const router = express.Router();
const Campground = require('../model/campground');
const User = require('../model/user.js')
const wrapAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError')
const Joi = require('joi');
const { requireLogin } = require('../utils/authenticate.js');
const { uploadToCloud, storeInCloud } = require('../helper.js');

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
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 405)
    } else {
        next();
    }
}

const isAuthor = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author._id.equals(req.session.user_id)) {
        req.flash('error', 'You do not have permission to do this.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
})

router.get('/', wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground
        .find({});
    res.render('campgrounds/index', { title: 'Campgrounds', campgrounds })
}));

router.get('/new', requireLogin, (req, res) => {
    res.render('campgrounds/new', { title: 'Create New' });
});


router.post('/', requireLogin, storeInCloud.array('image'), validateCampground, wrapAsync(async (req, res, next) => {
    const images = [];

    for (const file of req.files) {
        const result = await uploadToCloud(file.buffer, file.mimetype);
        images.push({ url: result.secure_url });
    }

    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.session.user_id;
    newCamp.images = images;
    console.log(newCamp);
    await newCamp.save();
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${newCamp._id}`);

}))

router.get('/:id', wrapAsync(async (req, res, next) => {
    const currentcamp = await Campground
        .findById(req.params.id).populate('reviews').populate('author')
    const currentUser = await User.findById(req.session.user_id);
    if (!currentcamp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { title: 'Details', currentcamp, defaultPrice: 10, currentUser });
}));

router.get('/:id/edit', requireLogin, isAuthor, wrapAsync(async (req, res, next) => {
    const currentcamp = await Campground.findById(req.params.id)
    if (!currentcamp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { title: 'Edit Campground', currentcamp });
}));

router.put('/:id', isAuthor, validateCampground, wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const editedCamp = await Campground
        .findByIdAndUpdate(id, {
            ...req.body.Campground

        });
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', requireLogin, isAuthor, wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    await Campground
        .findByIdAndDelete(id);
    req.flash('success', 'Deletion of campground successful!');
    res.redirect(`/campgrounds`);
}));



module.exports = router;