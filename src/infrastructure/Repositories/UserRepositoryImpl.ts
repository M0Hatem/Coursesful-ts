import UserRepository from "../../Domain/Repositories/UserRepository";
import User from "../../Domain/Entites/User";
import UserMongooseModel from "../Models/UserMongooseModel";
import Course from "../../Domain/Entites/Course";

class UserRepositoryImpl implements UserRepository {
  async findById(userId: string): Promise<User | null> {
    const User = await UserMongooseModel.findById(userId);
    return {
      name: User.name,
      email: User.email,
      password: User.password,
    };
  }

  async findByIdAndDelete(userId: string): Promise<void | null> {
    return UserMongooseModel.findByIdAndDelete(userId);
  }

  async findByIdAndUpdate(userId: string, course: Course): Promise<void> {
    return UserMongooseModel.findByIdAndUpdate(userId, { $set: course });
  }

  async save(userId: string): Promise<void> {
    const user = await UserMongooseModel.findById(userId);
    await user.save();
    return;
  }
}
