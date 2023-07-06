const express = require("express");
const ErrorProvider = require("./classes/ErrorProvider");
const userRoutes = require("./routes/userRoutes");
const errorController = require("./controllers/errorController");
const helmet = require("helmet");
const hpp = require("hpp");
const xss = require("xss-clean");
const expressRateLimit = require("express-rate-limit");
const expressMongoSanitize = require("express-mongo-sanitize");

// * Call the Express.js
const app = express();

// * Limiting the number of fetching data per hour
const limiter = expressRateLimit({
  max: 10,
  windowsMs: 60 * 60 * 1000,
  message: "Too many requests.",
  standartHeaders: true,
  legacyHeaders: false,
});

// * Read JSON Data as JavaScript Object similiar with bodyParser
app.use(express.json({ limit: limiter }));

// * Allow to the client (Front-End) to fetch data
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  next();
});

// * Security
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(expressMongoSanitize());

// * Routes
app.use("/api/v1/users", userRoutes);

// * Error handling for unsupported URLs
app.all("*", (req, res, next) =>
  next(new ErrorProvider(404, "fail", `Unsupprted URL: ${req.originalUrl}`))
);

// * Globally error handling
app.use(errorController);

module.exports = app;
