import Course from "../Entites/Course";
import CourseDto from "../../infrastructure/Models/CourseDto";
import CoursePayload from "../../infrastructure/Models/CoursePayload";
import PopulatedCourse from "../../infrastructure/Models/PopulatedCourse";

export default interface CourseRepository {
  findOne(arg: CoursePayload): Promise<Course>;
  getCourse(courseId: string, userId: string): Promise<CourseDto>;
  populateCourse(arg: CoursePayload, path: string): Promise<PopulatedCourse>;

  getSubscribedCourses(
    userId: string,
    availability: boolean
  ): Promise<CourseDto[]>;
  findByIdAndUpdate(courseId: string, course: Course): Promise<void>;
  findByIdAndDelete(courseId: string): Promise<void>;
  save(courseId: string): Promise<Course>;

  addCourse(
    course: {
      name: string;
      maxStudents: number;
      price: number;
    },
    userId: string
  ): Promise<Course>;
}
