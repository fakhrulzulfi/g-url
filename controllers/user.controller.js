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

exports.insert = async (req, res) => {
    try {
        const { username, email, password } = req.body;
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
}