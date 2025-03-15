import Review from "../models/reviewModel.js";
import { catchAsync } from "../safeGuard/catchAsync.js";
// import AppError from "../safeGuard/globalErrorCenter.js";

const createReview = catchAsync(async (req, res) => {
  const reviewBody = {
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour,
    user: req?.user?._id,
  };

  const review = await Review.create(reviewBody);

  res.status(200).json({
    status: "success",
    review,
  });
});

const getAllReviews = catchAsync(async (_, res) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    results: reviews.length,
    reviews,
  });
});

export { getAllReviews, createReview };
