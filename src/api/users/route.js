const router = require('express').Router();
const userController = require('./controller');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.patch('/user/reset_password', userController.update);
router.get('/user/:user_id', userController.getOne);

module.exports = router;
