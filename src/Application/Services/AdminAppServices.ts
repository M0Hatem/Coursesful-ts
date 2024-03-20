import AdminServices from "../../Domain/Services/AdminServices";
import Course from "../../Domain/Entites/Course";
import CourseRepository from "../../Domain/Repositories/CourseRepository";
import CourseRepositoryImpl from "../../infrastructure/Repositories/CourseRepositoryImpl";
import ConflictError from "../../types/errors/ConflictError";
import NotFoundError from "../../types/errors/NotFoundError";
import AuthError from "../../types/errors/AuthError";
import { inject, injectable } from "tsyringe";
import Instructor from "../../Domain/Entites/Instructor";

@injectable()
export class AdminAppServices implements AdminServices {
  constructor(
    @inject("CourseRepository")
    private readonly courseRepository: CourseRepository
  ) {}
  async addCourse(
    course: { name: string; maxStudents: number; price: number },
    userId: string
  ): Promise<Course> {
    let doc = await this.courseRepository.findOne({
      name: course.name,
    });

    if (!doc) {
      return await this.courseRepository.addCourse(course, userId);
    }

    doc = await this.courseRepository.populateCourse(
      { name: course.name },
      "instructorId"
    );
    // @ts-ignore
    if (doc.instructorId._id!.toString() === userId) {
      throw new ConflictError("there is a course with the same name");
    } else {
      return await this.courseRepository.addCourse(course, userId);
    }
  }

  async deleteCourse(courseId: string, userId: string): Promise<void> {
    let course = await this.courseRepository.findById(courseId);
    console.log(course);
    if (!course) {
      throw new NotFoundError("Course Not Found!");
    }

    if (course.instructorId !== userId) {
      throw new AuthError("You Don't have access to delete this course");
    }
    await this.courseRepository.findByIdAndDelete(courseId);
  }

  async updateCourse(
    courseId: string,
    course: { name?: string; maxStudents?: number; price?: number },
    userId: string
  ): Promise<void> {
    const result = await this.courseRepository.findById(courseId);

    if (!result) {
      throw new NotFoundError("Course Not Found!");
    }

    if ("instructorId" in result && result.instructorId.toString() !== userId) {
      throw new AuthError(
        "You do not have the necessary permission to update this course"
      );
    }
    await this.courseRepository.findOneAndUpdate({ _id: courseId }, course);
  }
}
