import { Router } from "express";
import Validator from "../middlewares/Validator";

export default class AuthRoutes {
  private readonly router: Router;
  private validator: Validator;
  constructor() {
    this.router = Router();
    this.validator = new Validator();
    this.setupRoutes();
  }
  private setupRoutes() {
    this.router.post("/signup", [
      this.validator.nameValidation,
      this.validator.emailValidation,
      this.validator.passwordValidator,
    ]);
    this.router.post("/login", [
      this.validator.emailValidation,
      this.validator.passwordValidator,
    ]);
  }
  getRouter(): Router {
    return this.router;
  }
}
