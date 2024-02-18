import Course from "../Entites/Course";

export default interface UserServices {
  getAllCourses(): Course[];
  getOneCourse(): Course;
  getSubscribedCourses(): Course[] | [];
  subscribeToCourse(): void;
  unSubscribeToCourse(): void;
  save(userId: string): void;
}
