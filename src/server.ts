import app from "./app.js";
import mongoose from "mongoose";
import {
  uncaughtExeptionHandler,
  uncaughtRejectionHandler,
} from "./safeGuard/uncaughtHandler.js";

// Handle uncaught exceptions
process.on("uncaughtException", uncaughtExeptionHandler);

const PORT = process.env["PORT"] || 3000;
const DB: string = process.env["DB_URL"]?.replace(
  "<db_password>",
  process.env["DB_PASSWORD"] as string
) as string;

try {
  await mongoose.connect(DB);
  console.log("successfully connected");
} catch (err) {
  console.log(err);
}

const server = app.listen(PORT, () => console.log(`listening on port ${PORT}`));
process.on("unhandledRejection", (reason) =>
  uncaughtRejectionHandler(reason, server)
);

// TODO REFRESHE I CREATED THIS CONNECTION AND TESTED THE AWS RDS DB

