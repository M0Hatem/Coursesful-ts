export default class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401,
    public data?: any[]
  ) {
    super(message);
  }
}
