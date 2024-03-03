import Course from "../Entites/Course";
import ConflictError from "../../types/errors/ConflictError";

export default interface AdminServices {
  addCourse(
    courseRequest: {
      name: string;
      maxStudents: number;
      price: number;
    },
    userId: string
  ): Promise<ConflictError | Course>;
  updateCourse(course: Course): void;
  deleteCourse(courseId: string): void;
}
