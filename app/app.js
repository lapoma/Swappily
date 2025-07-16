require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authentication = require('./authentication/authentication.js');
const users = require('./users.js');
const listings = require('./listings.js');
const exchanges = require('./exchanges.js');
const reviews = require('./review.js');
const reports = require('./report.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Logger
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get('/', (req, res) => {
  res.send('Backend online');
});

// Routes
app.use('/api/v1/authentications', authentication);
app.use('/api/v1/users', users);
app.use('/api/v1/listings', listings);
app.use('/api/v1/exchanges', exchanges);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/reports', reports);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Global error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error' });
});

module.exports = app;
