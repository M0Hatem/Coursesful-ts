import Instructor from "./Instructor";
import Student from "./Student";

export default interface Course {
  _id: string;
  name: string;
  price: number;
  maxStudents: number;
  InstructorName: string;
  instructorId?: string | Instructor;
  subscribedStudents: Student[];
  available: boolean;
}
