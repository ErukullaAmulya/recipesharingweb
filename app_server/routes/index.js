const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Adjust based on your controllers
const csrf = require('csurf'); // For CSRF protection


// GET request to display the registration form
router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register',
        // Pass the CSRF token to the view
    });
});

// POST request to handle registration form submission
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.render('register', {
            title: 'Register',
            error: 'Please fill in all fields.',
        });
    }

    try {
        await userController.registerUser(req, res);
        res.redirect('/sign-in?success=registered'); // Redirect with a success message
    } catch (error) {
        res.render('register', {
            title: 'Register',
            error: error.message,
        });
    }
});

// GET request to display the sign-in form
router.get('/sign-in', (req, res) => {
    res.render('sign-in', {
        title: 'Sign In',// Pass the CSRF token to the view
    });
});

// POST request to handle sign-in form submission
router.post('/sign-in',  async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userController.loginUser(req, res);

        if (user) {
            // Redirect to add recipe page after successful sign-in
            return res.redirect('/submit-recipe');
        } else {
            // If sign-in fails, redirect back to the sign-in page
            return res.render('sign-in', {
                title: 'Sign In',
                error: 'Invalid credentials.',
                // Pass the CSRF token to the view
            });
        }
    } catch (error) {
        res.render('sign-in', {
            title: 'Sign In',
            error: error.message,
        });
    }
});

// Protecting the submit-recipe route
router.get('/submit-recipe',  (req, res) => {
    res.render('submit-recipe'); // Render the submit-recipe page
});

router.get('/view-recipe', async (req, res) => {
    try {
        const recipes = await recipeController.getAllRecipes(); // Call a method to get all recipes
        res.render('view-recipe', {
            title: 'View Recipe',
            recipes, // Pass the recipes to the view
        });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).render('error', {
            message: 'Error fetching recipes',
            error,
        });
    }
});


// Export the router
module.exports = router;
