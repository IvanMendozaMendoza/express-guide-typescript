import { Server } from "http";

export const uncaughtExeptionHandler = (reason: string) => {
  console.log(`UNCAUGHT EXEPTION!! shutting down...`);
  console.log(`Reason: ${reason}`);
  process.exit(1);
};

export const uncaughtRejectionHandler = (reason: unknown, server: Server) => {
  console.log(`UNCAUGHT REJECTION!! shutting down...`);
  console.log(`Reason: ${reason}`);

  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};
