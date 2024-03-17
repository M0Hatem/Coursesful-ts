import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import UserController from "../Controllers/UserController";
import { autoInjectable, inject } from "tsyringe";

export default class StudentRoutes {
  private readonly router: Router;

  private readonly isAuth;
  constructor(
    @inject("UserController") private readonly userController: UserController
  ) {
    this.router = Router();

    this.isAuth = authMiddleware;
    this.setupRoutes();
  }
  setupRoutes() {
    this.router.get(
      "/subscribed",
      this.isAuth,
      this.userController.getSubscribedCourses
    );
    this.router.post(
      "/:id/subscribe",
      this.isAuth,
      this.userController.courseSubscribeHandler
    );
    this.router.delete(
      "/:id/unsubscribe",
      this.isAuth,
      this.userController.courseUnSubscribeHandler
    );
    this.router.get("/:id", this.isAuth, this.userController.getOneCourse); //TODO get authMiddleware back
    this.router.get("/", this.isAuth, this.userController.getAllCourses);
  }
  getRouter(): Router {
    return this.router;
  }
}
