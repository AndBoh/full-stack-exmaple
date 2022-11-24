import { ErrorCode, HttpErrorData } from '@Classes/Error/Error.types';

export class ApplicationError extends Error {
  constructor(
    public loggerMessage: string | null = null,
    public code: ErrorCode = ErrorCode.INTERNAL_ERROR,
    public httpStatusCode: number = 500,
    public httpMessage?: string,
    public httpErrors?: any[],
  ) {
    super();
  }

  toJSON() {
    const result: HttpErrorData = {
      code: this.code,
    };

    if (this.httpMessage) {
      result.message = this.httpMessage;
    }

    if (this.httpErrors) {
      result.errors = this.httpErrors;
    }

    return result;
  }
}
