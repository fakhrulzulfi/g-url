require('dotenv').config();
const Url = require('./model');
const User = require('../users/model');
const CustomError = require('../../exceptions/CustomError');
const shortId = require('shortid');
const jwtDecoder = require('jwt-decode');


exports.getAll = async (req, res) => {
    try {
        const { urlID = null } = req.params;
        const urls = urlID === null
        ? await Url.find()
        : await Url.findOne({ _id: urlID });

        return res.status(200).send({
            status: 'success',
            data: urls
        });
    } catch (error) {
        return res.status(error.code || 500).send({
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
        
        insertUrl
            .save()
            .then(result => {
                return res.status(201).send({
                    status: 'success',
                    message: 'Shortlink berhasil dibuat',
                    link: `http://localhost:1337/${result.short_url}`
                });
            })
            .catch(error => {
                if( error.code === 11000 ) {
                    return res.status(409).send({
                        status: 'failed',
                        message: 'Custom URL yang Anda masukkan telah digunakan'
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

exports.update = async (req, res) => {
    try {
        const { urlID } = req.params;
        const { longUrl, customCode } = req.body;
        
        // Authorization
        // Memastikan URL tersebut sesuai dengan pemiliknya
        const getUserID = jwtDecoder(req.headers.authorization.split(' ')[1]).id;
        const url = await Url.findOne({ _id: urlID }).populate('user');
        if( url.user._id.toString() !== getUserID ) {
            throw new CustomError('Maaf, Anda tidak dapat mengakses data tersebut', 401);
        }

        await Url.findOneAndUpdate({ _id: urlID }, {short_url: customCode, long_url: longUrl});

        return res.status(200).send({
            status: 'success',
            message: 'Data URL berhasil diperbarui'
        });
    } catch (error) {
        return res.status(error.code || 500).send({
            status: 'failed',
            message: error.message || 'Internal server error'
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const { urlID } = req.params;
        
        // Authorization
        // Memastikan URL tersebut sesuai dengan pemiliknya
        const getUserID = jwtDecoder(req.headers.authorization.split(' ')[1]).id;
        const url = await Url.findOne({ _id: urlID }).populate('user');
        if( url.user === null || url.user._id.toString() !== getUserID ) {
            throw new CustomError('Maaf, Anda tidak dapat mengakses data tersebut', 401);
        }

        await Url.findOneAndRemove({ _id: urlID });

        return res.status(200).send({
            status: 'success',
            message: 'URL berhasil dihapus'
        });
    } catch (error) {
        return res.status(error.code || 500).send({
            status: 'failed',
            message: error.message || 'Internal Server Error'
        });
    }
};
