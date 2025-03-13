import { Request, Response, NextFunction } from "express";
import { CastError } from "mongoose";
import AppError from "./globalErrorCenter.js";

// ############################################

const handleCastError = (err: CastError) => {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return new AppError(msg, 400);
};

const handleDuplicateKeysError = (err: AppError) => {
  const key = err["keyValue"]?.name;

  const msg = `Duplicate key: ${key}`;
  return new AppError(msg, 400);
};

const handleValidationError = (err: AppError) => {
  const items = err?.["errors"] ? Object.values(err["errors"]) : [];
  const msg = items
    .map(({ properties }) => properties["message"])
    .join(" | & | ");

  return new AppError(`Invalid input data: ${msg}`, 422);
};

const handleInvalidJWT = () =>
  new AppError("Invalid Token. Please log in again.", 401);

const handleExpiredJWT = () =>
  new AppError("Expired Token. Please log in again.", 401);

// ##############################################

const sendDevError = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  });
};

const sendProdError = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const globalErrorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? "error";

  if (process.env["NODE_ENV"] === "development") {
    sendDevError(err, res);
  }
  if (process.env["NODE_ENV"] === "production") {
    let error = { ...err };

    if (err["name"] === "CastError")
      error = handleCastError(error as unknown as CastError);

    if (err["code"] === 11000) error = handleDuplicateKeysError(error);

    if (err["name"] === "ValidationError") error = handleValidationError(error);

    if (err["name"] === "JsonWebTokenError") error = handleInvalidJWT();

    if (err["name"] === "TokenExpiredError") error = handleExpiredJWT();

    sendProdError(error, res);
  }
};
export default globalErrorHandler;
