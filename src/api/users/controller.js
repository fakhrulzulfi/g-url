const User = require('./model');
const CustomError = require('../../exceptions/CustomError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.getOne = async (req, res) => {
    try {
        const { user_id } = req.params;
        const user = await User.findOne({ _id: user_id });

        if( !user ) {
            throw new CustomError('User tidak terdaftar', 404);
        }

        return res.status(200).send({
            status: 'success',
            data: user
        });

    } catch (error) {
        return res.status(error.statusCode || 500).send({
                status: 'failed',
                message: error.message || 'Internal server error'
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { user_id } = req.params;
        const user = await User.findOne({ _id: user_id });
        
        if( !user ) {
            throw new CustomError('User tidak terdaftar', 404);
        }

        /**
         * NOTE : (menyusul)
         * Membuat validasi user hanya bisa update jika id dari user yang di update 
         * sama dengan id di dalam token JWT
         */
        const data = {
            password: req.body.password
        };
        
        const userUpdate = await User.findOneAndUpdate({ _id: user_id }, data);
        
        return res.status(200).send({
            status: 'success',
            message: 'Berhasil mengubah password'
        }); 
    } catch (error) {
        return res.status(error.statusCode || 500).send({
            status: 'failed',
            message: error.message || 'Internal server error'
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const { user_id } = req.params;
        const user = await User.findOne({ _id: user_id });

        if( !user ) {
            throw new CustomError('User tidak terdaftar', 404);
        }

        const deleteUser = await User.findOneAndDelete({ _id: user_id });

        return res.status(200).send({
            status: 'success',
            message: 'Berhasil menghapus user'
        });

    } catch (error) {
        return res.status(error.statusCode || 500).send({
                status: 'failed',
                message: error.message || 'Internal server error'
        });
    }
};

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if( !re.test(email) ) {
            throw new CustomError('Email tidak valid');
        }

        const getUser = await User.findOne({ email });
        if( getUser ) {
            throw new CustomError('Email telah terdaftar, gunakan email yang berbeda', 409);
        }
        
        const saltRounds = 10
        const hashPassword = bcrypt.hashSync(password, saltRounds);

        const user = new User({
            username,
            email,
            password: hashPassword,
            isActive: false
        });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
        user.token = token; // Save token 
        
        const insertUser = await user.save();
        
        return res.status(200).send({
            status: 'success',
            message: 'Registrasi berhasil, silahkan cek email anda untuk mengaktifkan akun',
            user_id: insertUser._id
        }); 
    } catch (error) {
        return res.status(error.statusCode || 500).send({
            status: 'failed',
            message: error.message || 'Internal server error'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if( !email || !password ) {
            throw new CustomError('Email dan password tidak boleh kosong');
        }
        
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if( !re.test(email) ) {
            throw new CustomError('Email tidak valid');
        }

        const selectUser = await User.findOne({ email });
        if( !selectUser ) {
            throw new CustomError('Email tidak terdaftar', 404);
        }

        const matchPwd = bcrypt.compareSync(password, selectUser.password);
        if( !matchPwd ) {
            throw new CustomError('Email dan Password yang anda masukkan salah', 403);
        }

        const checkTokenIsValid = jwt.verify(selectUser.token, process.env.TOKEN_SECRET, (err, decoded) => {
            if( err ) {
                const token = jwt.sign({ id: selectUser._id, username: selectUser.username }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
                selectUser.token = token;
                selectUser.save();

                return res.status(200).send({
                    status: 'success',
                    message: 'Login berhasil',
                    token
                }); 
            } else {
                return res.status(200).send({
                    status: 'success',
                    message: 'Login berhasil',
                    token: selectUser.token
                });
            }
        });
        
    } catch (error) {
        return res.status(error.statusCode || 500).send({
            status: 'failed',
            message: error.message || 'Internal server error'
        });
    }
};
