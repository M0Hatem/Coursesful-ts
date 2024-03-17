import CourseRepository from "../../Domain/Repositories/CourseRepository";
import Course from "../../Domain/Entites/Course";
import CourseMongooseModel from "../Models/CourseMongooseModel";
import CourseDto from "../Models/CourseDto";
import UserMongooseModel from "../Models/UserMongooseModel";
import CoursePayload from "../Models/CoursePayload";
import PopulatedCourse from "../Models/PopulatedCourse";
import NotFoundError from "../../types/errors/NotFoundError";
import { injectable } from "tsyringe";
import mongoose from "mongoose";

@injectable()
export default class CourseRepositoryImpl implements CourseRepository {
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
  async findById(courseId: string): Promise<Course | null> {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error("Invalid ID");
    }

    const result = await CourseMongooseModel.findById(courseId);

    if (!result) {
      return null;
    }
    return result;
  }
  async findOne(arg: CoursePayload): Promise<Course> {
    const course = await CourseMongooseModel.findOne(arg);
    console.log(course + "from courseRepoImpl");
    return course;
  }

  async getCourse(courseId: string, userId: string): Promise<CourseDto | null> {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return null;
    }

    const doc = await CourseMongooseModel.find({
      _id: courseId,
      //TODO get  subscribedStudents: userId back
    }).populate("instructorId");

    if (doc.length === 0) {
      return null;
    }

    return new CourseDto(
      doc[0].name,
      doc[0].price,
      doc[0].InstructorName,
      doc[0].available
    );
  }
  async populateCourse(
    arg: CoursePayload,
    path: string
  ): Promise<PopulatedCourse> {
    return CourseMongooseModel.findOne(arg).populate(path);
  }

  getSubscribedCourses = async (
    userId: string,
    availability: boolean
  ): Promise<CourseDto[]> => {
    let subscribedCourses: any;

    if (!availability) {
      subscribedCourses = await UserMongooseModel.findById(userId).populate({
        path: "subscribedCourses",
        populate: { path: "instructorId" },
        match: { available: availability },
        select: "-subscribedStudents",
      });
      return subscribedCourses.subscribedCourses.map((course: any) => {
        return new CourseDto(
          course.name,
          course.price,
          course.instructorId.name
        );
      });
    }

    subscribedCourses = await UserMongooseModel.findById(userId).populate({
      path: "subscribedCourses",
      populate: { path: "instructorId" },
    });

    return subscribedCourses.subscribedCourses.map((course: any) => {
      return new CourseDto(course.name, course.price, course.instructorId.name);
    });
  };

  async unSubscribeToCourse(userId: string, courseId: string): Promise<void> {
    await UserMongooseModel.findByIdAndUpdate(userId, {
      $pull: { subscribedCourses: courseId },
    });

    await CourseMongooseModel.findByIdAndUpdate(courseId, {
      $pull: { subscribedStudents: userId },
    });
    return;
  }
  async isSubscribedToCourse(
    courseId: string,
    userId: string
  ): Promise<boolean> {
    const result = await UserMongooseModel.findOne({
      _id: userId,
      subscribedCourses: courseId,
    });

    return result != null;
  }

  async getAllCourses(userId: string): Promise<CourseDto[]> {
    let allCourses = await CourseMongooseModel.find({ available: true })
      .populate("instructorId")
      .select(["-subscribedStudents"]);
    let result = allCourses.map((course: any) => {
      return new CourseDto(course.name, course.price, course.instructorId.name);
    });
    const unavailableSubscribedCourses = await this.getSubscribedCourses(
      userId,
      false
    );
    console.log(result.concat(unavailableSubscribedCourses));
    return result.concat(unavailableSubscribedCourses);
  }

  async findByIdAndDelete(courseId: string): Promise<void> {
    return CourseMongooseModel.findByIdAndUpdate(courseId, {
      available: false,
    });
  }

  async findByIdAndUpdate(courseId: string, course: Course): Promise<void> {
    return CourseMongooseModel.findByIdAndUpdate(courseId, course);
  }

  async save(courseId: string): Promise<Course> {
    const course = await CourseMongooseModel.findById(courseId);
    return course.save();
  }

  async findOneAndUpdate(arg: CoursePayload, course: Course): Promise<void> {
    //const course = await Course.findOneAndUpdate(
    //       { _id: new ObjectId(courseId) },
    //       updatedCourse
    //     );
    return CourseMongooseModel.findOneAndUpdate(arg, course);
  }

  async subscribeToCourse(userId: string, courseId: string): Promise<void> {
    await UserMongooseModel.findByIdAndUpdate(userId, {
      $push: { subscribedCourses: courseId },
    });

    await CourseMongooseModel.findByIdAndUpdate(courseId, {
      $push: { subscribedStudents: userId },
    });
    return;
  }
}
