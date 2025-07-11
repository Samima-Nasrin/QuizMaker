const Quiz = require("../models/quiz.model");

// Middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/login");
    }
    next();
};

// Save redirect URL if it exists
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session && req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Middleware to check if current user is the creator of the quiz
module.exports.isQuizOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz.findById(id);

        if (!quiz || !quiz.creator.equals(req.session.user._id)) {
            return res.status(403).send("You do not have permission to modify this quiz.");
        }

        next();
    } catch (err) {
        next(err); // passes to error handler
    }
};
