import AuthAppServices from "../../Application/Services/AuthAppServices";
import { RequestHandler } from "express";
import AuthError from "../../types/errors/AuthError";
import { validationResult } from "express-validator";
import ValidationError from "../../types/ValidationError";
import ConflictError from "../../types/errors/ConflictError";
import AuthServices from "../../Domain/Services/AuthServices";
export default class AuthController {
  private authService: AuthServices;
  constructor(authService: AuthServices) {
    this.authService = authService;
  }
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
      if (result instanceof AuthError) {
        res.status(result.statusCode).json({ message: result.message });
      } else {
        res.status(200).json({
          status: "success",
          message: "Authentication successful.",
          token: result,
        });
      }
    } catch (e) {
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
      if (result instanceof ConflictError) {
        res.status(result.statusCode).json({ message: result.message });
      } else {
        res.status(201).json({
          status: "success",
          message: "Registration successful.",
        });
      }
    } catch (e) {
      next(e);
    }
  };
}
