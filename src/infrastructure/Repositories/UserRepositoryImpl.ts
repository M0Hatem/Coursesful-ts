import User from "../../Domain/Entites/User";
import UserMongooseModel from "../Models/UserMongooseModel";
import Course from "../../Domain/Entites/Course";
import AdminRepository from "../../Domain/Repositories/AdminRepository";
import UserPayload from "../Models/UserPayload";
import { injectable } from "tsyringe";
import mongoose from "mongoose";

@injectable()
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
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid ID");
    }
    const User = await UserMongooseModel.findById(userId);
    if (User) {
      return {
        _id: User._id,
        name: User.name,
        email: User.email,
        password: User.password,
      };
    }
    return null;
  }

  async findOne(arg: UserPayload): Promise<User> {
    return UserMongooseModel.findOne(arg);
  }

  async findByIdAndDelete(userId: string): Promise<void | null> {
    return UserMongooseModel.findByIdAndDelete(userId);
  }
}
