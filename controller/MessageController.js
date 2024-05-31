const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
const User = require("../models/user");
const Conversation = require("../models/conversation");

const addMessage = asyncHandler(async (req, res) => {
  const { message, conversationId, receiverId } = req.body;
  if (!message || !conversationId || !receiverId) {
    return res.status(404).json({
      status: false,
      message: "Fields are required",
    });
  }
  const otherUser = await User.findById(receiverId);
  const currentUser = await User.findById(req.user.userId);

  const existingConversation = await Conversation.findById(conversationId);

  if (otherUser && currentUser && existingConversation) {
    const newMessage = await Message.create({
      conversationId: conversationId,
      senderId: currentUser._id,
      receiverId: otherUser._id,
      text: message,
    });

    existingConversation.lastMessage = newMessage._id;
    existingConversation.messages.push(newMessage);
    await existingConversation.save();

    res.status(200).json({
        status: true,
        message: "Message sent.",
        data: newMessage
    })
  } else {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }
});

const getAllMessages = asyncHandler(async (req, res) => {
  const otherUserId = req.params.id;
  const currentUserId = req.user.userId;
  const conversation = await Conversation.findOne({members: {$all: [otherUserId, currentUserId]}}).populate({
    path: 'messages'
  });
  const otherUserDetail = await User.findById(otherUserId).select('name profileImage');

  const messages = conversation.messages;
  return res.status(200).json({
    status: true,
    message: "All messages retrieved",
    data: {
      messages : messages,
      otherUser : otherUserDetail
    }
  })
})

module.exports = {addMessage, getAllMessages};
