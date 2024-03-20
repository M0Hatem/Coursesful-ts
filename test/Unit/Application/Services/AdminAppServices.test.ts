import "reflect-metadata";
import { AdminAppServices } from "../../../../src/Application/Services/AdminAppServices";
import CourseRepository from "../../../../src/Domain/Repositories/CourseRepository";
import NotFoundError from "../../../../src/types/errors/NotFoundError";

describe("AdminAppServices test suite", () => {
  let sut: AdminAppServices;

  const courseRepositoryMock = {
    findOne: jest.fn(),
    populateCourse: jest.fn(),
    addCourse: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };
  const someUserId = "12345";
  const someCourse = {
    _id: "someId",
    name: "Test Course",
    maxStudents: 10,
    price: 99,
    instructorId: someUserId,
  };
  beforeEach(() => {
    sut = new AdminAppServices(courseRepositoryMock as any as CourseRepository);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should create course for valid arguments", async () => {
    courseRepositoryMock.findOne.mockResolvedValueOnce(null);

    await sut.addCourse(someCourse, someUserId);

    expect(courseRepositoryMock.addCourse).toHaveBeenCalledTimes(1);
    expect(courseRepositoryMock.addCourse).toHaveBeenCalledWith(
      someCourse,
      someUserId
    );
  });
  it("should create course if there is a course with the same name exist but with the different user", async () => {
    courseRepositoryMock.findOne.mockResolvedValueOnce(someCourse);
    courseRepositoryMock.populateCourse.mockResolvedValueOnce({
      ...someCourse,
      instructorId: { _id: "different UserId" },
    });

    await sut.addCourse(someCourse, someUserId);

    expect(courseRepositoryMock.findOne).toHaveBeenCalledWith({
      name: someCourse.name,
    });
    expect(courseRepositoryMock.populateCourse).toHaveBeenCalledWith(
      { name: someCourse.name },
      "instructorId"
    );
    expect(courseRepositoryMock.addCourse).toHaveBeenCalledWith(
      someCourse,
      someUserId
    );
  });

  it("should not create course if there is a course with the same name exist and with the same user", async () => {
    courseRepositoryMock.findOne.mockResolvedValueOnce(someCourse);
    courseRepositoryMock.populateCourse.mockResolvedValueOnce({
      ...someCourse,
      instructorId: { _id: someUserId },
    });

    const t = async () => {
      await sut.addCourse(someCourse, someUserId);
    };

    await expect(t).rejects.toThrow("there is a course with the same name");
    expect(courseRepositoryMock.findOne).toHaveBeenCalledWith({
      name: someCourse.name,
    });
    expect(courseRepositoryMock.populateCourse).toHaveBeenCalledWith(
      { name: someCourse.name },
      "instructorId"
    );
    expect(courseRepositoryMock.addCourse).toHaveBeenCalledTimes(0);
  });

  it("should delete the course when user is its owner", async () => {
    courseRepositoryMock.findById.mockResolvedValueOnce(someCourse);
    courseRepositoryMock.populateCourse.mockResolvedValueOnce({
      ...someCourse,
      instructorId: someUserId,
    });

    await sut.deleteCourse(someCourse._id, someUserId);

    expect(courseRepositoryMock.findByIdAndDelete).toHaveBeenCalledWith(
      someCourse._id
    );
  });
  it("should prevent a user who is not the course owner from deleting the course", async () => {
    courseRepositoryMock.findById.mockResolvedValueOnce({
      ...someCourse,
      instructorId: "someOtherId",
    });

    const t = async () => {
      await sut.deleteCourse(someCourse._id, someUserId);
    };

    await expect(t).rejects.toThrow(
      "You Don't have access to delete this course"
    );
    expect(courseRepositoryMock.findByIdAndDelete).toHaveBeenCalledTimes(0);
  });
  it("should throw an error when attempting to delete a course that does not exist", async () => {
    courseRepositoryMock.findById.mockResolvedValueOnce(null);

    const t = async () => {
      await sut.deleteCourse(someCourse._id, someUserId);
    };

    await expect(t).rejects.toThrow("Course Not Found!");
    expect(courseRepositoryMock.findByIdAndDelete).toHaveBeenCalledTimes(0);
  });
  it("should update the course when user is its owner", async () => {
    courseRepositoryMock.findById.mockResolvedValueOnce(someCourse);
    const updatedCourse = {
      name: "NewTestName",
      maxStudents: 89,
      price: 20,
    };

    await sut.updateCourse(someCourse._id, { ...updatedCourse }, someUserId);

    expect(courseRepositoryMock.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: someCourse._id },
      updatedCourse
    );
  });
  it("should prevent a user who is not the course owner from updating the course", async () => {
    courseRepositoryMock.findById.mockResolvedValueOnce({
      someCourse,
      instructorId: "someOtherId",
    });
    const updatedCourse = {
      name: "NewTestName",
      maxStudents: 89,
      price: 20,
    };

    const t = async () => {
      await sut.updateCourse(someCourse._id, { ...updatedCourse }, someUserId);
    };

    await expect(t).rejects.toThrow(
      "You do not have the necessary permission to update this course"
    );
  });
  it("should throw an error if no course found to update", async () => {
    courseRepositoryMock.findById.mockResolvedValueOnce(null);
    const updatedCourse = {
      name: "NewTestName",
      maxStudents: 89,
      price: 20,
    };

    const t = async () => {
      await sut.updateCourse(someCourse._id, { ...updatedCourse }, someUserId);
    };

    await expect(t).rejects.toThrow(new NotFoundError("Course Not Found!"));
  });
});
