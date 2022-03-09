const router = require('express').Router();
const userController = require('./controller');
const { checkToken } = require('../../middlewares/middleware');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/profile', checkToken, userController.getOne);
router.get('/confirm/:token', userController.confirmAccount);
router.patch('/user/reset_password', checkToken, userController.update);
router.delete('/user/delete', checkToken, userController.delete);


module.exports = router;
