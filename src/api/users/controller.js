require('dotenv').config();
const User = require('./model');
const Url = require('../urls/model');
const CustomError = require('../../exceptions/CustomError');
const bcrypt = require('bcrypt');
const jwtDecoder = require('jwt-decode');
const { sendEmail } = require('../../mail/send_mail');
const HASH_ROUND = 10;


exports.get = async (req, res) => {
    try {
        const { userID = null } = req.params;
        const user = userID === null 
        ? await User.find().select('-password') 
        : await User.findOne({ _id: userID }).select('-password');
        
        if( !user ) {
            throw new CustomError('User tidak terdaftar', 404);
        }

        return res.status(200).send({
            status: 'success',
            data: user
        });

    } catch (error) {
        return res.status(error.code || 500).send({
                status: 'failed',
                message: error.message || 'Internal server error'
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { userID } = req.params;
        const { username } = req.body;
        
        // Authorization
        // Memastikan user hanya bisa mengubah datanya sendiri
        const getUserID = jwtDecoder(req.headers.authorization.split(' ')[1]).id;
        const user = await User.findOne({ _id: userID });
        if( !user ) {
            throw new CustomError('User tidak terdaftar', 404);
        }
        if( user._id.toString() !== getUserID ) {
            throw new CustomError('Maaf, Anda tidak dapat mengakses data tersebut', 401);
        }

        const data = {
            ...user._doc,
            username
        }

        await User.findOneAndUpdate({ _id: userID }, data);

        return res.status(200).send({
            status: 'success',
            message: 'Data pengguna berhasil diperbarui'
        });
    } catch (error) {
        return res.status(error.code || 500).send({
            status: 'failed',
            message: error.message || 'Internal Server Error'
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const { userID } = req.params;
        const { confirmPassword } = req.body;
        
        // Authorization
        // Memastikan user hanya bisa menghapus datanya sendiri
        const getUserID = jwtDecoder(req.headers.authorization.split(' ')[1]).id;
        const user = await User.findOne({ _id: userID });
        if( !user ) {
            throw new CustomError('User tidak terdaftar', 404);
        }
        if( user._id.toString() !== getUserID ) {
            throw new CustomError('Maaf, Anda tidak dapat mengakses data tersebut', 401);
        }

        if( !user ) {
            throw new CustomError('User tidak terdaftar', 404);
        }

        const passwordIsValid = bcrypt.compareSync(confirmPassword, user.password);

        if( !passwordIsValid ) {
            throw new CustomError('Password Anda tidak sesuai', 403);
        }

        await Url.deleteMany({ 'user': userID });
        await User.findOneAndDelete({ _id: userID });

        return res.status(200).send({
            status: 'success',
            message: 'Berhasil menghapus user'
        });

    } catch (error) {
        return res.status(error.code || 500).send({
                status: 'failed',
                message: error.message || 'Internal server error'
        });
    }
};

exports.confirmAccount = async (req, res) => {
    try {
        const { userID, token } = req.params;
        const user = await User.findOne({ _id: userID });

        if( !user ) {
            throw new CustomError('Pengguna tidak terdaftar');
        }

        if( user.token != token ) {
            throw new CustomError('Token bermasalah')
        }
        
        await User.findOneAndUpdate({ _id: user._id }, {
            ...user._doc,
            isActive: true
        });

        return res.status(200).send({
            status: 'success',
            message: 'Akun berhasil diaktifkan, silahkan login ke dashboard'
        });
    } catch (error) {
        return res.status(error.code || 500).send({
            status: 'failed',
            message: error.message || 'Internal server error'
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { userID }  = req.params;
        const { oldPassword, newPassword } = req.body;

        // Authorization
        // Memastikan user hanya bisa mengubah passwordnya sendiri
        const getUserID = jwtDecoder(req.headers.authorization.split(' ')[1]).id;
        const user = await User.findOne({ _id: userID });
        if( !user ) {
            throw new CustomError('User tidak terdaftar', 404);
        }
        if( user._id.toString() !== getUserID ) {
            throw new CustomError('Maaf, Anda tidak dapat mengakses data tersebut', 401);
        }

        const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);

        if( !passwordIsValid ) {
            throw new CustomError('Password yang Anda masukkan salah', 403);
        }

        const hashPassword = bcrypt.hashSync(newPassword, HASH_ROUND);

        await User.findOneAndUpdate({ _id: userID }, { password: hashPassword });

        return res.status(200).send({
            status: 'success',
            message: 'Berhasil mengubah password'
        });
    } catch (error) {
        return res.status(error.code || 500).send({
            status: 'failed',
            message: error.message || 'Internal server error'
        });
    }
};

exports.changeEmail = async (req, res) => {
    try {
        const { userID } = req.params;
        const { email } = req.body;

        // Authorization
        // Memastikan user hanya bisa mengubah passwordnya sendiri
        const getUserID = jwtDecoder(req.headers.authorization.split(' ')[1]).id;
        const user = await User.findOne({ _id: userID });
        if( !user ) {
            throw new CustomError('User tidak terdaftar', 404);
        }
        if( user._id.toString() !== getUserID ) {
            throw new CustomError('Maaf, Anda tidak dapat mengakses data tersebut', 401);
        }

        const data = {
            ...user._doc,
            email,
            isActive: false
        };

        await User.findOneAndUpdate({ _id: userID }, data);

        const mailTemplate = {
            from: 'Admin Doi Shortlink URL',
            to: email,
            subject: 'Please confirm your account',
            html: `<div>
            <h1>Email Confirmation</h1>
            <h2>Halo, selamat ${user.username} pengubahan akun Email anda berhasil!</h2>
            <p>Saat ini status akun Anda non-aktif, silahkan klik tautan dibawah ini untuk mengaktifkan akun Anda.</p>
            <p>http://localhost:1337/api/user/confirm/${user._id}/${user.token}</p>
            <p>Tautan tersebut hanya berlaku selama 48 jam.</p>
            <br>
            <p>Terima kasih,</p>
            <p>Doi Shortlink Team</p>
            </div>`
        };
        sendEmail(mailTemplate);

        return res.status(200).send({
            status: 'success',
            message: 'Email berhasil diubah, silahkan cek akun email pada kotak masuk atau spam untuk mengaktifkan akun Anda.'
        });
    } catch (error) {
        return res.status(error.code || 500).send({
            status: 'failed',
            message: error.message || 'Internal Server Error'
        });
    }
};
