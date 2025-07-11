const Quiz = require('../models/Quiz');

module.exports.showCreateForm = (req, res) => {
    res.render('quiz/create');
};

module.exports.createQuiz = async (req, res) => {
    const { title, description, questions } = req.body;

    const newQuiz = new Quiz({
        title,
        description,
        questions,
        creator: req.session.user._id
    });

    await newQuiz.save();
    res.redirect(`/quiz/${newQuiz._id}`);
};

module.exports.viewQuiz = async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).send('Quiz not found');
    res.render('quiz/view', { quiz });
};

module.exports.submitQuiz = async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    const answers = req.body.answers;

    let score = 0;

    quiz.questions.forEach((q, idx) => {
        if (parseInt(answers[idx]) === q.correctAnswerIndex) score++;
    });

    res.render('quiz/result', { score, total: quiz.questions.length });
};
