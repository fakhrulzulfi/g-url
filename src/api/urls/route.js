const router = require('express').Router();
const urlController = require('./controller');
const { checkToken, isActive } = require('../../middlewares/middleware');
const Validator = require('../../middlewares/validator');

router.get('/:urlID?', urlController.getAll);
router.post('/', checkToken, isActive, Validator('urlInsert'), urlController.insert);
router.put('/:urlID/update', checkToken, isActive, Validator('urlUpdate'), urlController.update);
router.delete('/:urlID/delete', checkToken, isActive, urlController.delete);

module.exports = router;
