import { RequestHandler } from "express";

import UserServices from "../../Domain/Services/UserServices";
import UserAppServices from "../../Application/Services/UserAppServices";
import NotFoundError from "../../types/errors/NotFoundError";

export default class UserController {
  private userServices: UserServices;

  constructor() {
    this.userServices = new UserAppServices();
  }
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
    // try {
    //   let allCourses = await Course.find({ available: true }).select([
    //     "-subscribedStudents",
    //   ]);
    //   const subscribedCourses = await User.findById(req.userId).populate({
    //     path: "subscribedCourses",
    //     match: { available: false },
    //     select: "-subscribedStudents",
    //   });
    //   let filtered = subscribedCourses!.subscribedCourses;
    //
    //   // @ts-ignore
    //   allCourses = allCourses.concat(filtered);
    //
    //   res.status(200).json({ courses: allCourses });
    //   res.status(200);
    // } catch (e) {}
  };
}
