const router = require('express').Router();
const userController = require('./controller');
const { checkToken, isActive } = require('../../middlewares/middleware');

router.get('/user/:userID?', userController.get);
router.put('/user/:userID/update', checkToken, isActive, userController.update);
router.delete('/user/:userID/delete', checkToken,  isActive, userController.delete);
router.patch('/user/:userID/change-password', checkToken,  isActive, userController.changePassword);
router.patch('/user/:userID/change-email', checkToken,  isActive, userController.changeEmail);
router.get('/confirm/:userID/:token', userController.confirmAccount);

module.exports = router;
