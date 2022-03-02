const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getAll);
router.post('/', userController.insert);


module.exports = router;
