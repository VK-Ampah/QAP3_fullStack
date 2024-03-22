const router = require('express').Router();
const { parse } = require('postcss');
const { getUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser } = require('../../services/users');

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

// Add a new user
// Display the form for creating a new user
router.get('/create', (req, res) => {
    res.render('createUser');
});

// Handle the form submission
router.post('/create', async (req, res) => {
    console.log(req.body);
    try {
        const newUser = await addUser(req.body.firstname, req.body.middlename, req.body.lastname, req.body.email, req.body.username, req.body.image_url);
        res.redirect('/users/' + newUser.user_id);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while creating the user');
    }
});
// return a user by id
router.get('/:id', async (req, res) => {
    try {
        console.log('GET /users/getUserById');
        console.log(req.url);
        console.log(req.headers.referer);
        console.log(req.method);
        console.log(req.body);
        console.log(req.params);
        console.log(req.cookies);
        const id = parseInt(req.params.id);
        console.log(id);
        const user = await getUserById(id);
        console.log(user);
        res.render('user', { user: user });
        console.log(req.params)
        console.log(req.params.id)
        console.log(parseInt(req.params.id)) 
    }
    catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving the user');
    }
}
);

// Update a user

router.put('/:id/edit', async (req, res) => {
    try {
        const updatedUser = await updateUser(req.params.id, req.body.name, req.body.email, req.body.username, req.body.image);
        res.render('userProfile', { user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while updating the user');
    }
});
// Delete a user
router.delete('/delete/:id', async (req, res) => {
    res.send('DELETE /users');
    console.log(await deleteUser(req.params.id));
    console.log(req.params);
    console.log('DELETE /users');
}
);
// router.use((req, res, next) => {
//     console.log('users middleware'); 
//     next();
// }
// );
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