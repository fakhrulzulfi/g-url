require('dotenv').config();

const nodemailer = require('nodemailer');

const auth = {
    type: 'oauth2',
    user: 'fakhrul.19021@mhs.unesa.ac.id',
    clientId: '734851229707-9g8d9tnokkponu26qf6bl8no0ou7itlv.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04nuFOlaaSna-CgYIARAAGAQSNwF-L9IrCMsA5JrdjSohGJsJsH22y0EUqiEEcUtn337wnQQ2ZhJKldifnws7EzTFuMEFPLfw7ZQ',
    accessToken: 'ya29.A0AVA9y1sUslTEpN-05Nn-MsCVoOcTjiBfS3zZqZtVMldQ9YyiZJ-JXAAlvF5oB5IC15gV53ilyE4HWYLuinBrEIDaLFAagYhENeZ41GHiCXqWngyxmvsmB3ftOtmAVdL-Tky-CLGjF_z3VIt41dzugj3nPn9-aCgYKATASATASFQE65dr8_aOf0DwDCfpeUC1SQv8ztg0163'
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
