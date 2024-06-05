module.exports.isLoggedIn = (req, res, next) => {
    res.locals.isLoggedIn = !!req.session.user_id;
    next();
};

module.exports.requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        req.flash('error', 'You need to login first.');
        return res.redirect('/login');
    }
    next();
};
