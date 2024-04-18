import Course from "../Entites/Course";
import CourseDto from "../../infrastructure/Models/CourseDto";
import CourseQueryOptions from "../QueryModels/CourseQueryOptions";
import PopulatedCourse from "../../infrastructure/Models/PopulatedCourse";
import AddCourseRequest from "../../Application/models/AddCourseRequest";
import UpdateCourseRequest from "../../Application/models/UpdateCourseRequest";
//TODO remove all infra dependencies
// you can create application model object for your queries (e.g CourseDetails)
// Remove PopulatedCourse
// Rename CourseQueryOptions to CourseQueryOptions
// Keep names consistent Find or get not both
// Later on, you can separate between query repos and commands repos
export default interface CourseRepository {
  addCourse(request: AddCourseRequest, userId: string): Promise<Course>;

  findById(courseId: string): Promise<Course | null>;

  findOne(arg: CourseQueryOptions): Promise<CourseDto>;

  getCourse(courseId: string): Promise<CourseDto>;

  populateCourse(
    arg: CourseQueryOptions,
    path: string
  ): Promise<PopulatedCourse>;

  isSubscribedToCourse(courseId: string, userId: string): Promise<boolean>;

  getSubscribedCourses(
    userId: string,
    availability: boolean
  ): Promise<CourseDto[]>;

  findByIdAndUpdate(courseId: string, course: Course): Promise<void>;

  findByIdAndDelete(courseId: string): Promise<void>;

  findOneAndUpdate(
    arg: CourseQueryOptions,
    course: { name?: string; maxStudents?: number; price?: number }
  ): Promise<void>;

  // // TODO separate
  // UpdateCourse(course: Partial<Course>): Promise<void>;

  subscribeToCourse(userId: string, courseId: string): Promise<void>;

  unSubscribeToCourse(userId: string, courseId: string): Promise<void>;

  save(course: Course): Promise<void>;

  getAllAvailableCourses(): Promise<CourseDto[]>;

  getAllUnAvailableCourses(userId: string): Promise<CourseDto[]>;
}
