const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// GET register form
router.get('/register', (req, res) => {
  res.render('register', { message: null });
});

// POST register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.render('register', { message: 'Email already registered.' });
  }

  const hash = await bcrypt.hash(password, 12);
  const newUser = new User({ username, email, password: hash });
  await newUser.save();
  req.session.user = newUser;

  // Render dashboard with success message
  res.render('dashboard', {
    user: newUser,
    quizzes: [], // or load their quizzes if needed
    message: 'Registration successful!'
  });
});

// GET login form
router.get('/login', (req, res) => {
  res.render('login', { message: null });
});

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    return res.render('login', { message: 'User not found.' });
  }

  const valid = await bcrypt.compare(password, foundUser.password);
  if (valid) {
    req.session.user = foundUser;

    const Quiz = require('../models/quiz.model');
    const quizzes = await Quiz.find({ creator: foundUser._id });

    res.render('dashboard', {
      user: foundUser,
      quizzes,
      message: 'Welcome back!'
    });
  } else {
    res.render('login', { message: 'Invalid credentials.' });
  }
});

// Logout
router.get('/logout', async (req, res) => {
  const username = req.session?.user?.username || 'User';
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.render('home', { message: 'Error logging out.' });
    }
    req.session = null;
    res.clearCookie('connect.sid'); // optional, clears session cookie
    res.redirect('/');
  });
});

module.exports = router;
