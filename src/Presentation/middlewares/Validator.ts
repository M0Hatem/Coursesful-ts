import { body } from "express-validator";

export default class Validator {
  private body;
  constructor() {
    this.body = body();
  }
  async nameValidation() {
    return this.body("name").trim().not().isEmpty().isLength({ min: 3 });
  }
  async maxStudentsValidation() {
    return this.body("maxStudents").isNumeric({ no_symbols: true });
  }
  async emailValidation() {
    return this.body("email")
      .isEmail()
      .withMessage("enter valid email")
      .normalizeEmail();
  }
  async passwordValidator() {
    return this.body("password").trim().isLength({ min: 5 });
  }
}
