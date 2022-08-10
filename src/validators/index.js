const auth = require('./auth.validator');
const url = require('./url.validator');
const user = require('./user.validator');

module.exports = {
    register: auth.registerSchema,
    login: auth.loginSchema,

    urlInsert: url.insertSchema,
    urlUpdate: url.updateSchema,

    userUpdate: user.updateSchema,
    userDelete: user.deleteSchema,
    userChangeEmail: user.changeEmailSchema,
    userChangePassword: user.changePasswordSchema
};
