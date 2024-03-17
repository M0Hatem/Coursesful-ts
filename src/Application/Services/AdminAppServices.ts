import AdminServices from "../../Domain/Services/AdminServices";
import Course from "../../Domain/Entites/Course";
import CourseRepository from "../../Domain/Repositories/CourseRepository";
import CourseRepositoryImpl from "../../infrastructure/Repositories/CourseRepositoryImpl";
import ConflictError from "../../types/errors/ConflictError";
import NotFoundError from "../../types/errors/NotFoundError";
import AuthError from "../../types/errors/AuthError";
import { inject, injectable } from "tsyringe";

@injectable()
export class AdminAppServices implements AdminServices {
  constructor(
    @inject("CourseRepository")
    private readonly courseRepository: CourseRepository
  ) {}
  async addCourse(
    course: { name: string; maxStudents: number; price: number },
    userId: string
  ): Promise<ConflictError | Course> {
    let doc = await this.courseRepository.findOne({
      name: course.name,
    });

    if (doc) {
      doc = await this.courseRepository.populateCourse(
        { name: course.name },
        "instructorId"
      );

      // @ts-ignore
      if (doc.instructorId._id!.toString() === userId) {
        return new ConflictError("there is a course with the same name");
      }
    }

    return await this.courseRepository.addCourse(course, userId);
  }

  async deleteCourse(courseId: string): Promise<void | NotFoundError> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      return new NotFoundError("Course Not Found!");
    }
    await this.courseRepository.findByIdAndDelete(courseId);
  }

  async updateCourse(
    courseId: string,
    course: { name?: string; maxStudents?: number; price?: number },
    userId: string
  ): Promise<void | AuthError | NotFoundError> {
    const result = await this.courseRepository.findById(courseId);
    if (!result) {
      return new NotFoundError("Course Not Found!");
    }
    if ("instructorId" in result && result.instructorId.toString() !== userId) {
      return new AuthError(
        "You do not have the necessary permission to update this course"
      );
    }
    await this.courseRepository.findOneAndUpdate({ _id: courseId }, course);
  }
}
