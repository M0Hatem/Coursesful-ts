import UserServices from "../../Domain/Services/UserServices";
import CourseDto from "../../infrastructure/Models/CourseDto";
import CourseRepositoryImpl from "../../infrastructure/Repositories/CourseRepositoryImpl";

export default class UserAppServices implements UserServices {
  private CourseRepository: CourseRepositoryImpl;
  constructor() {
    this.CourseRepository = new CourseRepositoryImpl();
  }
  async getOneCourse(courseId: string, userId: string): Promise<CourseDto> {
    return await this.CourseRepository.getCourse(courseId, userId);
  }
}
