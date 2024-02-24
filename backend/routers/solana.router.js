const router = require('express').Router();
const solanaPay = require('../apis/solanaPay.api.js');

router.get('/:reference', solanaPay.generatePayment);
router.post('/', solanaPay.generatePayment);

module.exports = router;