import User from "../models/userModel.js";
import { catchAsync } from "../safeGuard/catchAsync.js";

// const isAuthenticated = catchAsync(async (req, res, next) => {});

const signUp = catchAsync(async (req, res) => {
  const userObj = { ...req.body };
  const user = await User.create(userObj);

  res.status(200).json({
    status: "success",
    user,
  });
});

export { signUp };
