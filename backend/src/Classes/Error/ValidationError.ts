import { ValidationError as SequelizeValidationError } from 'sequelize';
import { StatusCodes } from 'http-status-codes';

import { ApplicationError, ErrorCode } from '@Classes/Error';
import { ValidationErrorData } from '@Classes/Error/Error.types';
import { ValidationErrorItem } from '@Classes/Error/ValidationErrorItem';

export class ValidationError extends ApplicationError {
  constructor(sequelizeValidationError: SequelizeValidationError, message?: string);
  constructor(errors: any[], message?: string);
  constructor(errorsOrValidationError: any[] | SequelizeValidationError, message?: string) {
    const isDBValidationError = errorsOrValidationError instanceof SequelizeValidationError;

    const mappedErrors: ValidationErrorData[] = isDBValidationError
      ? errorsOrValidationError
        .errors
        .map((error) => new ValidationErrorItem(
          error.value,
          error.path,
          error.validatorKey,
        ))
      : errorsOrValidationError;

    super(
      message,
      ErrorCode.VALIDATION_ERROR,
      StatusCodes.BAD_REQUEST,
      message,
      mappedErrors,
    );
  }
}
