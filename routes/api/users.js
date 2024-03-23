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
    res.render('createUser');
});

// Handle the form submission
//POST AND STORE IMAGES ON THE SERVER to server static files
router.post('/create', upload.single('image'), async (req, res) => {
    console.log(req.body); // This will contain the text fields
    console.log(req.file); // This will contain the file
    try {
        const imageUrl = '/images/' + req.file.filename;
        const newUser = await addUser(req.body.firstname, req.body.middlename, req.body.lastname, req.body.email, req.body.username, imageUrl);
        res.redirect('/users/' + newUser.user_id);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while creating the user');
    }
});


/// UPDATE USER
// render user edit page
router.get('/:id/edit', async (req, res) => {
    try {
       console.log('GET /users/:id/edit');
        const id = parseInt(req.params.id);
        const user = await getUserById(id);
        console.log(`GET /users/${id}/edit`);
        console.log(user);       
        res.render('updateUser', { user: user });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching the user');
    }
});

router.patch('/:id/edit', upload.single('image'), async (req, res) => {
    try {
        const imageUrl = req.file ? '/images/' + req.file.filename : req.body.oldImage;
        const updatedUser = await updateUser(parseInt(req.params.id), req.body.firstname, req.body.middlename, req.body.lastname, req.body.email, req.body.username, imageUrl);
        console.log(updatedUser);
        console.log(req.file ? req.file : 'no file');
        console.log(req.body);
        console.log(req.body.oldImage);   
        res.redirect('/users/' + updatedUser.user_id);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while updating the user');
    }
});

// return a user by id
router.get('/:id', async (req, res) => {
    try {
        console.log('GET/users/getUserById');
        console.log(req.url);
        // console.log(req.headers.referer);
        // console.log(req.method);
        // console.log(req.body);
        // console.log(req.params);
        // console.log(req.cookies);
        const id = parseInt(req.params.id);
        console.log(id);
        const user = await getUserById(id);
        console.log(user);
        res.render('user', { user: user });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving the user');
    }
}
);

router.get('/:id/delete', async (req, res) => {
    try {
        console.log('GET /users/:id/delete');
        const id = parseInt(req.params.id);
        const user = await getUserById(id);
        console.log(user);
        res.render('deleteUser', { user: user });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching the user');
    }
}
);
// Delete a user
router.delete('/:id/delete', async (req, res) => {
    try {
        const deletedUser = await deleteUser(req.params.id);
        console.log('DELETE /users' + req.params.id + '/delete');
        console.log(deletedUser);
        console.log(await deleteUser(req.params.id));
        console.log(req.params);
       
        res.redirect('/users');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while deleting the user');
    }
}
);

// return all users
router.get('/', async (req, res) => {
    console.log('inside the router')
    res.setHeader('Content-Type', 'text/html');
    res.status(200);
    const users = await getUsers();
    res.render('users', { users: users });
    console.log(await getUsers());
    // console.log('GET /users');
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
        console.error(error);
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