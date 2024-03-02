import AuthServices from "../../Domain/Services/AuthServices";
import UserRepository from "../../Domain/Repositories/UserRepository";
import UserRepositoryImpl from "../../infrastructure/Repositories/UserRepositoryImpl";
import AuthError from "../../types/errors/AuthError";
import passwordCompare from "../../util/passwordCompare";
import { signToken } from "../../util/SignToken";

export default class AuthAppServices implements AuthServices {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepositoryImpl();
  }
  async login(email: string, password: string): Promise<string | AuthError> {
    const user = await this.userRepository.findOne({ email: email });
    if (!user || (await passwordCompare(password, user.password))) {
      return new AuthError(
        "Authentication,failed please check your email or password",
        401
      );
    }

    // @ts-ignore
    return signToken({ email: user.email, userId: user._id.toString() });
  }

  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<string | AuthError> {
    const user = await this.userRepository.findOne({ email: email });
    if (user) {
      return new AuthError(
        "Authentication,failed please check your email or password",
        409
      );
    }
    return "";
  }
}
