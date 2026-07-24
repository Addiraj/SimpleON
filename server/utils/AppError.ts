export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(message: string, statusCode = 500, details?: any, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: any) {
    return new AppError(message, 400, details);
  }

  static unauthorized(message = 'Unauthorized access', details?: any) {
    return new AppError(message, 401, details);
  }

  static forbidden(message = 'Forbidden access', details?: any) {
    return new AppError(message, 403, details);
  }

  static notFound(message = 'Resource not found', details?: any) {
    return new AppError(message, 404, details);
  }

  static conflict(message = 'Resource conflict', details?: any) {
    return new AppError(message, 409, details);
  }

  static unprocessable(message = 'Unprocessable entity', details?: any) {
    return new AppError(message, 422, details);
  }

  static internal(message = 'Internal server error', details?: any) {
    return new AppError(message, 500, details, false);
  }
}

export default AppError;
