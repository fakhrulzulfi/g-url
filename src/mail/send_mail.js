require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PWD
    },
    authentication: 'plain',
});

const sendEmail = data => {
    transporter.sendMail(data, (err, info) => {
        if( err ) throw err;
        console.log('Email sent: ' + info.response);
    });
};

module.exports = { sendEmail };
