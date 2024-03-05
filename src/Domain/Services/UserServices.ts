import Course from "../Entites/Course";
import CourseDto from "../../infrastructure/Models/CourseDto";
import NotFoundError from "../../types/errors/NotFoundError";

export default interface UserServices {
  getAllCourses(): Promise<CourseDto[]>;

  getOneCourse(
    courseId: string,
    userId: string
  ): Promise<CourseDto | NotFoundError>;

  getSubscribedCourses(
    userId: string,
    availability: boolean
  ): Promise<CourseDto[] | NotFoundError>;
  // subscribeToCourse(): void;
  // unSubscribeToCourse(): void;
  // save(userId: string): void;
}
