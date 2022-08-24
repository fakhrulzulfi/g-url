require('dotenv').config();
const User = require('../users/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CustomError = require('../../exceptions/CustomError');
const { sendEmail } = require('../../mail/send_mail');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const selectUser = await User.findOne({ email });
        if( !selectUser ) {
            throw new CustomError('Email tidak terdaftar', 404);
        }

        const matchPwd = bcrypt.compareSync(password, selectUser.password);
        if( !matchPwd ) {
            throw new CustomError('Email dan Password yang anda masukkan salah', 403);
        }

        if( !selectUser.isActive ) {
            throw new CustomError('Akun anda belum aktif, silahkan mengaktifkan akun melalui link yang telah diberikan di email Anda');
        }
        
        try {
            const checkTokenIsValid = jwt.verify(selectUser.token, process.env.TOKEN_SECRET);

            return res.status(200).send({
                status: 'success',
                message: 'Login berhasil',
                userID: selectUser._id,
                token: selectUser.token
            });
        } catch(err) {
            //  Token tidak valid
            const token = jwt.sign({ id: selectUser._id, username: selectUser.username }, process.env.TOKEN_SECRET, { expiresIn: '48h' });
            selectUser.token = token;
            selectUser.save();

            return res.status(200).send({
                status: 'success',
                message: 'Login berhasil',
                token
            });
        }
    } catch (error) {
        return res.status(error.code || 500).send({
            status: 'failed',
            message: error.message || 'Internal server error'
        });
    }
};

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = new User({
            username,
            email,
            password,
            isActive: false
        });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
        user.token = token; // Save token 
        
        await user
            .save()
            .then(result => {
                // mail configurations in /src/mail/send_mail.js
                const mailTemplate = {
                    from: 'Admin Doi Shortlink URL',
                    to: result.email,
                    subject: 'Please confirm your account',
                    html: `<div>
                    <h1>Email Confirmation</h1>
                    <h2>Halo, selamat ${result.username} pendaftaran akun anda berhasil!</h2>
                    <p>Selanjutnya, silahkan klik tautan dibawah ini untuk mengaktifkan akun Anda</p>
                    <p>http://localhost:1337/api/user/confirm/${result._id}/${result.token}</p>
                    <p>Tautan tersebut hanya berlaku selama 48 jam.</p>
                    <br>
                    <p>Terima kasih,</p>
                    <p>Doi Shortlink Team</p>
                    </div>`
                };
                sendEmail(mailTemplate);
                return res.status(200).send({
                    status: 'success',
                    message: 'Registrasi berhasil, silahkan cek Email anda pada Kotak Masuk atau Spam untuk mengaktifkan akun'
                });
            })
            .catch(error => {
                if( error.code === 11000 ) {
                    return res.status(409).send({
                        status: 'failed',
                        message: 'Email yang Anda masukkan telah digunakan'
                    });
                }
            });
    } catch (error) {
        return res.status(error.code || 500).send({
            status: 'failed',
            message: error.message || 'Internal server error'
        });
    }
};