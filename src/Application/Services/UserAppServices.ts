import UserServices from "../../Domain/Services/UserServices";
import CourseDto from "../../infrastructure/Models/CourseDto";
import CourseRepositoryImpl from "../../infrastructure/Repositories/CourseRepositoryImpl";
import { Promise } from "mongoose";
import CourseRepository from "../../Domain/Repositories/CourseRepository";
import NotFoundError from "../../types/errors/NotFoundError";

export default class UserAppServices implements UserServices {
  private CourseRepository: CourseRepository;
  constructor() {
    this.CourseRepository = new CourseRepositoryImpl();
  }
  async getOneCourse(
    courseId: string,
    userId: string
  ): Promise<CourseDto | NotFoundError> {
    const result = await this.CourseRepository.getCourse(courseId, userId);
    if (result instanceof NotFoundError) {
      return result;
    }
    return result as CourseDto;
  }
  async getAllCourses(): Promise<CourseDto[]> {
    return Promise.resolve(undefined);
  }

  async getSubscribedCourses(
    userId: string,
    availability: boolean
  ): Promise<CourseDto[] | NotFoundError> {
    const result = await this.CourseRepository.getSubscribedCourses(
      userId,
      availability
    );
    if (result.length === 0) {
      return new NotFoundError("no subscribed courses.");
    }
    return result;
  }
}
