import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id === "admin") {
      req.user = { isAdmin: true };
      return next();
    }

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - user not found",
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    console.error("protectRoute error", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
