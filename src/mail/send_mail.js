require('dotenv').config();

const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.AUTH_CLIENTID,
        process.env.AUTH_CLIENTSECRET,
        "https://developers.google.com/oauthplayground"
    );
    
    oauth2Client.setCredentials({
        refresh_token: process.env.AUTH_REFRESHTOKEN
    });

    const accessTokenOAuth2 = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if( err ) reject();
            resolve(token);
        });
    });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.AUTH_USER,
            clientId: process.env.AUTH_CLIENTID,
            clientSecret: process.env.AUTH_CLIENTSECRET,
            refreshToken: process.env.AUTH_REFRESHTOKEN,
            accessToken: accessTokenOAuth2
        }
    });

    return transporter;
};

const sendEmail = async (data) => {
    const emailTransporter = await createTransporter();
    await emailTransporter.sendMail(data);
};

module.exports = { sendEmail };
