import { body } from "express-validator";
import { NextFunction, RequestHandler } from "express";

export default class Validator {
  nameValidation: RequestHandler = async (req, res, next) => {
    await body("name").trim().not().isEmpty().isLength({ min: 3 }).run(req);
    next();
  };
  maxStudentsValidation: RequestHandler = async (req, res, next) => {
    await body("maxStudents").isNumeric({ no_symbols: true }).run(req);
    next();
  };
  priceValidation: RequestHandler = async (req, res, next) => {
    await body("price").isFloat().run(req);
    next();
  };
  emailValidation: RequestHandler = async (req, res, next) => {
    await body("email")
      .isEmail()
      .withMessage("enter valid email")
      .normalizeEmail()
      .run(req);
    next();
  };
  passwordValidator: RequestHandler = async (req, res, next) => {
    await body("password").trim().isLength({ min: 5 }).run(req);
    next();
  };
}
