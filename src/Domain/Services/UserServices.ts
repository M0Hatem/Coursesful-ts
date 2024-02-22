import Course from "../Entites/Course";
import CourseDto from "../../infrastructure/Models/CourseDto";

export default interface UserServices {
  // getAllCourses(): Course[];
  getOneCourse(courseId: string, userId: string): Promise<CourseDto>;
  // getSubscribedCourses(): Course[] | [];
  // subscribeToCourse(): void;
  // unSubscribeToCourse(): void;
  // save(userId: string): void;
}
