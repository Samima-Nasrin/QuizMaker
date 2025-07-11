const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz.model');
const User = require('../models/user.model');
const { isLoggedIn } = require('../middlewares/auth');

// GET quiz creation form
router.get('/create', isLoggedIn, (req, res) => {
  res.render('quiz');
});

// POST create quiz
router.post('/create', isLoggedIn, async (req, res) => {
  const { title, description, questions } = req.body;

  const newQuiz = new Quiz({
    title,
    description,
    questions,
    creator: req.session.user._id
  });

  await newQuiz.save();

  res.render('dashboard', {
    user: req.session.user,
    quizzes: await Quiz.find({ creator: req.session.user._id }),
    message: 'Quiz created successfully!'
  });
});



// POST submit quiz and show result
router.post('/:id/submit', isLoggedIn, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  const answers = req.body.answers;

  let score = 0;
  quiz.questions.forEach((q, idx) => {
    if (parseInt(answers[idx]) === q.correctAnswerIndex) score++;
  });

  // Save response
  quiz.responses.push({
    user: req.session.user._id,
    score,
    takenAt: new Date()
  });

  await quiz.save();

  res.render('result', {
    score,
    total: quiz.questions.length,
    message: 'Quiz submitted!'
  });
});

// GET stats page (view responses)
router.get('/:id/stats', isLoggedIn, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('responses.user');
    if (!quiz) return res.status(404).send("Quiz not found");

    // Only creator can view stats
    if (!quiz.creator.equals(req.session.user._id)) {
      return res.status(403).send("Unauthorized");
    }

    res.render('stats', { quiz });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

// POST edit quiz
router.post('/:id/edit', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { title, description, questions } = req.body;

  const quiz = await Quiz.findById(id);
  if (!quiz || !quiz.creator.equals(req.session.user._id)) {
    return res.status(403).send('Unauthorized');
  }

  quiz.title = title;
  quiz.description = description;
  quiz.questions = questions;

  await quiz.save();

  res.render('stats', {
    quiz: await Quiz.findById(id).populate('responses.user'),
    message: 'Quiz updated successfully!'
  });
});

// DELETE quiz
router.delete('/:id/delete', isLoggedIn, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz || !quiz.creator.equals(req.session.user._id)) {
      return res.status(403).send("Unauthorized");
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Quiz deleted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting quiz' });
  }
});

// GET quiz view page (take quiz)
router.get('/:id', isLoggedIn, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).send('Quiz not found');
  res.render('view', { quiz });
});

module.exports = router;
