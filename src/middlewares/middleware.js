const jwt = require('jsonwebtoken');
const CustomError = require('../exceptions/CustomError');
const User = require('../api/users/model');

exports.checkToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if( !token ) {
            throw new CustomError('Auth Token is not found', 404);
        }
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verify.id;
        next();
    } catch (error) {
        if( error.name === 'TokenExpiredError') {
            return res.status(401).send({
                status: 'failed',
                message: 'Sesi Anda telah habis, silahkan login ulang'
            });
        }
        
        return res.status(error.code || 500).send({
            status: 'failed',
            message: error.message || 'Internal Server Error'
        });
    }
};

exports.isActive = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user });
        
        if( !user ) {
            throw new CustomError('Pengguna tidak terdaftar', 404);
        }

        if( user.isActive === false ) {
            throw new CustomError('Akun anda belum aktif, silahkan mengaktifkan akun melalui link yang telah dikirimkan pada email Anda');
        }
        next();
    } catch (error) {
        return res.status(error.code || 500).send({
            status: 'failed',
            message: error.message || 'Internal Server Error'
        });
    }
}