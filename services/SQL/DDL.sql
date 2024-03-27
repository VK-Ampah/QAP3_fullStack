-- create database
CREATE DATABASE soccer;

-- create users table
CREATE TABLE if not exists users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL,
    image_url VARCHAR(2048),
    CONSTRAINT unique_user UNIQUE (username),
    CONSTRAINT unique_email UNIQUE (email)  
);

-- insert user
INSERT INTO users (first_name, middle_name, last_name, email, username, image_url)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- get all users
SELECT * FROM users;

-- get user by id
SELECT * FROM users WHERE user_id = $1;

-- update user by id    
UPDATE users 
SET first_name = $1, middle_name = $2, last_name = $3, email = $4, username = $5, image_url = $6 
WHERE user_id = $7 
RETURNING *;

-- delete user by id
DELETE FROM users WHERE user_id = $1;

