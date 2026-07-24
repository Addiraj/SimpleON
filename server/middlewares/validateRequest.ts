import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType, ZodObject } from 'zod';

export interface RequestValidationSchemas {
  body?: ZodType<any>;
  query?: ZodType<any>;
  params?: ZodType<any>;
}

export const validateRequest = (schemas: RequestValidationSchemas | ZodType<any>) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if ('parseAsync' in schemas && typeof schemas.parseAsync === 'function') {
        req.body = await schemas.parseAsync(req.body);
      } else {
        const validationObj = schemas as RequestValidationSchemas;
        if (validationObj.body) {
          req.body = await validationObj.body.parseAsync(req.body);
        }
        if (validationObj.query) {
          req.query = await validationObj.query.parseAsync(req.query);
        }
        if (validationObj.params) {
          req.params = await validationObj.params.parseAsync(req.params);
        }
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(error);
      }
    }
  };
};

export default validateRequest;
