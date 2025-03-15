import { Router } from "express";
import { createReview, getAllReviews } from "../controllers/reviewController.js";
import { protectRoute, restrictTo } from "../controllers/authController.js";

const router = Router();

router
  .route("/")
  .get(getAllReviews)
  .post(protectRoute, restrictTo("user"), createReview);

export default router;
