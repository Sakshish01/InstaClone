const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    },
    senderId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId : 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  text: { type: String, trim: true },
  sharedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
