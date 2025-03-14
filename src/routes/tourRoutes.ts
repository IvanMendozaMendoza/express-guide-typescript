import express from "express";
import {
  createTour,
  getTour,
  getAllTours,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} from "../controllers/toursController.js";

import { protectRoute, restrictTo } from "../controllers/authController.js";

const router = express.Router();

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/tours-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/").get(protectRoute, getAllTours).post(createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(protectRoute, restrictTo("admin"), deleteTour);
export default router;
