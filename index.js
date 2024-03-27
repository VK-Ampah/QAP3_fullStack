const express = require('express');
const app = express();
const methodOverride = require('method-override');
const port = 3000;
const path = require('path');
const {getUsers} = require('./services/users');
global.DEBUG = false;

// configure views and static files
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // moved after express.urlencoded
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// home page
app.get('/', async (req, res) => {
    if (DEBUG) console.log('GET / index page');
    const users = await getUsers();
    res.render('index',{users:users});
    });
// API routes for users
const usersRouter = require('./routes/api/users');
app.use('/users', usersRouter);

app.use((req, res,next) => {
    res.status(404).send('Sorry cant find the resource!');
    });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);


