const pool = require('./dal.auth.js');

// Retrieve all users
const getUsers = async () => {
    const query = 'SELECT * FROM users;';
    try {
        const res = await pool.query(query);
        return res.rows;
    } catch (err) {
        console.error('Error executing getUsers query', err.stack);
        throw err;
    }
};

// Retrieve a user by id
const getUserByUserName = async (id) => {
    const query = 'SELECT * FROM users WHERE username = $1;';
    const values = [id];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    }
    catch (err) {
        console.error('Error executing getUserByUserName query', err.stack);
        throw err;
    }

};


// Add a new user
const addUser = async (firstname,middlename,lastname,email,username,image_url) => {
    const query = 'INSERT INTO users (firstname,middlename,lastname,email,username) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
    const values = [firstname,middlename,lastname,email,username,image_url];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error executing addUser query', err.stack);
        throw err;
    }

};

// Update a user
const updateUser = async (id, name, email, username, image) => {
    const query = 'UPDATE users SET name = $1, email = $2, username = $3 WHERE id = $4 RETURNING *;';
    const values = [name, email, username,image, id];
    try {
        const res = await pool.query(query, values);
        return res.rows[0]; // Returns the updated user
    } catch (err) {
        console.error('Error executing updateUser query', err.stack);
        throw err;
    }
};

// Delete a user
const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *;';
    const values = [id];
    try {
        const res = await pool.query(query, values);
        return res.rows[0]; // Returns the deleted user
    } catch (err) {
        console.error('Error executing deleteUser query', err.stack);
        throw err;
    }
};

module.exports = {
    getUsers,
    getUserByUserName,
    addUser,
    updateUser,
    deleteUser
};
