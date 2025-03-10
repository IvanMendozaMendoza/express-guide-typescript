import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { catchAsync } from "../safeGuard/catchAsync.js";
import AppError from "../safeGuard/globalErrorCenter.js";
// const isAuthenticated = catchAsync(async (req, res, next) => {});

const signUp = catchAsync(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  // ############################################
  const expiresIn = process.env["JWT_EXPIRATION"] as string;
  const token = jwt.sign(
    { id: user._id },
    process.env["JWT_SECRET"] as string,
    {
      expiresIn: expiresIn ? parseInt(expiresIn) : "1h",
    }
  );
  // ############################################
  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

const logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("please provide email and password", 401));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.isValidPassword(password, user["password"]))
    return next(new AppError("Incorrect email or password", 404));

  // ############################################
  const expiresIn = process.env["JWT_EXPIRATION"] as string;
  const token = jwt.sign(
    { id: user._id },
    process.env["JWT_SECRET"] as string,
    {
      expiresIn: expiresIn ? parseInt(expiresIn) : "1h",
    }
  );
  // ############################################

  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

export { signUp, logIn };
