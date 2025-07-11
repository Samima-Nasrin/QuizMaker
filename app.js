require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash'); 

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const userRoutes = require('./routes/user');
const ExpressError = require("./utils/ExpressError.js");

const port = process.env.PORT || 3000;
// Flash setup
app.use(flash()); 

main()
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Global template variables (flash + session)
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.success = req.flash('success'); 
  res.locals.error = req.flash('error');
  res.locals.BASE_URL = process.env.BASE_URL;     
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render('home.ejs');
});

app.use('/', authRoutes);
app.use('/quiz', quizRoutes);
app.use('/', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
