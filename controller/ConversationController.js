const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
const User = require("../models/user");
const Conversation = require("../models/conversation");


const addConversation = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      status: false,
      message: "UserId is required"
    });
  }

  try {
    const currentUser = await User.findById(req.user.userId);
    const otherUser = await User.findById(userId);

    const existingConversation = await Conversation.find({
      isGroup: false,
      $and: [
        { members: currentUser._id },
        { members: otherUser._id }
      ]
    }).populate('members').populate('lastMessage').populate('messages');

    let result;

    if (existingConversation.length === 0) {
      // Create the conversation as a Mongoose document
      const newConversation = new Conversation({
        members: [currentUser._id, otherUser._id]
      });

      // Save the conversation to the database
      const savedConversation = await newConversation.save();

      result = await savedConversation.populate('members').populate('lastMessage').populate('messages');
    } else {
      result = existingConversation[0]; // Assuming you expect only one conversation
    }

    return res.status(200).json({
      status: true,
      message: "Conversation retrieved.",
      data: result
    });
  } catch (error) {
    console.error("Error adding conversation:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
});



// get current user conversations
const getCurrentUserConversations = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  const usersConversation = await Conversation.find({
    members: currentUser._id,
  }).populate({
    path: 'members',
    match: { _id: { $ne: currentUser._id } }, // Exclude current user
    select: 'name profileImage '
  }).populate({
    path: 'lastMessage',
    select: 'text senderId createdAt'
  }).populate('messages');
  
  if (usersConversation.length > 0) {
    res.status(200).json({
      status: true,
      message: "Current user conversations retrieved",
      data: usersConversation,
    });
  }
  res.status(400).json({
    status: false,
    message: "Conversation not found",
  });
});

//search conversation
// const searchConversation = asyncHandler(async (req, res) => {

// })



module.exports = {addConversation, getCurrentUserConversations}
