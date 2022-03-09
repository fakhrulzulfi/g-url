const router = require('express').Router();
const urlController = require('./controller');
const { checkToken } = require('../../middlewares/middleware');

router.get('/api/url', urlController.getAll);
router.get('/:code', urlController.redirectTo);
router.post('/api/url/shorten', checkToken, urlController.insert);

module.exports = router;
