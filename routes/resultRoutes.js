import express from "express";
import { authMiddleware } from '../middleware/auth.js';
import { createResult, listResults } from "../controllers/resultController.js";

const resultRouter = express.Router();

// Create a new result
resultRouter.post("/", authMiddleware, createResult);

// Get all results for the authenticated user
resultRouter.get("/", authMiddleware, listResults);

// Optional: handle unmatched routes under /api/results
resultRouter.use((req, res) => {
  res.status(404).json({ success: false, message: "Result route not found" });
});

export default resultRouter;
