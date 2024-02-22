import { Router } from "express";

import authMiddleware from "../middlewares/authMiddleware";
import Validator from "../middlewares/Validator";

export default class AdminRoutes {
  private readonly router: Router;
  private readonly isAuth: any;
  private validator: Validator;
  constructor() {
    this.router = Router();
    this.isAuth = authMiddleware;
    this.validator = new Validator();
    this.setupRoutes();
  }
  private setupRoutes() {
    this.router.post("/add", this.isAuth, [
      this.validator.nameValidation,
      this.validator.maxStudentsValidation,
    ]);
    this.router.put("/:id", this.isAuth, [
      this.validator.nameValidation,
      this.validator.maxStudentsValidation,
    ]);
    this.router.delete("/:id", this.isAuth);
  }
  getRouter(): Router {
    return this.router;
  }
}
