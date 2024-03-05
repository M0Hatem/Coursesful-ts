import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import UserController from "../Controllers/UserController";

export default class StudentRoutes {
  private readonly router: Router;
  private userController: UserController;
  private readonly isAuth;
  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.isAuth = authMiddleware;
    this.setupRoutes();
  }
  setupRoutes() {
    this.router.get(
      "/subscribed",
      this.isAuth,
      this.userController.getSubscribedCourses
    );
    this.router.post("/:id/subscribe", this.isAuth);
    this.router.delete("/:id/unsubscribe", this.isAuth);
    this.router.get("/:id", this.isAuth, this.userController.getOneCourse); //TODO get authMiddleware back
    this.router.get("/", this.isAuth, this.userController.getAllCourses);
  }
  getRouter(): Router {
    return this.router;
  }
}
