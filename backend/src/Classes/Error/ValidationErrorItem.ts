export class ValidationErrorItem {
  constructor(
    public value: any,
    public token: string | null = null,
    public type: string | null = null,
  ) {
  }
}
