import UserServices from "../../Domain/Services/UserServices";
import CourseDto from "../../infrastructure/Models/CourseDto";
import CourseRepositoryImpl from "../../infrastructure/Repositories/CourseRepositoryImpl";
import { Promise } from "mongoose";
import CourseRepository from "../../Domain/Repositories/CourseRepository";

export default class UserAppServices implements UserServices {
  private CourseRepository: CourseRepository;
  constructor() {
    this.CourseRepository = new CourseRepositoryImpl();
  }
  async getOneCourse(courseId: string, userId: string): Promise<CourseDto> {
    return await this.CourseRepository.getCourse(courseId, userId);
  }
  async getAllCourses(): Promise<CourseDto[]> {
    return Promise.resolve(undefined);
  }

  async getSubscribedCourses(
    userId: string,
    availability: boolean = true
  ): Promise<CourseDto[]> {
    console.log("here");
    return await this.CourseRepository.getSubscribedCourses(
      userId,
      availability
    );
  }
}
