import dns from "dns";
// Enforce IPv4 lookup order first to ensure smooth local and database routing
dns.setDefaultResultOrder("ipv4first");

import app from "./app.js";
import connectDatabase from "./config/database.js";
import dotenv from "dotenv";

// Handle Uncaught Exceptions (Must remain at the top before executing logic)
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

// Setting up config file
dotenv.config({ path: "./config/config.env" });

// Connecting to database
connectDatabase();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(
    `Server started on PORT: ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`
  );
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise rejection");

  server.close(() => {
    process.exit(1);
  });
});