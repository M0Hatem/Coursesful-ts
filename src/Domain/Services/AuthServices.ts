import AuthError from "../../Presentation/types/errors/AuthError";
import ConflictError from "../../Presentation/types/errors/ConflictError";

export default interface AuthServices {
  signup(name: string, email: string, password: string): Promise<void>;

  login(email: string, password: string): Promise<string>;
}
