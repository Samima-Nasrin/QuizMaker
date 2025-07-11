const User = require('../models/user.model');
const bcrypt = require('bcrypt');

module.exports.registerForm = (req, res) => {
    res.render('register');
};

module.exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const newUser = new User({ username, email, password: hash });
    await newUser.save();
    req.session.user = newUser;
    res.redirect('/dashboard');
};

module.exports.loginForm = (req, res) => {
    res.render('login');
};

module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (!foundUser) return res.redirect('/login');

    const valid = await bcrypt.compare(password, foundUser.password);
    if (valid) {
        req.session.user = foundUser;
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
};

module.exports.logoutUser = (req, res) => {
    req.session.user = null;
    res.redirect('/');
};
