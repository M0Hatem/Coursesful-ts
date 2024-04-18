import AdminServices from "../../Domain/Services/AdminServices";
import Course from "../../Domain/Entites/Course";
import CourseRepository from "../../Domain/Repositories/CourseRepository";
import ConflictError from "../../Presentation/types/errors/ConflictError";
import NotFoundError from "../../Presentation/types/errors/NotFoundError";
import AuthError from "../../Presentation/types/errors/AuthError";
import { inject, injectable } from "tsyringe";
import UpdateCourseRequest from "../models/UpdateCourseRequest";
import AddCourseRequest from "../models/AddCourseRequest";

@injectable()
export class AdminAppServices implements AdminServices {
  constructor(
    @inject("CourseRepository")
    private readonly courseRepository: CourseRepository
  ) {}

  async addCourse(request: AddCourseRequest, userId: string): Promise<Course> {
    let doc = await this.courseRepository.findOne({
      name: request.name,
    });

    if (!doc) {
      return await this.courseRepository.addCourse(request, userId);
    }

    doc = await this.courseRepository.populateCourse(
      { name: request.name },
      "instructorId"
    );
    // @ts-ignore
    if (doc.instructorId._id!.toString() === userId) {
      throw new ConflictError("there is a course with the same name");
    } else {
      return await this.courseRepository.addCourse(request, userId);
    }
  }

  async deleteCourse(courseId: string, userId: string): Promise<void> {
    let course = await this.courseRepository.findById(courseId);

    if (!course || !course.available) {
      throw new NotFoundError("Course Not Found!");
    }

    if (course.instructorId.toString() !== userId) {
      throw new AuthError("You Don't have access to delete this course");
    }

    await this.courseRepository.findByIdAndDelete(courseId);
  }

  //TODO Create UpdateCourseRequest model
  async updateCourse(
    courseId: string,
    request: UpdateCourseRequest,
    userId: string
  ): Promise<void> {
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundError("Course Not Found!");
    }

    if ("instructorId" in course && course.instructorId.toString() !== userId) {
      throw new AuthError(
        "You do not have the necessary permission to update this course"
      );
    }
    await this.courseRepository.findOneAndUpdate({ _id: courseId }, request);
    // // repo.save(course)
    // // course.UpdateName(name);
    // await this.courseRepository.save(course);
  }
}
