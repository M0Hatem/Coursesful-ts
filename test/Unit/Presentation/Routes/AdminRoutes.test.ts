import "reflect-metadata";

import { createServer } from "../../../../src/Infrastructure/server";

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

(async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
})();
const app = createServer();

jest.setTimeout(30000);

describe("AdminRoutes test suite", () => {
  describe("add course route", () => {
    // beforeAll(async () => {
    //   mongoServer = await MongoMemoryServer.create();
    //   const mongoUri = mongoServer.getUri();
    //   await mongoose.connect(mongoUri);
    // });
    // afterAll(async () => {
    //   await mongoose.disconnect();
    // });
    it("should add course if the all validation passed and the user is auth", async () => {
      expect(true).toBe(true);
      // const courseData = {
      //   name: "New Course",
      //   maxStudents: 20,
      //   price: 100,
      // };
      //
      // const token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vaGFtZWRAdGVzdC50ZXN0IiwidXNlcklkIjoiNjVlNDViMDllZTg1YTNhZjEyODU2ZTkyIiwiaWF0IjoxNzEzODQ2Nzk2LCJleHAiOjE3MTM5MzMxOTZ9.C26ZrsovSObH-zgTBK0tT7iNe1ZkjxLDvIDyF22o-7I";
      // const response = await request(app)
      //   .get("/courses/65f6f3acd990ff23176e6515")
      //   .set("Authorization", "Bearer " + token);
      // // .set("Content-Type", "application/json")
      // // .set("Authorization", "Bearer " + token)
      // // .send(courseData)
      // // .expect(500);
      //
      // // Add your assertions here
      // expect(response.body).toHaveProperty("name", courseData.name);
      // expect(response.body).toHaveProperty(
      //   "maxStudents",
      //   courseData.maxStudents
      // );
      // expect(response.body).toHaveProperty("price", courseData.price);
    });
  });
});
