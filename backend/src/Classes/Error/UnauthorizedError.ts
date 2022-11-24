import { StatusCodes } from 'http-status-codes';

import { ApplicationError, ErrorCode } from '@Classes/Error';

export class UnauthorizedError extends ApplicationError {
  constructor(message?: string) {
    super(
      message,
      ErrorCode.UNAUTHORIZED,
      StatusCodes.UNAUTHORIZED,
      message,
    );
  }
}
