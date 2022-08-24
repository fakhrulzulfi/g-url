const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const userRoute = require('./src/api/users/route');
const urlRoute = require('./src/api/urls/route');
const authRoute = require('./src/api/auth/route');
const redirectRoute = require('./src/api/redirect/route');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// log configuration 
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);
app.use(logger('combined', {
    interfal: '7d',
    stream: accessLogStream
}));

app.use('/', redirectRoute);
app.use('/api/url/', urlRoute);
app.use('/api/user/', userRoute);
app.use('/api/auth/', authRoute);

app.use(function (err, req, res, next) {
    // handle error non-async route
    res.status(500).send(err.message)
});

module.exports = app;
