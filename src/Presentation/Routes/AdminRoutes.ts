import { Router } from "express";

import authMiddleware from "../middlewares/authMiddleware";
import Validator from "../middlewares/Validator";
import AdminController from "../Controllers/AdminController";
import { inject } from "tsyringe";

export default class AdminRoutes {
  private readonly router: Router;
  private readonly isAuth: any;
  private validator: Validator;
  constructor(
    @inject("AdminController") private readonly adminController: AdminController
  ) {
    this.router = Router();
    this.isAuth = authMiddleware;
    this.validator = new Validator();

    this.setupRoutes();
  }
  private setupRoutes() {
    this.router.post(
      "/add",
      this.isAuth,
      [this.validator.nameValidation, this.validator.maxStudentsValidation],
      this.adminController.addCourse
    );
    this.router.put(
      "/:id",
      this.isAuth,
      [
        this.validator.nameValidation,
        this.validator.maxStudentsValidation,
        this.validator.priceValidation,
      ],
      this.adminController.updateCourse
    );
    this.router.delete("/:id", this.isAuth, this.adminController.deleteCourse);
  }
  getRouter(): Router {
    return this.router;
  }
}
