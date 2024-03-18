const messageController = require('../controllers/message.controller');
const router = require('express').Router();
const upload = require('multer')();

//GET
router.get('/', upload.none(), messageController.GetMessages)
router.get('/:id', upload.none(), messageController.GetMessageById)
router.get('/sender/:sender', upload.none(), messageController.GetMessageBySender)
router.get('/receiver/:receiver', upload.none(), messageController.GetMessageByReceiver)
//POST
router.post('/', upload.none(), messageController.SendMessage)

module.exports = router;