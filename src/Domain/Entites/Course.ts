import Instructor from "./Instructor";
import Student from "./Student";

export default interface Course {
  name: string;
  price: number;
  maxStudent: number;
  InstructorName: string;
  subscribedStudents: Student[];
  available: boolean;
}
