import "reflect-metadata";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import CourseRepositoryImpl from "../../../../src/infrastructure/Repositories/CourseRepositoryImpl";
import User from "../../../../src/Domain/Entites/User";
import UserRepositoryImpl from "../../../../src/infrastructure/Repositories/UserRepositoryImpl";
import UserPayload from "../../../../src/infrastructure/Models/UserPayload";
import Course from "../../../../src/Domain/Entites/Course";
import CourseDto from "../../../../src/infrastructure/Models/CourseDto";
import CoursePayload from "../../../../src/infrastructure/Models/CoursePayload";
import UserMongooseModel from "../../../../src/infrastructure/Models/UserMongooseModel";

jest.mock("../../../../src/infrastructure/Models/UserMongooseModel");
jest.mock("../../../../src/infrastructure/Models/CourseMongooseModel");

jest.setTimeout(30000);
describe("CourseRepositoryImpl test suite", () => {
  let mongoServer: MongoMemoryServer;
  let sut: CourseRepositoryImpl;
  let user: User;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    sut = new CourseRepositoryImpl();
    await new UserRepositoryImpl().createUser(userPayload);
    user = await new UserRepositoryImpl().findOne({ name: userPayload.name });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  const userPayload: UserPayload = {
    name: "Test User",
    email: "test@example.com",
    password: "userPassword",
  };

  const CoursePayload: CoursePayload = {
    name: "Test course",
    instructorId: "Test instructorId",
  };

  let createdCourse: Course;

  it("should create new course", async () => {
    const course = {
      name: "Test Course",
      maxStudents: 111,
      price: 12,
    };

    await sut.addCourse(course, user._id);

    createdCourse = await sut.findOne({ name: course.name });
    expect(createdCourse).toBeDefined();
  });

  it("should get course by id", async () => {
    const course = await sut.getCourse(createdCourse._id, user._id);

    expect(course).toBeDefined();
    expect(course.name).toEqual(createdCourse.name);
    expect(course.price).toEqual(createdCourse.price);
  });

  it("should not get course for invalid id", async () => {
    const course = await sut.getCourse("wrongId", user._id);

    expect(course).toBeNull();
  });

  it("should not get course for wrongID", async () => {
    const course = await sut.getCourse("65e70e810d1cf296b3c3596g", user._id);

    expect(course).toBeNull();
  });

  it("should find course with valid argument", async () => {
    const foundedCourse = await sut.findOne({ name: CoursePayload.name });

    expect(foundedCourse).toBeDefined();
  });

  it("should find Course by Id", async () => {
    const foundedCourse = await sut.findById(createdCourse._id);

    expect(foundedCourse._id.toString()).toBe(createdCourse._id.toString());
    expect(foundedCourse.name).toBe(createdCourse.name);
  });

  it("should not find Course if invalid ID passed", async () => {
    await expect(sut.findById("wrongId")).rejects.toThrowError("Invalid ID");
  });

  it("should populateCourse", async () => {
    const populatedCourse = await sut.populateCourse(
      { name: createdCourse.name },
      "instructorId"
    );
    expect(populatedCourse.instructorId.name).toBeDefined();
  });

  it("should subscribe To provided course", async () => {
    await sut.subscribeToCourse(user._id, createdCourse._id);
    const subscribedUser = await UserMongooseModel.findById(user._id);

    const populatedCourse = await sut.populateCourse(
      {
        _id: createdCourse._id,
      },
      "subscribedStudents"
    );

    const isSubscribed = populatedCourse.subscribedStudents.some(
      (student) => student._id.toString() === subscribedUser._id.toString()
    );

    expect(isSubscribed).toBe(true);
  });

  it("should (isSubscribedToCourse) return ture if student subscribed to the course", async () => {
    const result = await sut.isSubscribedToCourse(createdCourse._id, user._id);

    expect(result).toBe(true);
  });
  it("should unSubscribe To provided course", async () => {
    await sut.unSubscribeToCourse(user._id, createdCourse._id);
    const unSubscribedUser = await UserMongooseModel.findById(user._id);

    const populatedCourse = await sut.populateCourse(
      {
        _id: createdCourse._id,
      },
      "subscribedStudents"
    );

    const isSubscribed = populatedCourse.subscribedStudents.some(
      (student) => student._id.toString() === unSubscribedUser._id.toString()
    );

    expect(isSubscribed).toBe(false);
  });
  it("should (isSubscribedToCourse) return false if  student not subscribed to the course", async () => {
    const result = await sut.isSubscribedToCourse(createdCourse._id, user._id);

    expect(result).toBe(false);
  });
  it("should get All student subscribed course", async () => {
    await sut.subscribeToCourse(user._id, createdCourse._id);
    await sut.subscribeToCourse(user._id, createdCourse._id);

    const result = await sut.isSubscribedToCourse(createdCourse._id, user._id);

    expect(result).toBe(false);
  });
});
