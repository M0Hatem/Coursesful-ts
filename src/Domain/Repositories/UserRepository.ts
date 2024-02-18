import User from "../Entites/User";
import Course from "../Entites/Course";

export default interface UserRepository {
  findById(userId: string): Promise<User>;
  findByIdAndUpdate(userId: string, course: Course): void;
  findByIdAndDelete(userId: string): void;
  save(userId: string): void;
}
