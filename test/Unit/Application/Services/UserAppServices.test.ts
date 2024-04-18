import "reflect-metadata";
import UserAppServices from "../../../../src/Application/Services/UserAppServices";
import CourseRepository from "../../../../src/Domain/Repositories/CourseRepository";
import Student from "../../../../src/Domain/Entites/Student";
import CourseDto from "../../../../src/infrastructure/Models/CourseDto";
import NotFoundError from "../../../../src/Presentation/types/errors/NotFoundError";

describe("UserAppServices test suite", () => {
  let sut: UserAppServices;

  const courseRepositoryMocK = {
    getCourse: jest.fn(),
    getAllAvailableCourses: jest.fn(),
    getAllUnAvailableCourses: jest.fn(),
    getSubscribedCourses: jest.fn(),
    findById: jest.fn(),
    isSubscribedToCourse: jest.fn(),
    subscribeToCourse: jest.fn(),
    unSubscribeToCourse: jest.fn(),
  };
  const userIdMock: string = "1234";

  let subscribedStudents: { _id: string }[] = [
    { _id: userIdMock },
    { _id: "otherUserId" },
  ];

  const validCourseId = "65e70e810d1cf296b3c3596a";

  let someCourse: CourseDto;
  let someOtherAvailableCourseCourse = new CourseDto(
    "TestCourse2",
    12,
    "TestInstructor2",
    false,
    subscribedStudents as any as Student[]
  );

  beforeAll(() => {
    sut = new UserAppServices(courseRepositoryMocK as any as CourseRepository);
  });
  beforeEach(() => {
    someCourse = new CourseDto(
      "TestCourse",
      12,
      "TestInstructor",
      true,
      subscribedStudents as any as Student[]
    );
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  it("should retrieve a course that is available to all users, regardless of login status", async () => {
    courseRepositoryMocK.getCourse.mockResolvedValueOnce(someCourse);

    const result = await sut.getOneCourse(validCourseId, userIdMock);

    expect(result).toEqual(someCourse);
  });
  it("should retrieve an unavailable course if the user subscribed to it", async () => {
    //make the course unavailable
    someCourse.available = false;
    //////////////
    courseRepositoryMocK.getCourse.mockResolvedValueOnce(someCourse);

    const result = await sut.getOneCourse(validCourseId, userIdMock);

    expect(result).toEqual(someCourse);
  });
  it("should not  retrieve an unavailable course and throw an NotFoundError for non-subscribed student", async () => {
    //make the course unavailable
    someCourse.available = false;
    //make course subscribedStudents don't contain the userid in the request
    subscribedStudents = [{ _id: "notTheUserIdFromTheRequest" }];
    someCourse.subscribedStudents = subscribedStudents as any as Student[];
    //
    courseRepositoryMocK.getCourse.mockResolvedValueOnce(someCourse);

    const t = async () => {
      await sut.getOneCourse(validCourseId, userIdMock);
    };

    await expect(t).rejects.toThrow(new NotFoundError("No Course Found!"));
  });
  it("should throw NotFoundError if no course found", async () => {
    courseRepositoryMocK.getCourse.mockImplementationOnce(null);

    const t = async () => {
      await sut.getOneCourse(validCourseId, userIdMock);
    };

    await expect(t).rejects.toThrow(new NotFoundError("No Course Found!"));
  });
  it("should return allCourses even its unavailable for subscribed student", async () => {
    let allAvailableCourses = [someCourse];
    let allUnAvailableCourses = [someOtherAvailableCourseCourse];
    let allCourses = allAvailableCourses.concat(allUnAvailableCourses);

    courseRepositoryMocK.getAllAvailableCourses.mockResolvedValueOnce(
      allAvailableCourses
    );
    courseRepositoryMocK.getAllUnAvailableCourses.mockResolvedValueOnce(
      allUnAvailableCourses
    );

    const result = await sut.getAllCourses(userIdMock);

    expect(result).toEqual(allCourses);
  });
  it("should return allCourses without unavailable ones for unSubscribed student", async () => {
    let allAvailableCourses = [someCourse];
    let allUnAvailableCourses = null;
    let allCourses = allAvailableCourses.concat(allUnAvailableCourses);

    courseRepositoryMocK.getAllAvailableCourses.mockResolvedValueOnce(
      allAvailableCourses
    );
    courseRepositoryMocK.getAllUnAvailableCourses.mockResolvedValueOnce(
      allUnAvailableCourses
    );

    const result = await sut.getAllCourses(userIdMock);

    expect(result).toEqual(allCourses);
  });
  it("should throw an NotFoundError if no courses found", async () => {
    let allAvailableCourses = [];
    let allUnAvailableCourses = [];

    courseRepositoryMocK.getAllAvailableCourses.mockResolvedValueOnce(
      allAvailableCourses
    );
    courseRepositoryMocK.getAllUnAvailableCourses.mockResolvedValueOnce(
      allUnAvailableCourses
    );

    const t = async () => {
      await sut.getAllCourses(userIdMock);
    };

    await expect(t).rejects.toThrow(new NotFoundError("Sorry no courses yet"));
  });
});
