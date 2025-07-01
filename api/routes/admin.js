import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// verify admin
router.post("/verify", protectRoute, async (req, res) => {
  const { code } = req.body;
  const correctCode = process.env.ADMIN_SECRET;

  try {
    if (code !== correctCode) {
      return res.status(403).json({ message: "Invalid admin code" });
    }

    // re-issue token with user id + isAdmin true
    const token = jwt.sign(
      { id: req.user._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
res.cookie("jwt", token, {
  httpOnly: true,
  sameSite: "none", // allow cross-origin cookies
  secure: true,     // required for HTTPS
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


    res.json({ message: "You are now admin" });
  } catch (err) {
    console.error("verify admin error:", err);
    res.status(500).json({ message: "Could not verify admin" });
  }
});

// get all users
router.get("/users", protectRoute, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Not authorized" });
  }
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("users error", err);
    res.status(500).json({ message: "Could not fetch users" });
  }
});

// check admin
router.get("/check", protectRoute, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Not authorized" });
  }
  res.json({ message: "ok" });
});

// delete user by id
router.delete("/users/:id", protectRoute, async (req, res) => {
  try {
    // allow admins to delete any user
    if (req.user.isAdmin) {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ message: "User deleted successfully" });
    }

    // normal user can only delete themselves
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Not authorized to delete this account" });
    }

    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Your account has been deleted successfully" });
  } catch (err) {
    console.error("delete error", err);
    res.status(500).json({ message: "Could not delete user" });
  }
});


export default router;
