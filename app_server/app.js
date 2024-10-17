const express = require('express');
const path = require('path');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const recipeController = require('./controllers/recipeController');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3200;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/recipe', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Set view engine
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

// Middleware for form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(fileUpload());

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Make session data available to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/sign-in'); // Redirect to sign-in if the user is not logged in
}

// Routes
app.get('/', recipeController.getHomepage);
app.get('/about', recipeController.getAbout);
app.get('/sign-in', recipeController.getSignIn);
app.post('/sign-in', recipeController.loginUser);
app.get('/register', recipeController.getRegister);
app.post('/register', recipeController.registerUser);

// Apply the middleware to check authentication
app.get('/submit-recipe', recipeController.submitRecipe);
app.post('/add-recipe', recipeController.addRecipe);
app.get('/view-recipe', recipeController.viewRecipe);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        message: err.message,
        status: err.status || 500,
        stack: err.stack
    });
});

// Start the server
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
