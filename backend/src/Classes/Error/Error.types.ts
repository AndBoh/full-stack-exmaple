export enum ErrorCode {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT = 'CONFLICT',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  BAD_REQUEST = 'BAD_REQUEST',
}

export interface ValidationErrorData {
  message?: string;
  token: string;
  value: string;
  type: string;
}

type ErrorData = ValidationErrorData; // & ... мерж с возможными типами ошибок кроме валидации

export interface HttpErrorData {
  code: string;
  message? :string;
  errors?: ErrorData[],
}
