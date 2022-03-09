const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const userRoute = require('./src/api/users/route');
const urlRoute = require('./src/api/urls/route');

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

app.use('/', urlRoute);
app.use('/api/', userRoute);

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.edg8i.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    // 'mongodb://localhost:27017/db_latihan'
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('database connected'));

module.exports = app;
