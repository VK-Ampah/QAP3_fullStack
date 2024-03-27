const router = require('express').Router();
const { parse } = require('postcss');
const { getUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser } = require('../../services/users');

// add multer to handle file uploads
const multer = require('multer');
const path = require('path');


// create a middleware to store the images on the server and save the path to the database
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function(req, file, cb) {
        // THE file is the file object that is being uploaded and has a property called 
        // {originalname, fieldname, encoding, mimetype, size,buffer}
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
// multer middleware
const upload = multer({ storage: storage });

// users routes
// Add a new user
// Render the form for creating a new user
router.get('/create', (req, res) => {
    try {
        if (DEBUG) console.log('GET /users/create');
        res.render('createUser');
    }
    catch (err) {
        res.status(500).send('An error occurred while fetching the user');
    }
});

// Handle the form submission
//POST AND STORE IMAGES ON THE SERVER to server static files
router.post('/create', upload.single('image'), async (req, res) => {
    try {
        if (DEBUG) console.log('POST /users/create');
        const imageUrl = req.file? '/images/' + req.file.filename: null;
        const newUser = await addUser(req.body.firstname, req.body.middlename, req.body.lastname, req.body.email, req.body.username, imageUrl);
        res.redirect('/users/' + newUser.user_id);
    } catch (err) {
        res.status(500).send('An error occurred while creating the user');
    }
});

/// UPDATE USER
// render user edit page
router.get('/:id/edit', async (req, res) => {
    try {
        if (DEBUG) console.log('GET /users/:id/edit');
        const id = parseInt(req.params.id);
        const user = await getUserById(id);       
        res.render('updateUser', { user: user });
    } catch (err) {
        res.status(500).send('An error occurred while fetching the user');
    }
});

router.patch('/:id/edit', upload.single('image'), async (req, res) => {
    try {
        if (DEBUG) console.log('PATCH /users/:id/edit');
        const imageUrl = req.file ? '/images/' + req.file.filename : req.body.oldImage;
        const updatedUser = await updateUser(parseInt(req.params.id), req.body.firstname, req.body.middlename, req.body.lastname, req.body.email, req.body.username, imageUrl);
        res.redirect('/users/' + updatedUser.user_id);
    } catch (err) {
        res.status(500).send('An error occurred while updating the user');
    }
});

// return a user by id
router.get('/:id', async (req, res) => {
    try {
        if (DEBUG) console.log('GET /users/:id');
        const id = parseInt(req.params.id);
        // console.log(id);
        const user = await getUserById(id);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        res.render('user', { user: user });
    }
    catch (err) {
        res.status(500).send('An error occurred while retrieving the user');
    }
}
);

router.get('/:id/delete', async (req, res) => {
    try {
        if (DEBUG) console.log('GET /users/:id/delete');        
        const id = parseInt(req.params.id);
        const user = await getUserById(id);
        res.render('deleteUser', { user: user });
    }
    catch (err) {
        res.status(500).send('An error occurred while fetching the user');
    }
}
);
// Delete a user
router.delete('/:id/delete', async (req, res) => {
    try {
        if (DEBUG) console.log('DELETE /users/:id/delete');
        const deletedUser = await deleteUser(req.params.id);       
        res.redirect('/users');
    }
    catch (err) {
        res.status(500).send('An error occurred while deleting the user');
    }
}
);

// return all users
router.get('/', async (req, res) => {
    if (DEBUG) console.log('GET /users/ home page')
    res.setHeader('Content-Type', 'text/html');
    res.status(200);
    const users = await getUsers();
    res.render('users', { users: users });
}
);

// Catch 404 and forward to error handler
router.use((req, res, next) => {
    const error = new Error('Page Not Found');
    error.status = 404;
    next(error);
});

// Error handling middleware
router.use((error, req, res, next) => {
    if (error.status !== 404) {
        res.status(500).send('Internal Server Error');
       
    }
    if (error instanceof SyntaxError) {
        res.status(400).send('Bad Request');
    } else if (error instanceof TypeError) {
        res.status(500).send('Internal Server Error');
    } else {
        res.status(error.status || 500).send(error.message || 'An error occurred');
    }
});

module.exports = router;