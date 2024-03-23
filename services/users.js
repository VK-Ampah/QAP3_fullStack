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
const getUserById = async (id) => {
    const query = 'SELECT * FROM users WHERE user_id = $1;';
    const values = [id];
    try {
        const res = await pool.query(query, values);
        if (res.rows.length === 0) {
            throw new Error(`User with id ${id} not found`);
        }
        return res.rows[0];
    }
    catch (err) {
        console.error('Error executing getUserById query', err.stack);
        throw err;
    }
};


// Add a new user
const addUser = async (firstname,middlename,lastname,email,username,image_url) => {
    const query = 'INSERT INTO users (first_name,middle_name,last_name,email,username,image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;';
    const values = [firstname,middlename,lastname,email,username,image_url];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error executing addUser query', err.stack);
        throw err;
    }

};

// update a user
const updateUser = async (id, firstname, middlename, lastname, email, username, image) => {
    const query = 'UPDATE users SET first_name = $1, middle_name = $2, last_name = $3, email = $4, username = $5, image_url = $6 WHERE user_id = $7 RETURNING *;';
    const values = [firstname, middlename, lastname, email, username, image, id];
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
    const query = 'DELETE FROM users WHERE user_id = $1 RETURNING *;';
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
    getUserById,
    addUser,
    updateUser,
    deleteUser
};
