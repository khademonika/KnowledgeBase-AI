
import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { chatWithDocuments } from "../controller/chatController.js";

const router = express.Router();

router.post("/", authenticateUser, chatWithDocuments);

export default router;
