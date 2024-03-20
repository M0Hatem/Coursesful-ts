import AuthServices from "../../Domain/Services/AuthServices";
import UserRepository from "../../Domain/Repositories/UserRepository";
import UserRepositoryImpl from "../../infrastructure/Repositories/UserRepositoryImpl";
import AuthError from "../../types/errors/AuthError";
import comparingUtils from "../../util/passwordCompare";
import { signToken } from "../../util/SignToken";
import ConflictError from "../../types/errors/ConflictError";
import { getHashedPassword } from "../../util/hashPassword";
import { inject, injectable } from "tsyringe";
import UserPayload from "../../infrastructure/Models/UserPayload";

@injectable()
export default class AuthAppServices implements AuthServices {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository
  ) {}
  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({ email: email });
    if (
      !user ||
      !(await comparingUtils.passwordCompare(password, user.password))
    ) {
      throw new AuthError(
        "Authentication,failed please check your email or password"
      );
    }

    return signToken({ email: user.email, userId: user._id.toString() });
  }

  async signup(name: string, email: string, password: string): Promise<void> {
    const user = await this.userRepository.findOne({ email: email });
    if (user) {
      throw new ConflictError("E-Mail address already exists!");
    }
    try {
      const hashedPassword = await getHashedPassword(password);

      await this.userRepository.createUser(
        new UserPayload(name, email, hashedPassword)
      );
    } catch (e) {
      throw e;
    }
  }
}
