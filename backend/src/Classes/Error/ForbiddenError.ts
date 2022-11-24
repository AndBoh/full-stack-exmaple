import { StatusCodes } from 'http-status-codes';

import { ApplicationError, ErrorCode } from '@Classes/Error';

export class ForbiddenError extends ApplicationError {
  constructor(message?: string, loggerMessage?: string) {
    super(
      loggerMessage ?? message,
      ErrorCode.FORBIDDEN,
      StatusCodes.FORBIDDEN,
      message,
    );
  }
}
