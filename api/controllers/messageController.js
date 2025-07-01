import Message from "../models/Message.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

// ✅ Send a message
export const sendMessage = async (req, res) => {
  try {
    const { content, receiverId } = req.body;

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content,
      seenBy: [], // default empty
    });

    // 🔔 Notify receiver via socket
    const io = getIO();
    const connectedUsers = getConnectedUsers();
    const receiverSocketId = connectedUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        message: newMessage,
      });
    }

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ✅ Get all messages in a conversation
export const getConversation = async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).sort("createdAt");

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log("Error in getConversation: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ✅ Mark messages as seen (fixed to mark BOTH directions)
export const markMessagesAsSeen = async (req, res) => {
  try {
    const { chatUserId } = req.params;

    // mark messages *they* sent to me
    await Message.updateMany(
      {
        sender: chatUserId,
        receiver: req.user.id,
        seenBy: { $ne: req.user.id },
      },
      { $addToSet: { seenBy: req.user.id } }
    );

    // also mark messages *I* sent to them as seen by me
    await Message.updateMany(
      {
        sender: req.user.id,
        receiver: chatUserId,
        seenBy: { $ne: req.user.id },
      },
      { $addToSet: { seenBy: req.user.id } }
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as seen",
    });
  } catch (error) {
    console.log("Error in markMessagesAsSeen: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
