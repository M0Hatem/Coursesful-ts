import Course from "../Entites/Course";

export default interface CourseRepository {
  findById(courseId: string): Promise<Course>;
  findByIdAndUpdate(courseId: string, course: Course): Promise<void>;
  findByIdAndDelete(courseId: string): Promise<void>;
  save(courseId: string): Promise<Course>;
}
