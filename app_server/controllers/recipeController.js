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
    const recipes = [
        { title: 'Spaghetti Bolognese', category: 'Italian', ingredients: 'Pasta, Meat, Tomato Sauce', instructions: 'Boil pasta, cook meat, mix together.' },
        // Add more sample recipes as needed
    ];
    
    res.render('view-recipe', { recipes }); // Render the view and pass the recipes
};


exports.addRecipe = (req, res) => {
    const { title, category, ingredients, instructions } = req.body;
    const newRecipe = {
        title,
        category,
        ingredients,
        instructions,
        id: recipes.length + 1, // Simple ID assignment
    };
    recipes.push(newRecipe); // Add the new recipe to the in-memory storage
    res.redirect('/'); // Redirect to the homepage after submission
};

// Error handling
exports.handleError = (err, req, res, next) => {
    console.error(err);
    res.status(500).render('error', { message: 'Internal Server Error' });
};
