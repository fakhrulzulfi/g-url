const User = require('../models/User');

exports.getAll = async (req, res) => {
    try {
        const users = await User.find();
        const totalOf = await User.find().countDocuments();

        return res.status(200).json({
            status: 'success',
            data: users,
            totalOfData: totalOf
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: 'failed',
            message: error.message || 'Internal server error'
        });
    }
};

exports.getOne = async (req, res) => {
    try {
        const { user_id } = req.params;
        const user = await User.findOne({ _id: user_id });

        if( !user ) {
            return res.status(404).send({
                status: 'failed',
                message: 'User tidak ditemukan'
            });
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

exports.insert = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if( !re.test(email) ) {
            return res.status(400).send({
                status: 'failed',
                message: 'Email tidak valid'
            });
        }

        const getUser = await User.findOne({ email });
        if( getUser ) {
            return res.status(409).send({
                status: 'failed',
                message: 'Email telah digunakan'
            });
        }

        const user = new User({
            username,
            email,
            password,
            isActive: false
        });
        
        const insertUser = await user.save();
        
        return res.status(200).send({
            status: 'success',
            message: 'Berhasil menambahkan user',
            user_id: insertUser._id
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
            return res.status(404).send({
                status: 'failed',
                message: 'User tidak ditemukan'
            });
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
            return res.status(404).send({
                status: 'failed',
                message: 'User tidak ditemukan'
            });
        }

        const deleteUser = await User.findOneAndDelete({ _id: user_id });
        console.log(deleteUser);

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