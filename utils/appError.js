class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    //enable stack trace but dont include this class in it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
