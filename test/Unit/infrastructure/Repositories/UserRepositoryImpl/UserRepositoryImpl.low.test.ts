import "reflect-metadata";
import { MongoMemoryServer } from "mongodb-memory-server";
import UserRepositoryImpl from "../../../../../src/infrastructure/Repositories/UserRepositoryImpl";
import mongoose from "mongoose";
import UserPayload from "../../../../../src/infrastructure/Models/UserPayload";
import User from "../../../../../src/Domain/Entites/User";

jest.setTimeout(30000);
describe("UserRepositoryImpl low mock test suite", () => {
  let mongoServer: MongoMemoryServer;
  let sut: UserRepositoryImpl;

  const userPayload: UserPayload = new UserPayload(
    "Test User",
    "test@example.com",
    "password123"
  );

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });
  beforeEach(() => {
    sut = new UserRepositoryImpl();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  let user: User;

  it("should create User", async () => {
    await sut.createUser(userPayload);

    user = await sut.findOne({
      name: userPayload.name,
    });

    expect(user).toBeDefined();
    expect(user.name).toBe(userPayload.name);
    expect(user.email).toBe(userPayload.email);
  });
  it("should find User by Id", async () => {
    console.log(user);
    const foundedUser = await sut.findById(user._id);

    console.log(user);
    console.log(foundedUser);
    expect(foundedUser._id.toString()).toBe(user._id.toString());
    expect(foundedUser.name).toBe(user.name);
    expect(foundedUser.email).toBe(user.email);
  });

  it("should not find User if invalid id passed", async () => {
    await expect(sut.findById("wrongId")).rejects.toThrowError("Invalid ID");
  });

  it("should not find User if wrong password passed", async () => {
    const foundedUser = await sut.findById("65e45b09ee85a3af12856e92");

    expect(foundedUser).toBeNull();
  });
  it("should find User by any argument", async () => {
    const foundedUser = await sut.findOne({ name: user.name });

    expect(foundedUser._id.toString()).toBe(user._id.toString());
    expect(foundedUser.name).toBe(user.name);
    expect(foundedUser.email).toBe(user.email);
  });
  it("should delete User by Id", async () => {
    await sut.findByIdAndDelete(user._id);

    const foundedUser = await sut.findById(user._id);
    expect(foundedUser).toBeNull();
  });
});
