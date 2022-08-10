const router = require('express').Router();
const urlController = require('./controller');
const { checkToken, isActive } = require('../../middlewares/middleware');
const Validator = require('../../middlewares/validator');

router.get('/url/:urlID?', urlController.getAll);
router.post('/url', checkToken, isActive, Validator('urlInsert'), urlController.insert);
router.put('/url/:urlID/update', checkToken, isActive, Validator('urlUpdate'), urlController.update);
router.delete('/url/:urlID/delete', checkToken, isActive, urlController.delete);

module.exports = router;
