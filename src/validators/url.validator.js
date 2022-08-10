const Joi = require('joi');

exports.insertSchema = Joi.object({
    url: Joi.string().uri().required().messages({ 'string.uri': 'url not valid. url must be contains http or https' }),
    customCode: Joi.string().min(5).max(255)
});

exports.updateSchema = Joi.object({
    customCode: Joi.string().min(5).max(255),
    longUrl: Joi.string().uri().required().messages({ 'string.uri': 'url not valid. url must be contains http or https' })
});
