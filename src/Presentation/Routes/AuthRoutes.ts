import { Router } from "express";
import Validator from "../middlewares/Validator";
import AuthController from "../Controllers/AuthController";
import AuthAppServices from "../../Application/Services/AuthAppServices";

export default class AuthRoutes {
  private readonly router: Router;
  private validator: Validator;
  private authControllers: AuthController;
  constructor() {
    this.router = Router();
    this.validator = new Validator();
    this.authControllers = new AuthController();
    this.setupRoutes();
  }
  private setupRoutes() {
    this.router.post("/signup", [
      this.validator.nameValidation,
      this.validator.emailValidation,
      this.validator.passwordValidator,
    ]);
    this.router.post(
      "/login",
      [this.validator.emailValidation, this.validator.passwordValidator],
      this.authControllers.login
    );
  }
  getRouter(): Router {
    return this.router;
  }
}
