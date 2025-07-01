import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// verify admin — no protectRoute so ANYONE can send code
router.post("/verify", async (req, res) => {
  const { code } = req.body;
  const correctCode = process.env.ADMIN_SECRET;

  try {
    if (code !== correctCode) {
      return res.status(403).json({ message: "Invalid admin code" });
    }

    // note: in verify, there is no req.user since no protectRoute
    // you must re-use normal token to get user id from cookie
    const tokenFromCookie = req.cookies.jwt;

    if (!tokenFromCookie) {
      return res.status(401).json({ message: "Missing user session" });
    }

    let decoded;
    try {
      decoded = jwt.verify(tokenFromCookie, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // re-issue token with isAdmin true
    const newToken = jwt.sign(
      { id: decoded.id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", newToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
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
    if (req.user.isAdmin) {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ message: "User deleted successfully" });
    }

    // normal user can only delete themselves
    if (req.user._id.toString() !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this account" });
    }

    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Your account has been deleted successfully" });
  } catch (err) {
    console.error("delete error", err);
    res.status(500).json({ message: "Could not delete user" });
  }
});

export default router;
