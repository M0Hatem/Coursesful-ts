import { RequestHandler } from "express";

import UserServices from "../../Domain/Services/UserServices";
import UserAppServices from "../../Application/Services/UserAppServices";

export default class UserController {
  private userServices: UserServices;

  constructor() {
    this.userServices = new UserAppServices();
  }
  getOneCourse: RequestHandler = async (req, res, next) => {
    const courseId: string = req.params.id;
    const userId: string = req.userId;
    try {
      const course = await this.userServices.getOneCourse(courseId, userId);
      res.status(200).json({ course: course });
    } catch (e) {
      next(e);
    }
  };
}