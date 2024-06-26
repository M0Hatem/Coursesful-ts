import "reflect-metadata";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import CourseRepositoryImpl from "../../../../../src/Infrastructure/Repositories/CourseRepositoryImpl";
import User from "../../../../../src/Domain/Entites/User";
import UserPayload from "../../../../../src/Infrastructure/Models/UserPayload";
import CourseQueryOptions from "../../../../../src/Domain/QueryModels/CourseQueryOptions";
import UserMongooseModel from "../../../../../src/Infrastructure/Models/UserMongooseModel";

jest.setTimeout(30000);
describe("CourseRepositoryImpl low mock test suite", () => {
  let mongoServer: MongoMemoryServer;
  let sut: CourseRepositoryImpl;
  let user: User;

  const userPayload: UserPayload = new UserPayload(
    "Test User",
    "test@example.com",
    "password123"
  );
  const CoursePayload: CourseQueryOptions = {
    name: "Test course",
    instructorId: "Test instructorId",
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    sut = new CourseRepositoryImpl();

    user = await new UserMongooseModel({
      name: userPayload.name,
      email: userPayload.email,
      password: userPayload.password,
    }).save();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  let createdCourse: any;

  it("should create new course", async () => {
    const course: any = {
      name: "Test Course",
      maxStudents: 111,
      price: 12,
    };

    await sut.addCourse(course, user._id);

    createdCourse = await sut.findOne({ name: course.name });

    expect(createdCourse).toBeDefined();
  });

  it("should get course by id", async () => {
    const course = await sut.getCourse(createdCourse._id);

    expect(course).toBeDefined();
    expect(course.name).toEqual(createdCourse.name);
    expect(course.price).toEqual(createdCourse.price);
  });

  it("should not get course for invalid id", async () => {
    const course = await sut.getCourse("wrongId");

    expect(course).toBeNull();
  });

  it("should not get course for wrongID", async () => {
    const course = await sut.getCourse("65e70e810d1cf296b3c3596g");

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
    await expect(sut.findById("wrongId")).rejects.toThrow("Invalid ID");
  });

  it("should populateCourse", async () => {
    const populatedCourse = await sut.populateCourse(
      { name: createdCourse.name },
      "instructorId?"
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
  // it("should get All student subscribed course", async () => {
  //   await sut.subscribeToCourse(user._id, createdCourse._id);
  //   await sut.subscribeToCourse(user._id, createdCourse._id);
  //
  //   const result = await sut.getAllCourses(user._id);
  //
  //   // const isValidCourseDto = result.some((courseDto) => {
  //   //   return courseDto.available;
  //   // });
  //
  //   expect(result).toBeTruthy();
  //   // expect(isValidCourseDto).toBe(true);
  // });
});
