const jwt = require('jsonwebtoken');
const CustomError = require('../exceptions/CustomError');

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
        
        return res.status(401).send({
            status: 'failed',
            message: 'Sesi Anda telah habis, silahkan login ulang'
        });
    }
};
