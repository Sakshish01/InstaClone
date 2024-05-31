const express = require("express");
const router = express.Router();
const {addConversation, getCurrentUserConversations} = require("../controller/ConversationController");
const {addMessage, getAllMessages} = require("../controller/MessageController");
const protect = require("../middleware/authMiddleware");

router.post('/add-coversation', protect, addConversation );
router.get('/userConversation', protect, getCurrentUserConversations);

//message routes
router.post('/add-message', protect, addMessage);
router.get('/messages/:id', protect, getAllMessages);


module.exports = router;
