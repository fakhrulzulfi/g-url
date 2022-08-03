const Url = require('../urls/model');

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
