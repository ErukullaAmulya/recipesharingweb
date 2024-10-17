const path = require('path'); 
const User = require('../models/userModel'); // Import user model 
const Recipe = require('../models/recipeModel'); // Import recipe model 
const bcrypt = require('bcrypt'); // For password hashing 
const fs = require('fs'); // For checking and creating directories 

// Middleware to check if user is logged in (not needed for add/view recipes) 
// You can keep this if you want to use it in other parts of your app 
function isLoggedIn(req, res, next) { 
    if (req.session.user) { 
        return next(); 
    } 
    res.redirect('/sign-in'); // Redirect to sign-in page if not logged in 
} 

// Get Homepage 
exports.getHomepage = (req, res) => { 
    res.render('home', { user: req.session.user }); 
}; 

// Get About Page 
exports.getAbout = (req, res) => { 
    res.render('about'); 
}; 

// Get Sign-In Page 
exports.getSignIn = (req, res) => { 
    res.render('sign-in'); 
}; 

// Get Registration Page 
exports.getRegister = (req, res) => { 
    res.render('register'); 
}; 

// Submit Recipe Page 
exports.submitRecipe = (req, res) => { 
    res.render('submit-recipe'); // Render the submit recipe page 
}; 

// View Recipe 
exports.viewRecipe = async (req, res) => { 
    try { 
        const allRecipes = await Recipe.find(); // Fetch all recipes from the database 
        res.render('view-recipe', { recipes: allRecipes }); // Render the view and pass the recipes 
    } catch (error) { 
        console.error('Error fetching recipes:', error); 
        res.status(500).render('error', { 
            message: 'Error fetching recipes', 
            error, 
        }); 
    } 
}; 

// Add Recipe 
exports.addRecipe = async (req, res) => { 
    const { title, category, ingredients, instructions } = req.body; 
    const photo = req.files.photo; // Get the uploaded photo 

    // Check if the file exists 
    if (!photo) { 
        return res.status(400).send('No photo uploaded.'); 
    } 

    const uploadDir = path.join(__dirname, '..', 'public', 'uploads'); 
    const uploadPath = path.join(uploadDir, photo.name); 

    // Ensure the uploads directory exists 
    if (!fs.existsSync(uploadDir)) { 
        fs.mkdirSync(uploadDir, { recursive: true }); 
    } 

    // Move the uploaded photo to the designated folder 
    photo.mv(uploadPath, async (err) => { 
        if (err) { 
            return res.status(500).send('File upload error: ' + err.message); // Handle upload error 
        } 

        try { 
            const newRecipe = new Recipe({ 
                title, 
                category, 
                ingredients, 
                instructions, 
                photo: `/uploads/${photo.name}`, 
                user: req.session.user ? req.session.user._id : null // Associate with user if logged in, otherwise null 
            }); 

            await newRecipe.save(); 
            res.redirect('/view-recipe'); 
        } catch (error) { 
            console.error('Error saving recipe:', error); 
            res.status(500).send('Error saving recipe: ' + error.message); 
        } 
    }); 
}; 

// Registration 
exports.registerUser = async (req, res) => { 
    const { username, password } = req.body; 

    // Check if user already exists 
    const existingUser = await User.findOne({ username }); 
    if (existingUser) { 
        return res.render('register', { message: 'Username already exists' }); 
    } 

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password 
    const newUser = new User({ username, password: hashedPassword }); 
    await newUser.save(); 
    res.redirect('/sign-in'); 
}; 

// User Login 
exports.loginUser = async (req, res) => { 
    const { username, password } = req.body; 
    const user = await User.findOne({ username }); 

    if (user && await bcrypt.compare(password, user.password)) { 
        req.session.user = user; // Store the entire user object in session 
        return res.redirect('/submit-recipe'); // Redirect to the submit recipe page after login 
    } 

    res.render('sign-in', { message: 'Invalid credentials' }); 
};
