class ErrorProvider extends Error {
  constructor(statusCode, status, message) {
    super(message);

    this.statusCode = statusCode;
    this.status = status;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorProvider;
