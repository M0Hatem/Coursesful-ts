import CourseRepository from "../../Domain/Repositories/CourseRepository";
import Course from "../../Domain/Entites/Course";
import CourseMongooseModel from "../Models/CourseMongooseModel";
import CourseDto from "../Models/CourseDto";

export default class CourseRepositoryImpl implements CourseRepository {
  async getCourse(courseId: string, userId: string): Promise<CourseDto> {
    const doc = await CourseMongooseModel.find({
      _id: courseId,
      subscribedStudents: userId,
    }).populate("instructorId");
    return new CourseDto(
      doc[0].name,
      doc[0].price,
      doc[0].InstructorName,
      doc[0].available
    );
  }

  async findByIdAndDelete(courseId: string): Promise<void> {
    return CourseMongooseModel.findByIdAndDelete(courseId);
  }

  async findByIdAndUpdate(courseId: string, course: Course): Promise<void> {
    return CourseMongooseModel.findByIdAndUpdate(courseId, course);
  }

  async save(courseId: string): Promise<Course> {
    const course = await CourseMongooseModel.findById(courseId);
    return course.save();
  }
}
