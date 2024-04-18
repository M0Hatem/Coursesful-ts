import Course from "../Entites/Course";
import CourseDto from "../../infrastructure/Models/CourseDto";
import NotFoundError from "../../Presentation/types/errors/NotFoundError";
import ConflictError from "../../Presentation/types/errors/ConflictError";

export default interface UserServices {
  getAllCourses(userId: string): Promise<CourseDto[]>;

  getOneCourse(courseId: string, userId: string): Promise<CourseDto>;

  getSubscribedCourses(
    userId: string,
    availability: boolean
  ): Promise<CourseDto[]>;

  // unSubscribeToCourse(): void;
  // save(userId: string): void;

  subscribeToCourse(courseId: string, userId: string): Promise<void>;
  //void | NotFoundError | ConflictError = await this.userServices.unSubscribeToCourse(courseId,userId)
  unSubscribeToCourse(courseId: string, userId: string): Promise<void>;
}
