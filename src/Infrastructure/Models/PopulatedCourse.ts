import Instructor from "../../Domain/Entites/Instructor";
import Course from "../../Domain/Entites/Course";

export default interface PopulatedCourse extends Course {
  instructorId: Instructor;
}
