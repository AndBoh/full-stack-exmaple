import { NextFunction, Request, Response } from 'express';

import { ApplicationError } from '@Classes/Error/ApplicationError';

const handleErrorMiddleware = (
  err: ApplicationError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => res
  .status(err.httpStatusCode)
  .json(err);

export { handleErrorMiddleware };
