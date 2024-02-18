import User from "./User";
import Course from "./Course";

export default interface Student extends User {
  credit?: number;
  subscribedCourses: Course[];
}
