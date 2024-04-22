import User from "../../Domain/Entites/User";
import UserMongooseModel from "../Models/UserMongooseModel";
import UserPayload from "../Models/UserPayload";
import { injectable } from "tsyringe";
import mongoose from "mongoose";
import UserRepository from "../../Domain/Repositories/UserRepository";

@injectable()
export default class UserRepositoryImpl implements UserRepository {
  async createUser(arg: UserPayload): Promise<void> {
    if (!(arg instanceof UserPayload)) {
      throw Error("Invalid payLoad");
    }
    const newUser = new UserMongooseModel({
      name: arg.name,
      email: arg.email,
      password: arg.password,
    });
    await newUser.save();
    return;
  }

  async findById(userId: string): Promise<User> {
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      userId.toString().trim() == ""
    ) {
      throw new Error("Invalid ID");
    }
    const User = await this.findDocumentById(userId);
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

  async findDocumentById(userId: string) {
    return UserMongooseModel.findById(userId);
  }

  async findOne(arg: UserPayload): Promise<User> {
    return UserMongooseModel.findOne(arg);
  }

  async findByIdAndDelete(userId: string): Promise<void | null> {
    return UserMongooseModel.findByIdAndDelete(userId);
  }
}
