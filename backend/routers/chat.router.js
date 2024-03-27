const messageController = require("../controllers/chat.controller");
const router = require("express").Router();
const upload = require("multer")();
const { handleCache } = require("../middleware/redis.middleware");
const { verifySession } = require("../middleware/session.middleware");

//GET
// router.get("/", upload.none(), messageController.GetMessages);
// router.get("/:id", upload.none(), messageController.GetMessageById);
// router.get('/sender/:sender', upload.none(), messageController.GetMessageBySender)
// router.get('/receiver/:receiver', upload.none(), messageController.GetMessageByReceiver)
router.get("/", upload.none(), verifySession,  messageController.GetChats);
router.get("/:user1", upload.none(), verifySession,  messageController.GetChat);
//POST
router.post("/", upload.none(), verifySession,  messageController.SendMessage);

module.exports = router;
