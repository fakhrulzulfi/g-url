const Joi = require('joi');

exports.updateSchema = Joi.object({
    username: Joi.string().min(5).max(255).required()
});

exports.deleteSchema = Joi.object({
    password: Joi.string().min(8).max(255).required()
});

exports.changeEmailSchema = Joi.object({
    email: Joi.string().email().lowercase().required()
});

exports.changePasswordSchema = Joi.object({
    oldPassword: Joi.string().min(8).max(255).required(),
    newPassword: Joi.string().min(8).max(255).required()
});
