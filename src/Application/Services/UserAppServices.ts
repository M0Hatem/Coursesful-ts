import UserServices from "../../Domain/Services/UserServices";
import CourseDto from "../../infrastructure/Models/CourseDto";
import CourseRepositoryImpl from "../../infrastructure/Repositories/CourseRepositoryImpl";
import { Promise } from "mongoose";
import CourseRepository from "../../Domain/Repositories/CourseRepository";
import NotFoundError from "../../types/errors/NotFoundError";
import CourseMongooseModel from "../../infrastructure/Models/CourseMongooseModel";
import ConflictError from "../../types/errors/ConflictError";

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
  async getAllCourses(userId: string): Promise<CourseDto[] | NotFoundError> {
    const allCourses = await this.CourseRepository.getAllCourses(userId);
    if (allCourses.length === 0) {
      return new NotFoundError("Sorry no courses yet");
    }
    return allCourses;
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

  async subscribeToCourse(
    courseId: string,
    userId: string
  ): Promise<void | NotFoundError | ConflictError> {
    const course = await this.CourseRepository.findById(userId);
    if (!course) {
      return new NotFoundError("course not found to subscribe.");
    }
    const subscribed: boolean =
      await this.CourseRepository.isSubscribedToCourse(courseId, userId);

    if (subscribed) {
      return new ConflictError("already subscribed!");
    }
    return await this.CourseRepository.subscribeToCourse(userId, courseId);
  }
  async unSubscribeToCourse(
    courseId: string,
    userId: string
  ): Promise<void | NotFoundError | ConflictError> {
    const course = await this.CourseRepository.findById(userId);
    if (!course) {
      return new NotFoundError("course not found to subscribe.");
    }
    const subscribed: boolean =
      await this.CourseRepository.isSubscribedToCourse(courseId, userId);

    if (!subscribed) {
      return new ConflictError("already unSubscribed!");
    }
    return await this.CourseRepository.unSubscribeToCourse(userId, courseId);
  }
}
