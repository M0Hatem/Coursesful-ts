import Course from "../Entites/Course";
import CourseDto from "../../infrastructure/Models/CourseDto";
import NotFoundError from "../../types/errors/NotFoundError";
import ConflictError from "../../types/errors/ConflictError";

export default interface UserServices {
  getAllCourses(userId: string): Promise<CourseDto[] | NotFoundError>;

  getOneCourse(
    courseId: string,
    userId: string
  ): Promise<CourseDto | NotFoundError>;

  getSubscribedCourses(
    userId: string,
    availability: boolean
  ): Promise<CourseDto[] | NotFoundError>;

  // unSubscribeToCourse(): void;
  // save(userId: string): void;

  subscribeToCourse(
    courseId: string,
    userId: string
  ): Promise<void | NotFoundError | ConflictError>;
  //void | NotFoundError | ConflictError = await this.userServices.unSubscribeToCourse(courseId,userId)
  unSubscribeToCourse(
    courseId: string,
    userId: string
  ): Promise<void | NotFoundError | ConflictError>;
}
