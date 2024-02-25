const router = require('express').Router();
const exchange = require('../apis/exchange.api.js');
const multer = require('multer');
const upload = multer();

router.get('/',upload.none(),exchange.getExchange);

module.exports = router;