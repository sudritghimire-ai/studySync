import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getConversation,
  sendMessage,
  markMessagesAsSeen,
} from "../controllers/messageController.js";

const router = express.Router();

router.use(protectRoute);

router.post("/send", sendMessage);
router.get("/conversation/:userId", getConversation);
router.post("/mark-seen/:chatUserId", markMessagesAsSeen); // ✅ new route

export default router;
