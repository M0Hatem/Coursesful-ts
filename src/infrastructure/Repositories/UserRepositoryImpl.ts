import User from "../../Domain/Entites/User";
import UserMongooseModel from "../Models/UserMongooseModel";
import Course from "../../Domain/Entites/Course";
import AdminRepository from "../../Domain/Repositories/AdminRepository";
import UserPayload from "../Models/UserPayload";

export default class UserRepositoryImpl implements AdminRepository {
  async createUser(arg: UserPayload): Promise<void> {
    const newUser = new UserMongooseModel({
      name: arg.name,
      email: arg.email,
      password: arg.password,
    });
    await newUser.save();
    return;
  }

  async findById(userId: string): Promise<User> {
    const User = await UserMongooseModel.findById(userId);
    return {
      _id: User._id,
      name: User.name,
      email: User.email,
      password: User.password,
    };
  }

  async findOne(arg: UserPayload): Promise<User> {
    const user = await UserMongooseModel.findOne(arg);
    console.log(user + "from userRepoImpl");
    return user;
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
  addCourse(course: Course): User {
    return;
  }
  deleteCourse(courseId: string) {}
  updateCourse(course: Course) {}
}
