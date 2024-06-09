const mongoose = require('mongoose');
const campground = require('../model/campground');
const { title } = require('process');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const getRandomEle = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const city = cities[Math.floor(Math.random() * 1000)];
        const camp = new campground({
            author: '665d065eea80b3c517b927c9',
            loc: `${city.city}, ${city.state}`,
            title: `${getRandomEle(descriptors)} ${getRandomEle(places)}`,
            desc: "This place has 100 studio units of affordable housing with supportive services for people with significant disabling conditions like serious mental illness, substance use disorders, and physical disabilities.",
            images: {
                url: "https://media.cntraveler.com/photos/607313c3d1058698d13c31b5/1:1/w_1636,h_1636,c_limit/FamilyCamping-2021-GettyImages-948512452-2.jpg"
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

