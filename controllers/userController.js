const Quiz = require('../models/quiz.model');

module.exports.dashboard = async (req, res) => {
    const quizzes = await Quiz.find({ creator: req.session.user._id });
    res.render('user/dashboard', { quizzes });
};
