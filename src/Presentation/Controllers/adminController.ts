import AdminServices from "../../Domain/Services/AdminServices";
import { AdminAppServices } from "../../Application/Services/AdminAppServices";
import { RequestHandler } from "express";
import AddCourseRequest from "../models/AddCourseRequest";
import ConflictError from "../../types/errors/ConflictError";
import NotFoundError from "../../types/errors/NotFoundError";
import UpdateCourseRequest from "../models/UpdateCourseRequest";
import AuthError from "../../types/errors/AuthError";
import CourseRepositoryImpl from "../../infrastructure/Repositories/CourseRepositoryImpl";
import { inject, injectable } from "tsyringe";

@injectable()
export default class AdminController {
  constructor(
    @inject("AdminServices") private readonly adminServices: AdminServices
  ) {}
  addCourse: RequestHandler = async (req, res, next) => {
    const courseRequest = new AddCourseRequest(
      req.body.name,
      req.body.maxStudents,
      req.body.price
    );
    const result = await this.adminServices.addCourse(
      courseRequest,
      req.userId
    );
    if (result instanceof ConflictError) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    res.status(201).json({
      message: "course created successfully!",
      course: result,
    });
  };

  deleteCourse: RequestHandler = async (req, res, next) => {
    const courseId = req.params.id;
    const result = await this.adminServices.deleteCourse(courseId);
    if (result instanceof NotFoundError) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    res.status(200).json({ message: "Course Deleted Successfully!" });
  };

  updateCourse: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const courseId = req.params.id;
    const courseToUpdate = new UpdateCourseRequest(
      req.body.name,
      req.body.maxStudents,
      req.body.price
    );
    const result = await this.adminServices.updateCourse(
      courseId,
      courseToUpdate,
      userId
    );
    if (result instanceof NotFoundError || result instanceof AuthError) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    res.status(200).json({ message: "Course Updated Successfully!" });
  };
}
