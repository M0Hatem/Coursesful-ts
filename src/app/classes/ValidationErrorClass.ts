export class ValidationError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public data?: any[]
  ) {
    super(message);
  }
}
