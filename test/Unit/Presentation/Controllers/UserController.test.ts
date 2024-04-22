import "reflect-metadata";
import UserController from "../../../../src/Presentation/Controllers/UserController";
import UserServices from "../../../../src/Domain/Services/UserServices";
import NotFoundError from "../../../../src/Presentation/types/errors/NotFoundError";
import ConflictError from "../../../../src/Presentation/types/errors/ConflictError";

describe("UserController Test Suite", () => {
  let sut: UserController;

  const UserServicesMock = {
    getOneCourse: jest.fn(),
    getSubscribedCourses: jest.fn(),
    getAllCourses: jest.fn(),
    subscribeToCourse: jest.fn(),
    unSubscribeToCourse: jest.fn(),
  };

  let req;
  let res;
  const next = jest.fn();

  const courseId = "someCourseId";

  const userId = "someUserId";

  const someCourse = {
    courseId: courseId,
    courseName: "someCourseName",
    instructor: "someInstructor",
  };

  beforeAll(() => {
    sut = new UserController(UserServicesMock as any as UserServices);
  });
  beforeEach(() => {
    req = { params: { id: undefined }, userId: undefined };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("getOneCourse method", () => {
    it("should send the course with the given id in the response", async () => {
      req.params.id = courseId;
      req.userId = userId;
      UserServicesMock.getOneCourse.mockResolvedValueOnce(someCourse);

      await sut.getOneCourse(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(UserServicesMock.getOneCourse).toHaveBeenCalledWith(
        courseId,
        userId
      );
      expect(res.json).toHaveBeenCalledWith({ course: someCourse });
    });
    it("should send 404 response if the course not found", async () => {
      req.params.id = courseId;
      req.userId = userId;
      UserServicesMock.getOneCourse.mockImplementationOnce(() => {
        throw new NotFoundError("No Course Found!");
      });

      await sut.getOneCourse(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(UserServicesMock.getOneCourse).toHaveBeenCalledWith(
        courseId,
        userId
      );
      expect(res.json).toHaveBeenCalledWith({ message: "No Course Found!" });
    });
    it("should pass the unhandled errors to the global error handler via next fn", async () => {
      req.params.id = courseId;
      req.userId = userId;
      UserServicesMock.getOneCourse.mockImplementationOnce(() => {
        throw new Error("No Course Found!");
      });

      await sut.getOneCourse(req as any, res as any, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe("getSubscribedCourses method", () => {
    it("should send the subscribed courses in the response if they exist", async () => {
      req.params.id = courseId;
      req.userId = userId;
      UserServicesMock.getSubscribedCourses.mockResolvedValueOnce([
        someCourse,
        someCourse,
      ]);

      await sut.getSubscribedCourses(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(UserServicesMock.getSubscribedCourses).toHaveBeenCalledWith(
        userId,
        true
      );
      expect(res.json).toHaveBeenCalledWith({
        courses: [someCourse, someCourse],
      });
    });
    it("should send 404 response if user have no subscribedCourses", async () => {
      req.params.id = courseId;
      req.userId = userId;
      UserServicesMock.getSubscribedCourses.mockImplementationOnce(() => {
        throw new NotFoundError("No Course Found!");
      });

      await sut.getSubscribedCourses(req as any, res as any, next);

      expect(UserServicesMock.getSubscribedCourses).toHaveBeenCalledWith(
        userId,
        true
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No Course Found!" });
    });
    it("should pass the unhandled errors to the global error handler via next fn", async () => {
      req.params.id = courseId;
      req.userId = userId;
      UserServicesMock.getSubscribedCourses.mockImplementationOnce(() => {
        throw new Error("No Course Found!");
      });

      await sut.getSubscribedCourses(req as any, res as any, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe("getAllCourses method", () => {
    it("should send all courses in the response", async () => {
      req.params.id = courseId;
      req.userId = userId;
      UserServicesMock.getAllCourses.mockResolvedValueOnce([
        someCourse,
        someCourse,
      ]);

      await sut.getAllCourses(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(UserServicesMock.getAllCourses).toHaveBeenCalledWith(userId);
      expect(res.json).toHaveBeenCalledWith({
        courses: [someCourse, someCourse],
      });
    });
    it("should send 404 response if there is no courses", async () => {
      req.params.id = courseId;
      req.userId = userId;
      UserServicesMock.getAllCourses.mockImplementationOnce(() => {
        throw new NotFoundError("No Course Found!");
      });

      await sut.getAllCourses(req as any, res as any, next);

      expect(UserServicesMock.getAllCourses).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No Course Found!" });
    });
    it("should pass the unhandled errors to the global error handler via next fn", async () => {
      req.params.id = courseId;
      req.userId = userId;
      UserServicesMock.getAllCourses.mockImplementationOnce(() => {
        throw new Error("No Course Found!");
      });

      await sut.getAllCourses(req as any, res as any, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe("courseSubscribeHandler method", () => {
    it("should send success message if no errors thrown by the service", async () => {
      req.params.id = courseId;
      req.userId = userId;

      await sut.courseSubscribeHandler(req as any, res as any, next);

      expect(UserServicesMock.subscribeToCourse).toHaveBeenCalledWith(
        courseId,
        userId
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "successfully subscribed!",
      });
    });
    it("should send 'already subscribed!' if the user attempts to subscribe from a course he is subscribed to", async () => {
      req.params.id = courseId;
      req.userId = userId;
      UserServicesMock.subscribeToCourse.mockImplementationOnce(() => {
        throw new ConflictError("already subscribed!");
      });

      await sut.courseSubscribeHandler(req as any, res as any, next);

      expect(UserServicesMock.subscribeToCourse).toHaveBeenCalledWith(
        courseId,
        userId
      );
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: "already subscribed!",
      });
    });
    it("should send 404 response if the course not found to subscribe or unavailable", async () => {
      req.params.id = courseId;
      req.userId = userId;
      UserServicesMock.subscribeToCourse.mockImplementationOnce(() => {
        throw new NotFoundError("course not found to subscribe.");
      });

      await sut.courseSubscribeHandler(req as any, res as any, next);

      expect(UserServicesMock.subscribeToCourse).toHaveBeenCalledWith(
        courseId,
        userId
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "course not found to subscribe.",
      });
    });
    it("should pass the unhandled errors to the global error handler via next fn", async () => {
      req.params.id = courseId;
      req.userId = userId;
      UserServicesMock.subscribeToCourse.mockImplementationOnce(() => {
        throw new Error("course not found to subscribe.");
      });

      await sut.courseSubscribeHandler(req as any, res as any, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe("courseUnSubscribeHandler method", () => {
    it("should send success message if no errors thrown by the service", async () => {
      req.params.id = courseId;
      req.userId = userId;

      await sut.courseUnSubscribeHandler(req as any, res as any, next);

      expect(UserServicesMock.unSubscribeToCourse).toHaveBeenCalledWith(
        courseId,
        userId
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "successfully unSubscribed.",
      });
    });
    it("should send 'not Subscribed.' if the user attempts to unsubscribe from a course he is not subscribed to", async () => {
      req.params.id = courseId;
      req.userId = userId;
      UserServicesMock.unSubscribeToCourse.mockImplementationOnce(() => {
        throw new ConflictError("not Subscribed.");
      });

      await sut.courseUnSubscribeHandler(req as any, res as any, next);

      expect(UserServicesMock.unSubscribeToCourse).toHaveBeenCalledWith(
        courseId,
        userId
      );
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: "not Subscribed.",
      });
    });
    it("should send 404 response if the course not found to subscribe or unavailable", async () => {
      req.params.id = courseId;
      req.userId = userId;
      UserServicesMock.unSubscribeToCourse.mockImplementationOnce(() => {
        throw new NotFoundError("course not found to subscribe.");
      });

      await sut.courseUnSubscribeHandler(req as any, res as any, next);

      expect(UserServicesMock.unSubscribeToCourse).toHaveBeenCalledWith(
        courseId,
        userId
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "course not found to subscribe.",
      });
    });
    it("should pass the unhandled errors to the global error handler via next fn", async () => {
      req.params.id = courseId;
      req.userId = userId;
      UserServicesMock.unSubscribeToCourse.mockImplementationOnce(() => {
        throw new Error("course not found to subscribe.");
      });

      await sut.courseUnSubscribeHandler(req as any, res as any, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
