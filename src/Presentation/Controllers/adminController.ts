import AdminServices from "../../Domain/Services/AdminServices";
import { AdminAppServices } from "../../Application/Services/AdminAppServices";
import { RequestHandler } from "express";
import AddCourseRequest from "../models/AddCourseRequest";
import ConflictError from "../types/errors/ConflictError";
import NotFoundError from "../types/errors/NotFoundError";
import UpdateCourseRequest from "../models/UpdateCourseRequest";
import AuthError from "../types/errors/AuthError";
import CourseRepositoryImpl from "../../infrastructure/Repositories/CourseRepositoryImpl";
import { inject, injectable } from "tsyringe";

@injectable()
export default class AdminController {
  constructor(
    @inject("AdminServices") private readonly adminServices: AdminServices
  ) {}

  addCourse: RequestHandler = async (req, res, next) => {
    try {
      const courseRequest = new AddCourseRequest(
        req.body.name,
        req.body.maxStudents,
        req.body.price
      );

      const result = await this.adminServices.addCourse(
        courseRequest,
        req.userId
      );

      res.status(201).json({
        message: "course created successfully!",
        course: result,
      });
    } catch (e) {
      if (e instanceof ConflictError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      next(e);
    }
  };

  deleteCourse: RequestHandler = async (req, res, next) => {
    const courseId = req.params.id;
    try {
      await this.adminServices.deleteCourse(courseId, req.userId);

      res.status(200).json({ message: "Course Deleted Successfully!" });
    } catch (e) {
      if (e instanceof NotFoundError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      next(e);
    }
  };

  updateCourse: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const courseId = req.params.id;
    const courseToUpdate = new UpdateCourseRequest(
      req.body.name,
      req.body.maxStudents,
      req.body.price
    );
    try {
      await this.adminServices.updateCourse(courseId, courseToUpdate, userId);

      res.status(200).json({ message: "Course Updated Successfully!" });
    } catch (e) {
      if (e instanceof NotFoundError || e instanceof AuthError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      next(e);
    }
  };
}
