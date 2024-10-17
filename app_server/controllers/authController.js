const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.getSignIn = (req, res) => {
    res.render('sign-in');
};

exports.getRegister = (req, res) => {
    res.render('register');
};

exports.postRegister = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already taken. Please choose another one.');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        req.session.user = newUser;
        req.session.isAuthenticated = false;
        res.redirect('/sign-in');

    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while registering the user.');
    }
};

exports.postSignIn = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            req.session.isAuthenticated = false;
            res.redirect('/submit-recipe');
            res.redirect('/view-recipe');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during sign-in.');
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred during logout.');
        }
        res.redirect('/');
    });
};
