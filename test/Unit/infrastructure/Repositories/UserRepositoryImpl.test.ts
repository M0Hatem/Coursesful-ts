import "reflect-metadata";
import { MongoMemoryServer } from "mongodb-memory-server";
import UserRepositoryImpl from "../../../../src/infrastructure/Repositories/UserRepositoryImpl";
import mongoose from "mongoose";
import UserPayload from "../../../../src/infrastructure/Models/UserPayload";
import User from "../../../../src/Domain/Entites/User";

jest.setTimeout(30000);
describe("UserRepositoryImpl test suite", () => {
  let mongoServer: MongoMemoryServer;
  let userRepository: UserRepositoryImpl;

  const userPayload: UserPayload = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    userRepository = new UserRepositoryImpl();
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  let user: User;
  it("should create User", async () => {
    await userRepository.createUser(userPayload);

    user = await userRepository.findOne({
      name: userPayload.name,
    });

    expect(user).toBeDefined();
    expect(user.name).toBe(userPayload.name);
    expect(user.email).toBe(userPayload.email);
  });
  it("should find User by Id", async () => {
    const foundedUser = await userRepository.findById(user._id);

    expect(foundedUser._id.toString()).toBe(user._id.toString());
    expect(foundedUser.name).toBe(user.name);
    expect(foundedUser.email).toBe(user.email);
  });
  it("should find User by any argument", async () => {
    const foundedUser = await userRepository.findOne({ name: user.name });

    expect(foundedUser._id.toString()).toBe(user._id.toString());
    expect(foundedUser.name).toBe(user.name);
    expect(foundedUser.email).toBe(user.email);
  });
  it("should delete User by Id", async () => {
    await userRepository.findByIdAndDelete(user._id);

    const foundedUser = await userRepository.findById(user._id);
    expect(foundedUser).toBeNull();
  });
});
