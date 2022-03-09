require('dotenv').config();
const Url = require('./model');
const User = require('../users/model');
const CustomError = require('../../exceptions/CustomError');
const validUrl = require('valid-url');
const shortId = require('shortid');

exports.getAll = async (req, res) => {
    try {
        const urls = await Url.find();

        return res.status(200).send({
            status: 'success',
            data: urls
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
        const {
            url,
            customCode = shortId.generate(),
        } = req.body;
        const user_id = req.user;

        const insertUrl = await new Url({
            short_url: customCode,
            long_url: url,
            user: user_id
        });
        insertUrl.save();       // save to Url collection

        const getUserFromId = await User.findOne({_id: user_id});
        getUserFromId.urls.push(insertUrl._id);
        getUserFromId.save();   // save to User collection

        return res.status(200).send({
            status: 'success',
            message: 'Shortlink berhasil dibuat',
            link: `http://localhost:3000/${customCode}`
        });
    } catch (error) {
        return res.status(error.statusCode || 500).send({
            status: 'failed',
            message: error.message || 'Internal server error'
        });
    }
};

exports.redirectTo = async (req, res) => {
    try {
        const { code } = req.params;
        
        const checkCodeIsValid = await Url.findOne({ short_url: code });
        if( !checkCodeIsValid ) {
            throw new CustomError('Link tidak terdaftar', 404);
        }
        
        return res.redirect(checkCodeIsValid.long_url);
    } catch (error) {
        return res.status(error.statusCode || 500).send({
            status: 'failed',
            message: error.message || 'Internal server error'
        });
    }
};
