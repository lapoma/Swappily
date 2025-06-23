// const Path = require('path');
const express = require('express');
const app = express();
const cors = require('cors') //https://www.npmjs.com/package/cors
const path = require('path');

const authentication = require('./authentication/authentication.js'); 
const tokenChecker = require('./authentication/tokenChecker.js');

const users = require('./users.js');
const listings = require('./listings.js');
const exchanges = require('./exchanges.js');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())

//aggiungere qui frontend
//app.use('/', express.static('static')); - if FRONTEND.env folder does not contain index.html then use the one from static

app.use((req, res, next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

// authentication routing
app.use('/api/v1/authentications', authentication);

// the access is allowed only to authenticated users with a valid token 
app.use('/api/v1/exchanges', tokenChecker);

app.use('/api/v1/users', (req, res, next) => {
    if (['PUT', 'DELETE', ].includes(req.method)) {
        tokenChecker(req, res, next);
    } else if (req.path === '/me') {
        tokenChecker(req, res, next);
    } else {
        next(); // Allow GET without authentication
    }
});

// Resource routing
app.use('/api/v1/listings', listings);
app.use('/api/v1/users', users);
app.use('/api/v1/exchanges', exchanges);

// Default 404 handler 
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

// Default error handler 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error' });
});

module.exports = app;