const ErrorProvider = require("../classes/ErrorProvider");

module.exports = (statusCode, status, message) =>
  new ErrorProvider(statusCode, status, message);
