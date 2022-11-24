// Соответствует src/Classes/Error/Error.types.ts на бэке,
// при линкинге проектов можно импортировать напрямую.
export interface ValidationErrorData {
  message?: string;
  token: string;
  value: string;
  type: string;
}

type ErrorData = ValidationErrorData; // & ... мерж с возможными типами ошибок кроме валидации

export interface ApiErrorData {
  code: string;
  message? :string;
  errors?: ErrorData[],
}
