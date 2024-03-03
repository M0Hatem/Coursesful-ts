import AdminServices from "../../Domain/Services/AdminServices";
import { AdminAppServices } from "../../Application/Services/AdminAppServices";
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import AddCourseRequest from "../models/AddCourseRequest";
import ConflictError from "../../types/errors/ConflictError";

export default class AdminController {
  private adminServices: AdminServices;
  constructor() {
    this.adminServices = new AdminAppServices();
  }
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
}
