const pool = require('./dal.auth.js');
const bcrypt = require('bcrypt');
const e = require('express');
const jwt = require('jsonwebtoken');



// const registerUser = async (username, password) => {
//     const sql = 'INSERT INTO logins (username, password) VALUES ($1, $2) RETURNING *';
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const result = await pool.query( sql, [username, password]);
//         console.log('User registered');
//         console.log(result.rows[0]);
//         return result.rows[0];
//     } catch (error) {
//         console.error(error);
//     }
// }

// this will allow users login if they already have a user account
// since the username in the logins table is unique, and references the users table, we can use the username to get the user_id when needed
const registerUser = async (username, password) => {
    // First, check if the username is already taken
    const checkSql = 'SELECT * FROM logins WHERE username = $1';
    const checkUserssql = 'SELECT username FROM users where username = $1';
    const checkUserresult = await pool.query(checkUserssql, [username]);    
    const checkResult = await pool.query(checkSql, [username]);

    if (checkUserresult.rows.length > 0 && checkResult.rows.length > 0 ) {
        console.log('Username exist and is already taken');
        return null;
    }
    else if (checkUserresult.rows.length > 0 && checkResult.rows.length == 0 ) {
        const sql = 'INSERT INTO logins (username, password) VALUES ($1, $2) RETURNING *';
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(sql, [username, hashedPassword]); // Use hashed password here
            console.log('User registered');
            console.log(result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error(error);
        }
    }
    else {
        console.log('Username does not exist');
        return null;
    }
}

const getLogins = async () => {
    if (DEBUG) console.log('getLogins');
    try {
        const result = await pool.query('SELECT * FROM logins');
        console.log(result.rows);
        console.log(result.fields);
        return result.rows;
    }
    catch (error) {
        console.error(error);
    }
}

const getLoginByUsername = async (username) => {
    const sql = 'SELECT * FROM logins WHERE username = $1';
    try {
        const result = await pool.query(sql, [username]);
        console.log(result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error(error);
    }
}

const patchLogin = async (username, password) => {
    const sql = 'UPDATE logins SET password = $2 WHERE username = $1 RETURNING *';
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(sql, [username, hashedPassword]);
        console.log(result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error(error);
    }
}

const deleteLogin = async (username) => {
    const sql = 'DELETE FROM logins WHERE username = $1 RETURNING *';
    try {
        const result = await pool.query(sql, [username]);
        console.log(result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error(error);
    }
}

module.exports = { registerUser, getLogins, getLoginByUsername, patchLogin, deleteLogin };