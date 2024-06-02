const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const campgroundsRoute = require('./routes/campground');
const reviewRoute = require('./routes/reviews');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const AppError = require('./utils/AppError');

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

app.use('/campgrounds', campgroundsRoute)
app.use('/campgrounds/:id/reviews', reviewRoute)

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