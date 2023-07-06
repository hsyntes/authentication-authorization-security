const ErrorProvider = require("../classes/ErrorProvider");

// * Modifying the error object according to the the name of error
const validatorError = (err) => {
  let messages = err.message.split(",");

  const message = messages
    .map((message, index) => message.split(":").at(index === 0 ? 2 : 1))
    .join("")
    .trim();

  return new ErrorProvider(403, "fail", message);
};

const uniqueError = (err) => {
  console.log(err);

  if (err.keyPattern.hasOwnProperty("username"))
    return new ErrorProvider(409, "fail", "This user is already in use.");

  return new ErrorProvider(401, "fail", err.message);
};

const jsonWebTokenError = () =>
  new ErrorProvider(404, "fail", "Authentication failed.");

const tokenExpiredError = () =>
  new ErrorProvider(401, "fail", "Authentication has expired. Log in again.");

// * Export the new error object to handle error globally
module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    if (err.name === "ValidationError") err = validatorError(err);
    if (err.code === 11000) err = uniqueError(err);
    if (err.name === "JsonWebTokenError") err = jsonWebTokenError();
    if (err.name === "TokenExpiredError") err = tokenExpiredError();
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
