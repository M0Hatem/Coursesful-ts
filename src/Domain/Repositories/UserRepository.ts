import User from "../Entites/User";
import Course from "../Entites/Course";
import UserPayload from "../../infrastructure/Models/UserPayload";

export default interface UserRepository {
  createUser(arg: UserPayload): Promise<void>;
  findOne(arg: UserPayload): Promise<User>;
  findById(userId: string): Promise<User>;
  findByIdAndDelete(userId: string): void;
}
