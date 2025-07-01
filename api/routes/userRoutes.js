import express from "express"
import { protectRoute } from "../middleware/auth.js"
import {
  updateProfile,
  muteUser,
  blockUser
} from "../controllers/userController.js"
import User from "../models/User.js"

const router = express.Router()

// Profile update
router.put("/update", protectRoute, updateProfile)

// Block/mute actions
router.post("/:id/mute", protectRoute, muteUser)
router.post("/:id/block", protectRoute, blockUser)

// 🔍 Search users by name
router.get("/search", protectRoute, async (req, res) => {
  const q = req.query.q?.trim()
  if (!q) return res.json([])

  try {
    const users = await User.find({
      name: { $regex: q, $options: "i" }
    }).limit(10).select("name _id image")
    res.json(users)
  } catch (err) {
    console.error("Search error:", err)
    res.status(500).json({ error: "Server error" })
  }
})
router.get("/unread-senders", protectRoute, async (req, res) => {
  try {
    const messages = await Message.find({
      recipient: req.user._id,
      isRead: false
    }).select("sender")

    const uniqueSenderIds = [...new Set(messages.map(msg => msg.sender.toString()))]

    res.json({ senders: uniqueSenderIds })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch unread senders" })
  }
})

// delete own account
router.delete("/me", protectRoute, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.clearCookie("jwt");
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("delete account error:", err);
    res.status(500).json({ message: "Could not delete account" });
  }
});


export default router
