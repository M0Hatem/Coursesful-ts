import AdminServices from "../../Domain/Services/AdminServices";
import Course from "../../Domain/Entites/Course";
import CourseRepository from "../../Domain/Repositories/CourseRepository";
import CourseRepositoryImpl from "../../infrastructure/Repositories/CourseRepositoryImpl";
import ConflictError from "../../types/errors/ConflictError";

export class AdminAppServices implements AdminServices {
  private courseRepository: CourseRepository;
  constructor() {
    this.courseRepository = new CourseRepositoryImpl();
  }
  async addCourse(
    courseRequest: { name: string; maxStudents: number; price: number },
    userId: string
  ): Promise<ConflictError | Course> {
    console.log("courseRequest : " + courseRequest);
    let doc = await this.courseRepository.findOne({ name: courseRequest.name });
    console.log("doc : " + doc);
    if (doc) {
      doc = await this.courseRepository.populateCourse(
        { name: courseRequest.name },
        "instructorId"
      );
      console.log("populateCourse : " + doc);
      // @ts-ignore
      if (doc.instructorId._id!.toString() === userId) {
        return new ConflictError("there is a course with the same name");
      }
    }

    return await this.courseRepository.addCourse(courseRequest, userId);
  }

  deleteCourse(courseId: string): void {}

  updateCourse(course: Course): void {}
}
