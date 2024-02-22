import Course from "../../Domain/Entites/Course";
import Student from "../../Domain/Entites/Student";

export default class CourseDto {
  constructor(
    public name: string,
    public price: number,
    public InstructorName: string,
    public available: boolean
  ) {}
}
