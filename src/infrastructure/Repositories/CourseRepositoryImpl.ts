import CourseRepository from "../../Domain/Repositories/CourseRepository";
import Course from "../../Domain/Entites/Course";
import CourseMongooseModel from "../Models/CourseMongooseModel";
import CourseDto from "../Models/CourseDto";
import UserMongooseModel from "../Models/UserMongooseModel";
import CoursePayload from "../Models/CoursePayload";
import { Promise } from "mongoose";
import PopulatedCourse from "../Models/PopulatedCourse";
import course from "../../../from/src/app/models/course";
import NotFoundError from "../../types/errors/NotFoundError";

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

  getSubscribedCourses = async (
    userId: string,
    availability: boolean
  ): Promise<CourseDto[]> => {
    let subscribedCourses;

    if (!availability) {
      subscribedCourses = await UserMongooseModel.findById(userId).populate({
        path: "subscribedCourses",
        match: { available: availability },
        select: "-subscribedStudents",
      });
    }

    subscribedCourses = await UserMongooseModel.findById(userId)
      .populate("subscribedCourses")
      .populate("instructorId");
    return subscribedCourses.subscribedCourses.map((course: any) => {
      return new CourseDto(course.name, course.price, course.instructorId.name);
    });
  };

  async findOne(arg: CoursePayload): Promise<Course> {
    const course = await CourseMongooseModel.findOne(arg);
    console.log(course + "from courseRepoImpl");
    return course;
  }

  async populateCourse(
    arg: CoursePayload,
    path: string
  ): Promise<PopulatedCourse> {
    return CourseMongooseModel.findOne(arg).populate(path);
  }

  async addCourse(
    course: {
      name: string;
      maxStudents: number;
      price: number;
    },
    userId: string
  ): Promise<Course> {
    return await new CourseMongooseModel({
      name: course.name,
      maxStudents: course.maxStudents,
      price: course.price,
      instructorId: userId,
    }).save();
  }

  async findById(courseId: string): Promise<Course | NotFoundError> {
    const result = await CourseMongooseModel.findById(courseId);
    if (!result) {
      return new NotFoundError("Course Not found");
    }
    return result;
  }

  async findOneAndUpdate(arg: CoursePayload, course: Course): Promise<void> {
    //const course = await Course.findOneAndUpdate(
    //       { _id: new ObjectId(courseId) },
    //       updatedCourse
    //     );
    return CourseMongooseModel.findOneAndUpdate(arg, course);
  }
}
