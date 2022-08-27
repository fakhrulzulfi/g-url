const router = require('express').Router();
const { redirectTo, home } = require('./controller');

router.get('/', home);
router.get('/:code', redirectTo);

module.exports = router;