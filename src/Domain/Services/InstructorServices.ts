import Course from "../Entites/Course";

export default interface InstructorServices {
  addCourse(course: Course): void;
  updateCourse(course: Course): void;
  deleteCourse(courseId: string): void;
}
