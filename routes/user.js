const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz.model');
const { isLoggedIn } = require('../middlewares/auth');

// GET dashboard
router.get('/dashboard', isLoggedIn, async (req, res) => {
    const quizzes = await Quiz.find({ creator: req.session.user._id });
    const user = req.session.user; // get user from session
    res.render('dashboard', { user, quizzes }); // pass both user and quizzes
});


module.exports = router;
