const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// User Registration
exports.registerUser = async (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.render('register', { message: 'Username already exists', csrfToken: req.csrfToken() });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.redirect('/sign-in');
};

// User Login
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user; // Store user in session
        return user; // Return user object on success
    }

    return null; // Return null on failure
};

