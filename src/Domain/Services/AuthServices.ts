import AuthError from "../../types/AuthError";

export default interface AuthServices {
  signup(name: string, email: string, password: string): string;

  login(email: string, password: string): Promise<string | AuthError>;
}
