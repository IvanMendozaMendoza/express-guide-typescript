// ################################### ENV CONFIG
import dotenv from "dotenv";
dotenv.config({ path: "./src/config.env" });
// ###################################

import express, { Request, Response } from "express";
// ---------------------------
import cors from "cors";
import morgan from "morgan";
// --------------------------------------------
import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";
import globalErrorHandler from "./safeGuard/errorHandler.js";

const app = express();

if (process.env["NODE_ENV"] === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl}`,
  });
});

app.use(globalErrorHandler);

export default app;
