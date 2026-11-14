import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { searchDocuments } from "../controller/searchController.js";

const router = express.Router();

router.post("/", authenticateUser, searchDocuments);

export default router;