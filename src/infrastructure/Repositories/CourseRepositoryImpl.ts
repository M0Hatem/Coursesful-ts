import CourseRepository from "../../Domain/Repositories/CourseRepository";
import Course from "../../Domain/Entites/Course";
import CourseMongooseModel from "../Models/CourseMongooseModel";
import CourseDto from "../Models/CourseDto";
import UserMongooseModel from "../Models/UserMongooseModel";

export default class CourseRepositoryImpl implements CourseRepository {
  async getCourse(courseId: string, userId: string): Promise<CourseDto> {
    console.log("working");
    const User = await UserMongooseModel.findById("65c1e761d97612a9c6a2cdc7");

    const doc = await CourseMongooseModel.find({
      _id: courseId,
      //TODO get  subscribedStudents: userId back
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
