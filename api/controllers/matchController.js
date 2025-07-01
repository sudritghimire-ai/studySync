import User from "../models/User.js";
import Message from "../models/Message.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

// 👉 Swipe Right Logic (Like)
export const swipeRight = async (req, res) => {
  try {
    const { likedUserId } = req.params;
    const currentUser = await User.findById(req.user.id);
    const likedUser = await User.findById(likedUserId);

    if (!likedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.likes.push(likedUserId);
      await currentUser.save();

      // if mutual like, create match
      if (likedUser.likes.includes(currentUser.id)) {
        currentUser.matches.push(likedUserId);
        likedUser.matches.push(currentUser.id);
        await Promise.all([currentUser.save(), likedUser.save()]);

        // notify with socket
        const io = getIO();
        const connectedUsers = getConnectedUsers();

        const likedSocket = connectedUsers.get(likedUserId);
        if (likedSocket) {
          io.to(likedSocket).emit("newMatch", {
            _id: currentUser._id,
            name: currentUser.name,
            image: currentUser.image,
          });
        }

        const currentSocket = connectedUsers.get(currentUser._id.toString());
        if (currentSocket) {
          io.to(currentSocket).emit("newMatch", {
            _id: likedUser._id,
            name: likedUser.name,
            image: likedUser.image,
          });
        }
      }
    }

    res.status(200).json({ success: true, user: currentUser });
  } catch (error) {
    console.error("Error in swipeRight:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 👈 Swipe Left Logic (Dislike)
export const swipeLeft = async (req, res) => {
  try {
    const { dislikedUserId } = req.params;
    const currentUser = await User.findById(req.user.id);

    if (!currentUser.dislikes.includes(dislikedUserId)) {
      currentUser.dislikes.push(dislikedUserId);
      await currentUser.save();
    }

    res.status(200).json({ success: true, user: currentUser });
  } catch (error) {
    console.error("Error in swipeLeft:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 📦 Get Matches with message flags
export const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("matches", "name image");

    // messages *sent to me* that I have not seen
    const messagesForMe = await Message.find({
      receiver: req.user.id,
      seenBy: { $ne: req.user.id },
    });

    const newMessageMap = new Map();
    messagesForMe.forEach((msg) => {
      newMessageMap.set(msg.sender.toString(), true);
    });

    // messages *I sent* but THEY haven’t seen
    const mySentMessages = await Message.find({
      sender: req.user.id,
    });

    const sentMessageMap = new Map();
    mySentMessages.forEach((msg) => {
      if (!msg.seenBy.includes(msg.receiver.toString())) {
        sentMessageMap.set(msg.receiver.toString(), true);
      }
    });

    // build
    const matches = user.matches.map((match) => ({
      _id: match._id,
      name: match.name,
      image: match.image,
      hasNewMessage: newMessageMap.has(match._id.toString()),
      hasUnseenByReceiver: sentMessageMap.has(match._id.toString()),
    }));

    res.status(200).json({ success: true, matches });
  } catch (error) {
    console.error("Error in getMatches:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔍 Get swipable profiles
// ✅ fixed getUserProfiles
export const getUserProfiles = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const users = await User.find({
      $and: [
        { _id: { $ne: currentUser._id } },                   // exclude yourself
        { _id: { $nin: currentUser.likes } },                // exclude liked
        { _id: { $nin: currentUser.dislikes } },             // exclude disliked
        { _id: { $nin: currentUser.matches } },              // exclude matched
        {
          gender: currentUser.genderPreference === "both"
            ? { $in: ["male", "female"] }
            : currentUser.genderPreference,
        },
        { genderPreference: { $in: [currentUser.gender, "both"] } }
      ]
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error in getUserProfiles:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
