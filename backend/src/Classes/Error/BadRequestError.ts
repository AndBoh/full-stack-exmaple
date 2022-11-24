import { StatusCodes } from 'http-status-codes';

import { ApplicationError, ErrorCode } from '@Classes/Error';

export class BadRequestError extends ApplicationError {
  constructor(message?: string, errors?: any[]) {
    super(
      message,
      ErrorCode.BAD_REQUEST,
      StatusCodes.BAD_REQUEST,
      message,
      errors,
    );
  }
}
