import { Request, Response, NextFunction, RequestHandler } from 'express';

export interface ApiResponseOptions<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
    details?: any;
  };
  meta?: Record<string, any>;
}

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200,
  meta?: Record<string, any>
): Response {
  const payload: ApiResponseOptions<T> = {
    success: true,
    ...(message && { message }),
    ...(data !== undefined && { data }),
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message = 'An unexpected error occurred',
  statusCode = 500,
  details: any = null
): Response {
  const payload: ApiResponseOptions = {
    success: false,
    error: {
      message,
      statusCode,
      ...(details && { details }),
    },
  };
  return res.status(statusCode).json(payload);
}

export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
