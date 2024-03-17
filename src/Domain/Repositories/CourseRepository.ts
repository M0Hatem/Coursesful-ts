import Course from "../Entites/Course";
import CourseDto from "../../infrastructure/Models/CourseDto";
import CoursePayload from "../../infrastructure/Models/CoursePayload";
import PopulatedCourse from "../../infrastructure/Models/PopulatedCourse";
import NotFoundError from "../../types/errors/NotFoundError";

export default interface CourseRepository {
  addCourse(
    course: {
      name: string;
      maxStudents: number;
      price: number;
    },
    userId: string
  ): Promise<Course>;
  findById(courseId: string): Promise<Course | null>;

  findOne(arg: CoursePayload): Promise<Course>;

  getCourse(courseId: string, userId: string): Promise<CourseDto | null>;

  populateCourse(arg: CoursePayload, path: string): Promise<PopulatedCourse>;
  isSubscribedToCourse(courseId: string, userId: string): Promise<boolean>;
  getSubscribedCourses(
    userId: string,
    availability: boolean
  ): Promise<CourseDto[]>;
  getAllCourses(userId: string): Promise<CourseDto[]>;

  findByIdAndUpdate(courseId: string, course: Course): Promise<void>;
  findByIdAndDelete(courseId: string): Promise<void>;

  findOneAndUpdate(
    arg: CoursePayload,
    course: { name?: string; maxStudents?: number; price?: number }
  ): Promise<void>;

  subscribeToCourse(userId: string, courseId: string): Promise<void>;
  unSubscribeToCourse(userId: string, courseId: string): Promise<void>;
  save(courseId: string): Promise<Course>;
}
