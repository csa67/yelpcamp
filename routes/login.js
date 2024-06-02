const express = require('express')
const router = express.Router();
const User = require('../model/user');
const Joi = require('joi');
const AppError = require('../utils/AppError');
const wrapAsync = require('../utils/catchAsync');
const bcrypt = require('bcrypt');

const validateUser = (type) => {
    return (req, res, next) => {
        let userSchema;
        if (type === 'signup') {
            userSchema = Joi.object({
                user: Joi.object({
                    email: Joi.string().email().required(),
                    username: Joi.string().alphanum().min(6).max(30).required(),
                    password: Joi.string().pattern(
                        new RegExp('^[a-zA-Z0-9,!.$#%&]{8,30}')
                    ).required(),
                }).required()
            });
        } else if (type === 'login') {
            userSchema = Joi.object({
                user: Joi.object({
                    username: Joi.string().alphanum().min(6).max(30).required(),
                    password: Joi.string().pattern(
                        new RegExp('^[a-zA-Z0-9,!.$#%&]{8,30}')
                    ).required(),
                }).required()
            });
        }

        const { error } = userSchema.validate(req.body);
        if (error) {
            const errorMsg = error.details.map(err => err.message).join(',');
            throw new AppError(errorMsg, 400);
        }
        next();
    };
};



router.get("/login", (req, res) => {
    res.render('login/login', { title: 'Login' })
})

router.post("/login", validateUser('login'), wrapAsync(async (req, res, next) => {
    const { username, password } = req.body.user;
    console.log(req.body);
    const user = await User.findOne({ username: username });
    if (!user) {
        req.flash('error', 'No such user found');
        return res.redirect('/login');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
        req.flash('success', `Hello ${username}!`);
        req.session.user_id = user._id;
        res.redirect('/campgrounds');
    } else {
        req.flash('error', 'Incorrect username or password');
        return res.redirect('/login');
    }
}))

router.post("/signup", validateUser('signup'), wrapAsync(async (req, res, next) => {
    const { email, username, password } = req.body.user;
    const hashedPassword = await bcrypt.hash(password, 14);
    const user = new User({ email, username, password: hashedPassword });
    await user.save();
    req.session.user_id = user._id;
    req.flash('success', 'Succesfully Registered!');
    res.redirect('/campgrounds');
}));

module.exports = router;

