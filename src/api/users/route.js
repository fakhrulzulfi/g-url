const router = require('express').Router();
const userController = require('./controller');
const { checkToken, isActive } = require('../../middlewares/middleware');
const Validator = require('../../middlewares/validator');

router.get('/user/:userID?', userController.get);
router.put('/user/:userID/update', checkToken, isActive, Validator('userUpdate'), userController.update);
router.delete('/user/:userID/delete', checkToken,  isActive, Validator('userDelete'), userController.delete);
router.patch('/user/:userID/change-password', checkToken,  isActive, Validator('userChangePassword'), userController.changePassword);
router.patch('/user/:userID/change-email', checkToken,  isActive, Validator('userChangeEmail'), userController.changeEmail);
router.get('/confirm/:userID/:token', userController.confirmAccount);

module.exports = router;
