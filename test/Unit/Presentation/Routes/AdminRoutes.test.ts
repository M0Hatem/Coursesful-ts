import "reflect-metadata";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { createServer } from "../../../../src/Infrastructure/server";

jest.setTimeout(30000);
describe("CourseRepositoryImpl low mock test suite", () => {
  let mongoServer: MongoMemoryServer;

  //
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vaGFtZWRAdGVzdC50ZXN0IiwidXNlcklkIjoiNjVlNDViMDllZTg1YTNhZjEyODU2ZTkyIiwiaWF0IjoxNzEzODQ2Nzk2LCJleHAiOjE3MTM5MzMxOTZ9.C26ZrsovSObH-zgTBK0tT7iNe1ZkjxLDvIDyF22o-7I";
  // const courseId = "65f6f3acd990ff23176e6515";
  // const someCourse = {
  //   name: "abo-zeid",
  //   maxStudents: 212,
  //   price: 9999,
  // };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    const app = createServer();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  it("should ", () => {
    expect(true).toBe(true);
  });

  // it("should get the course", async () => {
  //   request(app)
  //     .post("/courses/add")
  //     .set("Authorization", "Bearer " + token)
  //     .set("Content-Type", "application/json")
  //     .send(someCourse);
  // });
});
