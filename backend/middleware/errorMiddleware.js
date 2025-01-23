import CustomError from '../utils/CustomError.js';
import logger from '../config/logger.js';

const errorMiddleware = (err, req, res, next) => {
  let message = err.message || 'Server Error';
  let statusCode = err.statusCode || 500;

  if (err instanceof CustomError) {
    // Custom error (e.g., validation, missing resource)
    statusCode = err.statusCode;
    message = err.message;
  } else {
    // Unknown error (e.g., syntax errors, etc.)
    logger.error(`[${statusCode}] ${message}: ${err.stack}`);
  }

  res.status(statusCode).json({ success: false, message });
};

export default errorMiddleware;
