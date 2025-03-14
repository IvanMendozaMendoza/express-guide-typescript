import { Request, Response, NextFunction } from "express";
import AppError from "./globalErrorCenter.js";
import { UserSchema } from "../models/userModel.js";

interface IRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role:string
  } | UserSchema;
}
export interface ControllerFunction {
  (req: IRequest, res: Response, next: NextFunction): Promise<void>;
}

export const catchAsync = (fn: ControllerFunction) => {
  return (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch((err: AppError) => next(err));
};
