export default class NotFoundError extends Error {
  constructor(
    message: string,
    public statusCode: number = 404,
    public data?: any[]
  ) {
    super(message);
  }
}
