import { Request, Response, NextFunction } from "express";
import AppError from "./globalErrorCenter.js";

export interface ControllerFunction {
    (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const catchAsync = (fn: ControllerFunction) => {
    return (req: Request, res: Response, next: NextFunction) =>
        fn(req, res, next).catch((err: AppError) => next(err));
};
