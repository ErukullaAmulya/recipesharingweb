const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController'); // Adjust the path as needed

// Public routes
router.get('/', userController.getHomepage);
router.get('/about', userController.getAbout);
router.get('/sign-in', userController.getSignIn);
router.get('/register', userController.getRegister);

// Protected routes
router.get('/submit-recipe', userController.submitRecipe);
router.post('/add-recipe',userController.addRecipe);

// Registration and login
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logout);

module.exports = router;
