import CourseRepository from "../../Domain/Repositories/CourseRepository";
import Course from "../../Domain/Entites/Course";
import CourseMongooseModel from "../Models/CourseMongooseModel";
import CourseDto from "../Models/CourseDto";
import UserMongooseModel from "../Models/UserMongooseModel";
import CourseQueryOptions from "../../Domain/QueryModels/CourseQueryOptions";
import PopulatedCourse from "../Models/PopulatedCourse";
import NotFoundError from "../../Presentation/types/errors/NotFoundError";
import { injectable } from "tsyringe";
import mongoose from "mongoose";
import Instructor from "../../Domain/Entites/Instructor";

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

  async findOne(arg: CourseQueryOptions): Promise<CourseDto> {
    const course = await CourseMongooseModel.findOne(arg);
    console.log(course + "from courseRepoImpl");
    return new CourseDto(
      course.name,
      course.price,
      course.instructorId as string,
      course.available
    );
  }

  async getCourse(courseId: string): Promise<CourseDto> {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error("invalid Id");
    }

    const doc = await CourseMongooseModel.find({
      _id: courseId,
    });

    if (doc.length === 0) {
      return null;
    }
    return new CourseDto(
      doc[0].name,
      doc[0].price,
      doc[0].InstructorName,
      doc[0].available,
      doc[0].subscribedStudents
    );
  }

  async populateCourse(
    arg: CourseQueryOptions,
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
          course.instructorId.name,
          course.available
        );
      });
    }

    subscribedCourses = await UserMongooseModel.findById(userId).populate({
      path: "subscribedCourses",
      populate: { path: "instructorId" },
    });

    return subscribedCourses.subscribedCourses.map((course: any) => {
      return new CourseDto(
        course.name,
        course.price,
        course.instructorId.name,
        course.available
      );
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

  async getAllAvailableCourses(): Promise<CourseDto[]> {
    let allCourses = await CourseMongooseModel.find({ available: true })
      .populate("instructorId")
      .select(["-subscribedStudents"]);

    try {
      return allCourses.map((course: any) => {
        return new CourseDto(
          course.name,
          course.price,
          course.instructorId.name,
          course.available
        );
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getAllUnAvailableCourses(userId: string): Promise<CourseDto[]> {
    const unavailableSubscribedCourses = await this.getSubscribedCourses(
      userId,
      false
    );
    console.log(unavailableSubscribedCourses);
    return unavailableSubscribedCourses;

    // return unavailableSubscribedCourses.map((course: any) => {
    //   return new CourseDto(
    //     course.name,
    //     course.price,
    //     course.instructorId.name,
    //     course.available
    //   );
    // });
  }

  async findByIdAndDelete(courseId: string): Promise<void> {
    return CourseMongooseModel.findByIdAndUpdate(courseId, {
      available: false,
    });
  }

  async findByIdAndUpdate(courseId: string, course: Course): Promise<void> {
    return CourseMongooseModel.findByIdAndUpdate(courseId, course);
  }

  async save(course: Course): Promise<void> {
    return CourseMongooseModel.findOneAndUpdate({ _id: course._id }, course);
  }

  async findOneAndUpdate(
    arg: CourseQueryOptions,
    course: Course
  ): Promise<void> {
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
