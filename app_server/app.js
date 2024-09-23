const express = require('express');
const path = require('path');
const recipeController = require('./controllers/recipeController');

const app = express();
const port = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', recipeController.getHomepage);
app.get('/about', recipeController.getAbout);
app.get('/sign-in', recipeController.getSignIn);
app.get('/register', recipeController.getRegister);
app.post('/add-recipe', recipeController.addRecipe);
app.get('/submit-recipe', recipeController.submitRecipe);
app.get('/view-recipes', recipeController.viewRecipes); 

// Error handling middleware
app.use(recipeController.handleError);

// Export the app
module.exports = app;

app.listen(port, () => console.log(`Listening on port ${port}`));
