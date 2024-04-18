import AuthAppServices from "../../Application/Services/AuthAppServices";
import { RequestHandler } from "express";
import AuthError from "../types/errors/AuthError";
import { validationResult } from "express-validator";
import ValidationError from "../types/ValidationError";
import ConflictError from "../types/errors/ConflictError";
import AuthServices from "../../Domain/Services/AuthServices";
import { inject, injectable } from "tsyringe";

@injectable()
export default class AuthController {
  constructor(
    @inject("AuthService") private readonly authService: AuthServices
  ) {}

  login: RequestHandler = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new ValidationError("Validation failed.", 422, errors.array())
      );
    }
    const { email, password } = req.body;
    try {
      const result = await this.authService.login(email, password);

      res.status(200).json({
        status: "success",
        message: "Authentication successful.",
        token: result,
      });
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(e.statusCode).json({ message: e.message });
      }
      next(e);
    }
  };
  signup: RequestHandler = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new ValidationError("Validation failed.", 422, errors.array())
      );
    }
    const { name, email, password } = req.body;
    try {
      const result = await this.authService.signup(name, email, password);

      res.status(201).json({
        status: "success",
        message: "Registration successful.",
      });
    } catch (e) {
      if (e instanceof ConflictError) {
        res.status(e.statusCode).json({ message: e.message });
      }
      next(e);
    }
  };
}
