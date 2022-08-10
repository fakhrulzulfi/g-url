const Joi = require('joi');
const Validator = require('../validators');

module.exports = function( validator ) {
    if( !Validator.hasOwnProperty(validator) ) throw new Error(`'${validator}' validator is not exist`)

    return async function( req, res, next ) {
        try {
            const options = {
                errors: {
                    wrap: {
                        label: ''
                    }
                }
            };
            const validated = await Validator[validator].validateAsync(req.body, options);
            req.body = validated;
            next();
        } catch (error) {
            return res.status(error.isJoi ? 422 : 500).send({
                status: 'failed',
                message: error.message || 'Internal Server Error'
            });
        }
    }
};
