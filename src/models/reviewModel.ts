import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1.0"],
      max: [5, "Rating must be at most 5.0"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(
  /^find/,
  async function (this: mongoose.Query<any, any>, next) {
    this.populate({
      path: "user",
      select: "name photo",
    }).populate({ path: "tour", select: "name" });

    next();
  }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
