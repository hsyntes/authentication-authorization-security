const express = require("express");
const ErrorProvider = require("./classes/ErrorProvider");
const userRoutes = require("./routes/userRoutes");
const errorController = require("./controllers/errorController");
const helmet = require("helmet");
const hpp = require("hpp");
const xss = require("xss-clean");
const expressRateLimit = require("express-rate-limit");
const expressMongoSanitize = require("express-mongo-sanitize");

const app = express();

const limiter = expressRateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: "Too many requests.",
  standartHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: limiter }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  next();
});
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(expressMongoSanitize());
app.use("/api/v1/users", userRoutes);
app.all("*", (req, res, next) =>
  next(new ErrorProvider(404, "fail", `Unsupprted URL: ${req.originalUrl}`))
);
app.use(errorController);

module.exports = app;
