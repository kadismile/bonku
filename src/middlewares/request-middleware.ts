import { RequestHandler, Request, Response, NextFunction } from 'express';
import Joi from '@hapi/joi';
import BadRequest from '../errors/bad-request';
import logger from '../logger';

const getMessageFromJoiError = (error: Joi.ValidationError): string | undefined => {
  if (!error.details && error.message) {
    return error.message;
  }
  return error.details && error.details.length > 0 && error.details[0].message
    ? `PATH: [${error.details[0].path}] ;; MESSAGE: ${error.details[0].message}`
    : undefined;
};

interface HandlerOptions {
  validation?: {
    body?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
  };
}

export const requestMiddleware =
  (handler: RequestHandler, options?: HandlerOptions): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction): Promise<null | void> => {
    if (options?.validation?.body) {
      const { error } = options?.validation?.body.validate(req.body);
      if (error != null) {
        next(new BadRequest(getMessageFromJoiError(error)));
        return;
      }
    }

    if (options?.validation?.query) {
      const { error } = options?.validation?.query.validate(req.query);
      if (error != null) {
        next(new BadRequest(getMessageFromJoiError(error)));
        return;
      }
    }

    try {
      await handler(req, res, next);
      next();
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        logger.log({
          level: 'error',
          message: 'Error in request handler',
          error: err,
        });
      }
      next(err);
    }
  };

export default requestMiddleware;
