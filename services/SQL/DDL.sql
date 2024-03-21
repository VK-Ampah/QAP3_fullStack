CREATE DATABASE soccer;

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


CREATE TABLE logins (
    login_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT username_fkey FOREIGN KEY (username) REFERENCES users(username) ON UPDATE CASCADE,
    CONSTRAINT user_unique UNIQUE (username)
);