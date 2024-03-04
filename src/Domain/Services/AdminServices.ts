import Course from "../Entites/Course";
import ConflictError from "../../types/errors/ConflictError";
import NotFoundError from "../../types/errors/NotFoundError";
import AuthError from "../../types/errors/AuthError";

export default interface AdminServices {
  addCourse(
    course: { name: string; maxStudents: number; price: number },
    userId: string
  ): Promise<ConflictError | Course>;

  updateCourse(
    courseId: string,
    course: { name?: string; maxStudents?: number; price?: number },
    userId: string
  ): Promise<void | AuthError | NotFoundError>;
  deleteCourse(courseId: string): Promise<void | NotFoundError | AuthError>;
}
