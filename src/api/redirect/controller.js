const Url = require('../urls/model');
const CustomError = require('../../exceptions/CustomError');

exports.redirectTo = async (req, res) => {
    try {
        const { code } = req.params;
        
        const checkCodeIsValid = await Url.findOne({ short_url: code });
        if( !checkCodeIsValid ) {
            throw new CustomError('Link tidak terdaftar', 404);
        }
        
        return res.redirect(checkCodeIsValid.long_url);
    } catch (error) {
        return res.status(error.code || 500).send({
            status: 'failed',
            message: error.message || 'Internal server error'
        });
    }
};

exports.home = async (req, res) => {
    res.setHeader('Content-type','text/html');
    return res.status(200).send(`<h1>Doi Shortlink Generator</h1><p>Selamat datang di API Doi Shortlink Generator</p><hr><p>Untuk dokumentasi penggunaan API, silahkan menuju <a href="https://api-gurl-shortlink.herokuapp.com">Dokumentasi API</a></p>`);
};
