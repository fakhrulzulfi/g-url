const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getAll);
router.post('/register', userController.insert);


module.exports = router;
