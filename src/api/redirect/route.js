const router = require('express').Router();
const { redirectTo } = require('./controller');

router.get('/:code', redirectTo);

module.exports = router;