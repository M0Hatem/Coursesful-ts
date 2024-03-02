export default class ConflictError extends Error {
  constructor(
    message: string,
    public statusCode: number = 409,
    public data?: any[]
  ) {
    super(message);
  }
}
