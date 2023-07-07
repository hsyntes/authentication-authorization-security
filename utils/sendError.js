const ErrorProvider = require("../classes/ErrorProvider");

exports.sendError = (statusCode, status, message) =>
  new ErrorProvider(statusCode, status, message);
