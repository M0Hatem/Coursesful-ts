import User from "../Entites/User";
import UserPayload from "../../infrastructure/Models/UserPayload";
// TODO same comment as in the CourseRepo
export default interface UserRepository {
  createUser(arg: UserPayload): Promise<void>;
  findOne(arg: UserPayload): Promise<User>;
  findById(userId: string): Promise<User>;
  findByIdAndDelete(userId: string): void;
}
