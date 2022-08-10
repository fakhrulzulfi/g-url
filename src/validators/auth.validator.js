const Joi = require('joi');

exports.registerSchema = Joi.object({
    username: Joi.string().min(5).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).max(255).required()
});

exports.loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required()
});
