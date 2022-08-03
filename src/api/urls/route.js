const router = require('express').Router();
const urlController = require('./controller');
const { checkToken, isActive } = require('../../middlewares/middleware');

router.get('/url/:urlID?', urlController.getAll);
router.post('/url', checkToken, isActive, urlController.insert);
router.put('/url/:urlID/update', checkToken, isActive, urlController.update);
router.delete('/url/:urlID/delete', checkToken, isActive, urlController.delete);

module.exports = router;
