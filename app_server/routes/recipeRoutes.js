const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/**
 * App Routes 
 */
router.get('/', recipeController.getHomepage);
router.get('/about', recipeController.getAbout);
router.get('/sign-in', recipeController.getSignIn);
router.get('/register', recipeController.getRegister);
router.get('/submit-recipe', recipeController.submitRecipe); // Ensure this line exists
router.post('/add-recipe', recipeController.addRecipe); // This handles the form submission
router.get('/view-recipes', recipeController.viewRecipes);

module.exports = router;
