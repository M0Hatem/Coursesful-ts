export default class AuthError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public data?: any[]
  ) {
    super(message);
  }
}
