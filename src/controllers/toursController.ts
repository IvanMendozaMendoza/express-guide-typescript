import Tour from "../models/tourModel.js";
import TourFeatures from "../utils/toursQueryFeatures.js";
import { catchAsync, ControllerFunction } from "../safeGuard/catchAsync.js";
import AppError from "../safeGuard/globalErrorCenter.js";

const aliasTopTours: ControllerFunction = async (req, _, next) => {
  req.query["limit"] = "5";
  req.query["sort"] = "-ratingsAverage,price";
  req.query["fields"] = "name,price,ratingsAverage,summary,difficulty";

  next();
};

const createTour = catchAsync(async (req, res) => {
  const tour = await Tour.create(req?.body);
  res.status(200).json({
    status: "success",
    tour,
  });
});

const getAllTours = catchAsync(async (req, res) => {
  const query = new TourFeatures(Tour.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();
  const tours = await query.query;

  res.status(200).json({
    sttus: "success",
    results: tours.length,
    tours,
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params["id"]).populate("guides");

  if (!tour) return next(new AppError("Invalid ID Tour", 404));

  res.status(200).json({
    status: "success",
    tour,
  });
});

const updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params["id"], req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    tour,
  });
});

const deleteTour = catchAsync(async (req, res) => {
  await Tour.findByIdAndDelete(req.params["id"]);

  res.status(200).json({
    status: "success",
    data: null,
  });
});

const getTourStats = catchAsync(async (_, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: "$difficulty",
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRatings: { $avg: "$ratingsAverage" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        avgPrice: { $avg: "$price" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    stats,
  });
});

const getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params?.["year"];

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTours: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTours: -1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: plan.length,
    data: plan,
  });
});

export {
  createTour,
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
