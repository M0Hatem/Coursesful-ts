import User from "../Entites/User";
import Course from "../Entites/Course";
import UserPayload from "../../infrastructure/Models/UserPayload";

export default interface UserRepository {
  findOne(arg: UserPayload): Promise<User>;
  findById(userId: string): Promise<User>;
  findByIdAndUpdate(userId: string, course: Course): void;
  findByIdAndDelete(userId: string): void;
  save(userId: string): void;
}
