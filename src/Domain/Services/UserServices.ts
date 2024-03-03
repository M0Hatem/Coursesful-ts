import Course from "../Entites/Course";
import CourseDto from "../../infrastructure/Models/CourseDto";

export default interface UserServices {
  getAllCourses(): Promise<CourseDto[]>;
  getOneCourse(courseId: string, userId: string): Promise<CourseDto>;
  getSubscribedCourses(
    userId: string,
    availability: boolean
  ): Promise<CourseDto[]>;
  // subscribeToCourse(): void;
  // unSubscribeToCourse(): void;
  // save(userId: string): void;
}
