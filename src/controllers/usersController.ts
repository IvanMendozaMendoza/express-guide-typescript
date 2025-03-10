import { catchAsync } from "../safeGuard/catchAsync.js";
import User from "../models/userModel.js";

const createUser = catchAsync(async (req, res) => {
  const userObj = { ...req.body };
  const user = await User.create(userObj);

  res.status(200).json({
    status: "success",
    user,
  });
});

const getAllUsers = catchAsync(async (_, res) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    users,
  });
});

const getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params["id"]);

  res.status(200).json({
    status: "success",
    user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params["id"], {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    user,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.params["id"]);

  res.status(200).json({
    status: "success",
    user: null,
  });
});
export { createUser, getAllUsers, getUser, deleteUser, updateUser };
