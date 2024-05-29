const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const campground = require('./model/campground');
const { title } = require('process');
const engine = require('ejs-mate');
const Joi = require('joi');
const methodOverride = require('method-override');
const AppError = require('./utils/AppError')
const wrapAsync = require('./utils/catchAsync')

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "db connection error"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.engine('ejs', engine);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const validateCampground = (req, res, next) => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required()
                .min(0)
        }).required()
    })
    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        throw new AppError(result.error.message, 405)
    } else {
        next();
    }
}

app.get('/campgrounds', wrapAsync(async (req, res, next) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { title: 'Campgrounds', campgrounds })
}));

app.get('/campgrounds/new', wrapAsync(async (req, res, next) => {
    res.render('campgrounds/new', { title: 'Create New' });
}));

app.post('/campgrounds', validateCampground, wrapAsync(async (req, res, next) => {
    const newCamp = new campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

app.get('/campgrounds/:id', wrapAsync(async (req, res, next) => {
    const currentcamp = await campground.findById(req.params.id)
    if (!currentcamp) {
        throw new AppError("No product found with the given ID", 404);
    }
    res.render('campgrounds/show', { title: 'Details', currentcamp, defaultPrice: 10 });
}));

app.get('/campgrounds/:id/edit', wrapAsync(async (req, res, next) => {
    const currentcamp = await campground.findById(req.params.id)
    if (!currentcamp) {
        throw new AppError("No product found with the given ID", 404);
    }
    res.render('campgrounds/edit', { title: 'Edit campground', currentcamp });
}));

app.put('/campgrounds/:id', validateCampground, wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const editedCamp = await campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${id}`);
}));

app.delete('/campgrounds/:id', wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    await campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}));

app.get("/", (req, res) => {
    res.render('home', { title: "YelpCamp" })
})

app.all("*", (req, res, next) => {
    next(new AppError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render('error', { title: "Error", err });
});

app.listen(3000, () => {
    console.log('Listening on port 3000.')
})