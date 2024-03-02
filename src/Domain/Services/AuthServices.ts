import AuthError from "../../types/errors/AuthError";

export default interface AuthServices {
  signup(
    name: string,
    email: string,
    password: string
  ): Promise<string | AuthError>;

  login(email: string, password: string): Promise<string | AuthError>;
}
