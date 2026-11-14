
import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { chatWithDocuments,streamChatWithDocuments } from "../controller/chatController.js";

const router = express.Router();

router.post("/", authenticateUser, chatWithDocuments);
router.post(
  "/stream",
  authenticateUser,
  streamChatWithDocuments
);
export default router;
