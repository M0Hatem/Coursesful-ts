import { RequestHandler } from "express";

import UserServices from "../../Domain/Services/UserServices";
import UserAppServices from "../../Application/Services/UserAppServices";
import NotFoundError from "../types/errors/NotFoundError";
import ConflictError from "../types/errors/ConflictError";
import { inject, injectable } from "tsyringe";

@injectable()
export default class UserController {
  constructor(@inject("UserService") private userServices: UserServices) {}

  getOneCourse: RequestHandler = async (req, res, next) => {
    const courseId: string = req.params.id;
    const userId: string = req.userId;
    try {
      const result = await this.userServices.getOneCourse(courseId, userId);
      if (result instanceof NotFoundError) {
        return res.status(result.statusCode).json({ message: result.message });
      }

      res.status(200).json({ course: result });
    } catch (e) {
      next(e);
    }
  };

  getSubscribedCourses: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const result = await this.userServices.getSubscribedCourses(userId, true);
    if (result instanceof NotFoundError) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    res.status(200).json({ courses: result });
  };

  getAllCourses: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const result = await this.userServices.getAllCourses(userId);
    if (result instanceof NotFoundError) {
      return res.status(result.statusCode).json({ message: result.message });
    }

    res.status(200).json({ courses: result });
  };

  courseSubscribeHandler: RequestHandler = async (req, res, next) => {
    const courseId = req.params.id;
    const userId = req.userId;
    try {
      await this.userServices.subscribeToCourse(courseId, userId);
    } catch (e) {
      if (e instanceof NotFoundError || e instanceof ConflictError) {
        return res.status(e.statusCode).json({ message: e.message });
      }
      next(e);
    }

    res.status(201).json({ message: "successfully subscribed!" });
  };

  courseUnSubscribeHandler: RequestHandler = async (req, res, next) => {
    const courseId = req.params.id;
    const userId = req.userId;
    const result: void | NotFoundError | ConflictError =
      await this.userServices.unSubscribeToCourse(courseId, userId);
    if (result instanceof NotFoundError || result instanceof ConflictError) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    res.status(201).json({ message: "successfully unSubscribed." });
  };
}
