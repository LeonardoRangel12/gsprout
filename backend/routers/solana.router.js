const router = require('express').Router();
const solanaPay = require('../apis/solanaPay.api.js');
const multer = require('multer');
const upload = multer();
router.get('/:reference', upload.none(), solanaPay.generatePayment);
router.post('/:juegoId', upload.none(), solanaPay.generatePayment);

module.exports = router;