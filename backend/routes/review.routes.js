import express from "express";
import reviewController from "../controllers/review.controller.js";
import reviewPRController from "../controllers/reviewPending.controller.js";

const router = express.Router();

// Endpoint pentru review pe baza URL-ului GitHub
router.post("/review-url", reviewController);

router.post("/review-pending", reviewPRController);

export default router;