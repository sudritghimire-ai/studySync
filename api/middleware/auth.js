import jwt from "jsonwebtoken";
import User from "../models/User.js";
import mongoose from "mongoose";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = decoded;

    if (role === "admin") {
      req.user = { role: "admin" };
      return next();
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - Invalid user ID",
      });
    }

    const currentUser = await User.findById(id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - User not found",
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.log("Error in auth middleware: ", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - Invalid token",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};
