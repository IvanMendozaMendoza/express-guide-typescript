import User from "../models/userModel.js";
import { catchAsync } from "../safeGuard/catchAsync.js";
import AppError from "../safeGuard/globalErrorCenter.js";
import { sendToken, decodeToken } from "../safeGuard/jtwHandler.js";

const signUp = catchAsync(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = sendToken(user["_id"] as string);

  res.setHeader("Authorization", `Bearer ${token}`);

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

  const token = sendToken(user["_id"] as string);

  res.setHeader("Authorization", `Bearer ${token}`);

  res.status(200).json({
    status: "success",
    message: "You have successfully logged in",
    token,
    user: {
      id: user["_id"],
      name: user["name"],
      email: user["email"],
    },
  });
});

// TODO MAKING THE CHANGED PASSWORD AT WORKS
const protectRoute = catchAsync(async (req, _, next) => {
  let token;

  // Checking if token is there
  if (
    req.headers["authorization"] &&
    req.headers["authorization"].startsWith("Bearer")
  ) {
    token = req.headers["authorization"].split(" ")[1];
  }
  if (!token)
    return next(
      new AppError(
        "Access denied, you must to be logged in, please log in to get access",
        401
      )
    );

  // Verify token
  const jwtSecret = process.env["JWT_SECRET"];
  if (!jwtSecret) {
    return next(new AppError("JWT_SECRET is not defined", 500));
  }
  const { id, iat } = await decodeToken(token);

  // checking if user still exist
  const user = await User.findById(id);
  if (!user)
    return next(
      new AppError("The user belonging this token does not exist anymore", 401)
    );

  // check user changed password after token was issued
  if (user.passwordChangedAfter(iat as number))
    return next(
      new AppError(
        "User has changed the password recently, please log in again",
        401
      )
    );

  req["user"] = user;

  next();
});
export { signUp, logIn, protectRoute };
