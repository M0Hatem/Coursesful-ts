import Course from "../Entites/Course";
import CourseDto from "../../infrastructure/Models/CourseDto";

export default interface CourseRepository {
  getCourse(courseId: string, userId: string): Promise<CourseDto>;
  findByIdAndUpdate(courseId: string, course: Course): Promise<void>;
  findByIdAndDelete(courseId: string): Promise<void>;
  save(courseId: string): Promise<Course>;
}
