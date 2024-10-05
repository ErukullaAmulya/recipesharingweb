const path = require('path');
const recipes = []; // Temporary in-memory storage for recipes

exports.getHomepage = (req, res) => {
    res.render('home');
};

exports.getAbout = (req, res) => {
    res.render('about');
};

exports.getSignIn = (req, res) => {
    res.render('sign-in');
};

exports.getRegister = (req, res) => {
    res.render('register');
};

exports.submitRecipe = (req, res) => {
    res.render('submit-recipe'); // Renders the submit recipe form
};

exports.viewRecipes = (req, res) => {
    // Render the view and pass the recipes
    res.render('view-recipe', { recipes }); 
};

exports.addRecipe = (req, res) => {
    const { title, category, ingredients, instructions } = req.body;
    const photo = req.files.photo;

    // Specify where to save the photo
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', photo.name);

    // Move the uploaded file to the designated path
    photo.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err); // Handle upload error
        }

        const newRecipe = {
            title,
            category,
            ingredients,
            instructions,
            photo: `/uploads/${photo.name}`, // Save the photo path
            id: recipes.length + 1, // Simple ID assignment
        };

        recipes.push(newRecipe); // Add the new recipe to the in-memory storage
        res.redirect('/'); // Redirect to the homepage after submission
    });
};

// Error handling
exports.handleError = (err, req, res, next) => {
    console.error(err);
    res.status(500).render('error', { message: 'Internal Server Error', status: err.status, stack: err.stack });
};
