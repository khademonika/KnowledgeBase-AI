import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { createConversation, getConversations, getMessages, saveMessage } from "../controller/conversationController.js";

const router = express.Router();

router.post("/", authenticateUser, createConversation);
router.get("/", authenticateUser, getConversations);
router.post("/messages", authenticateUser, saveMessage);
router.get("/:conversationId/messages", authenticateUser, getMessages);
export default router;