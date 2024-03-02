import AuthServices from "../../Domain/Services/AuthServices";
import UserRepository from "../../Domain/Repositories/UserRepository";
import UserRepositoryImpl from "../../infrastructure/Repositories/UserRepositoryImpl";
import AuthError from "../../types/errors/AuthError";
import passwordCompare from "../../util/passwordCompare";
import { signToken } from "../../util/SignToken";
import ConflictError from "../../types/errors/ConflictError";
import { getHashedPassword } from "../../util/hashPassword";

export default class AuthAppServices implements AuthServices {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepositoryImpl();
  }
  async login(email: string, password: string): Promise<string | AuthError> {
    const user = await this.userRepository.findOne({ email: email });
    if (!user || !(await passwordCompare(password, user.password))) {
      throw new AuthError(
        "Authentication,failed please check your email or password"
      );
    }

    // @ts-ignore
    return signToken({ email: user.email, userId: user._id.toString() });
  }

  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<void | ConflictError> {
    const user = await this.userRepository.findOne({ email: email });
    if (user) {
      throw new ConflictError("E-Mail address already exists!");
    }
    const hashedPassword = await getHashedPassword(password);
    await this.userRepository.createUser({
      name: name,
      email: email,
      password: hashedPassword,
    });
    return;
  }
}
