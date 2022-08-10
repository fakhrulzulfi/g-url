const {
    registerSchema,
    loginSchema,
} = require('./auth.validator');

module.exports = {
    register: registerSchema,
    login: loginSchema
};
