import UserServices from "../../Domain/Services/UserServices";
import CourseDto from "../../infrastructure/Models/CourseDto";
import CourseRepository from "../../Domain/Repositories/CourseRepository";
import NotFoundError from "../../Presentation/types/errors/NotFoundError";
import ConflictError from "../../Presentation/types/errors/ConflictError";
import { autoInjectable, inject, injectable } from "tsyringe";
import Student from "../../Domain/Entites/Student";

@injectable()
export default class UserAppServices implements UserServices {
  constructor(
    @inject("CourseRepository") private courseRepository: CourseRepository
  ) {}
  async getOneCourse(courseId: string, userId: string): Promise<CourseDto> {
    let course: CourseDto;

    course = await this.courseRepository.getCourse(courseId);

    if (!course) {
      throw new NotFoundError("No Course Found!");
    }

    if (!course.available) {
      //TODO change this to diff query (maybe change db design for this list later on)
      const isAvailableForStudent = course.subscribedStudents.some(
        (student: Student) => student._id.toString() === userId
      );
      if (!isAvailableForStudent) {
        throw new NotFoundError("No Course Found!");
      }
    }
    return course;
  }
  async getAllCourses(userId: string): Promise<CourseDto[]> {
    let allAvailableCourses =
      await this.courseRepository.getAllAvailableCourses();
    const allUnAvailableCourses =
      await this.courseRepository.getAllUnAvailableCourses(userId);

    const allCourses = allAvailableCourses.concat(allUnAvailableCourses);
    if (allCourses.length === 0) {
      throw new NotFoundError("Sorry no courses yet");
    }

    return allCourses;
  }

  async getSubscribedCourses(
    userId: string,
    availability: boolean
  ): Promise<CourseDto[]> {
    const result = await this.courseRepository.getSubscribedCourses(
      userId,
      availability
    );
    if (result.length === 0) {
      throw new NotFoundError("no subscribed courses.");
    }
    return result;
  }

  async subscribeToCourse(courseId: string, userId: string): Promise<void> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new NotFoundError("course not found to subscribe.");
    }
    const subscribed: boolean =
      await this.courseRepository.isSubscribedToCourse(courseId, userId);

    if (subscribed) {
      throw new ConflictError("already subscribed!");
    }
    await this.courseRepository.subscribeToCourse(userId, courseId);
  }
  async unSubscribeToCourse(
    courseId: string,
    userId: string
  ): Promise<void | NotFoundError | ConflictError> {
    const course = await this.courseRepository.findById(userId);
    if (!course) {
      return new NotFoundError("course not found to subscribe.");
    }
    const subscribed: boolean =
      await this.courseRepository.isSubscribedToCourse(courseId, userId);

    if (!subscribed) {
      return new ConflictError("not Subscribed.");
    }
    return await this.courseRepository.unSubscribeToCourse(userId, courseId);
  }
}
