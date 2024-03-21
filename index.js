const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
global.DEBUG = true;



// // middleware
// app.use((req, res, next) => {
//     console.log('Time:', Date.now());
//     next();
//     });

// configure views and static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    if (DEBUG) console.log('GET /');
    // res.send('Hello World!');
    res.render('index');
    });

app.use((req, res,next) => {
    res.status(404).send('Sorry cant find that!');
    });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);

// Path: public/index.html
