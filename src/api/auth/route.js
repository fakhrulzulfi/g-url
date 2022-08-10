const router = require('express').Router();
const {
    login,
    register
} = require('./controller');
const Validator = require('../../middlewares/validator');

router.post('/login', Validator('login'), login);
router.post('/register', Validator('register'), register);

module.exports = router;
