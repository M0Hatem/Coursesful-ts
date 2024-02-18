import Instructor from "./Instructor";
import Student from "./Student";

export default interface Course {
  name: string;
  maxStudent: number;
  price: number;
  available: boolean;
  subscribedStudents: Student[];
}
