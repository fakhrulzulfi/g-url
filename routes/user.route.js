const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getAll);
router.get('/:user_id', userController.getOne);
router.post('/', userController.insert);
router.patch('/:user_id', userController.update);
router.delete('/:user_id', userController.delete);

module.exports = router;
