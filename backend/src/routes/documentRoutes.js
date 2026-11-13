import express from "express"
import { authenticateUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadDocument } from "../controller/documentController.js";
const router = express.Router()

router.post(
  "/upload",
  authenticateUser,
  upload.single("file"),
  uploadDocument
);

export default router