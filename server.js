// * Read the config file
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// * Uncaught error handler
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");

// * Setting up mongoose
const mongoose = require("mongoose");

(async () =>
  await mongoose.connect(
    process.env.DATABASE.replace("<password>", process.env.PASSWORD)
  ))();

// * Listen server
const server = app.listen(process.env.PORT, () =>
  console.log(`Server is running on PORT ${process.env.PORT}`)
);

// * Unhandled recejtion error handler
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
