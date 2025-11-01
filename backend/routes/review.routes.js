import express from "express";
import reviewController from "../controllers/review.controller.js";

const router = express.Router();

// Endpoint pentru review pe baza URL-ului GitHub
router.post("/review-url", reviewController);

export default router;