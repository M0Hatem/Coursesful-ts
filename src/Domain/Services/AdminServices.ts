import Course from "../Entites/Course";

export default interface AdminServices {
  addCourse(course: Course): void;
  updateCourse(course: Course): void;
  deleteCourse(courseId: string): void;
}
