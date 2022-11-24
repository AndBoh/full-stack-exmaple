import { StatusCodes } from 'http-status-codes';

import { ApplicationError, ErrorCode } from '@Classes/Error';

export class ConflictError extends ApplicationError {
  constructor(message?: string) {
    super(
      message,
      ErrorCode.CONFLICT,
      StatusCodes.CONFLICT,
      message,
    );
  }
}
