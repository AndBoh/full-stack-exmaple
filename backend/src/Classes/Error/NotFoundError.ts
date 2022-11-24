import { StatusCodes } from 'http-status-codes';

import { ApplicationError, ErrorCode } from '@Classes/Error';

export class NotFoundError extends ApplicationError {
  constructor(message?: string) {
    super(
      message,
      ErrorCode.NOT_FOUND,
      StatusCodes.NOT_FOUND,
      message,
    );
  }
}
