import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(AppError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

export default notFoundHandler;
