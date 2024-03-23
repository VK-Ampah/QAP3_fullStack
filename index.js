const express = require('express');
const app = express();
const methodOverride = require('method-override');
const port = 3000;
const path = require('path');
global.DEBUG = true;

// configure views and static files
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // moved after express.urlencoded
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    if (DEBUG) console.log('GET /');
    // res.send('Hello World!');
    res.render('index');
    });
// API routes
const loginsRouter = require('./routes/api/logins');
app.use('/logins', loginsRouter);

const usersRouter = require('./routes/api/users');
app.use('/users', usersRouter);

app.use((req, res,next) => {
    res.status(404).send('Sorry cant find that!');
    });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);


