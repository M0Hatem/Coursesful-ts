import { Router } from "express";
import Validator from "../middlewares/Validator";
import AuthController from "../Controllers/AuthController";
import AuthAppServices from "../../Application/Services/AuthAppServices";
import { inject } from "tsyringe";

export default class AuthRoutes {
  private readonly router: Router;
  private validator: Validator;

  constructor(
    @inject("AuthController") private readonly authControllers: AuthController
  ) {
    this.router = Router();
    this.validator = new Validator();

    this.setupRoutes();
  }
  private setupRoutes() {
    this.router.post(
      "/signup",
      [
        this.validator.nameValidation,
        this.validator.emailValidation,
        this.validator.passwordValidator,
      ],
      this.authControllers.signup
    );
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
