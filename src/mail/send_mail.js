require('dotenv').config();

const nodemailer = require('nodemailer');

const auth = {
    type: process.env.AUTH_TYPE,
    user: process.env.AUTH_USER,
    clientId: process.env.AUTH_CLIENTID,
    clientSecret: process.env.AUTH_CLIENTSECRET,
    refreshToken: process.env.AUTH_REFRESHTOKEN,
    accessToken: process.env.AUTH_ACCESSTOKEN
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth
});

const sendEmail = data => {
    transporter.sendMail(data, (err, info) => {
        if( err ) throw err;
        console.log('Email sent: ' + info.response);
    });
};

module.exports = { sendEmail };
