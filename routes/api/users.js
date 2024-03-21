const router = require('express').Router();
const { getUsers,
    getUserByUserName,
    addUser,
    updateUser,
    deleteUser } = require('../../services/users');

// return all users
router.get('/', async (req, res) => {
    res.send('GET /users');
    console.log(await getUsers());
    console.log('inside the router')
    console.log('GET /users');
}
);
// return a user by id
router.get('/:id', async (req, res) => {
    res.send('GET /users/getUserByUserName');
    console.log(await getUserByUserName(req.params.id));
    console.log(req.params)
    console.log('GET /users/getUserByUserName');
}
);
// Add a new user
router.post('/', async (req, res) => {
    res.send('POST /users');
    console.log(await addUser(req.body.firstname, req.body.middlename, req.body.lastname, req.body.email, req.body.username));
    console.log(req.body);
    console.log('POST /users');
}
);
// Update a user
router.put('/:id', async (req, res) => {
    res.send('PUT /users');
    console.log(await updateUser(req.params.id, req.body.name, req.body.email, req.body.username));
    console.log(req.params);
    console.log('PUT /users');
}
);
// Delete a user
router.delete('/:id', async (req, res) => {
    res.send('DELETE /users');
    console.log(await deleteUser(req.params.id));
    console.log(req.params);
    console.log('DELETE /users');
}
);
router.use((req, res, next) => {
    console.log('users middleware');
    next();
}
);

module.exports = router;