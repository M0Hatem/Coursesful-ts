import CourseRepository from "../../Domain/Repositories/CourseRepository";
import Course from "../../Domain/Entites/Course";
import CourseMongooseModel from "../Models/CourseMongooseModel";

class CourseRepositoryImpl implements CourseRepository {
  async findById(courseId: string): Promise<Course> {
    return CourseMongooseModel.findById(courseId) as any;
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
