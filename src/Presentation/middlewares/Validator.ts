import { body } from "express-validator";

export default class Validator {
  async nameValidation() {
    return body("name").trim().not().isEmpty().isLength({ min: 3 });
  }
  async maxStudentsValidation() {
    return body("maxStudents").isNumeric({ no_symbols: true });
  }
  async emailValidation() {
    return body("email")
      .isEmail()
      .withMessage("enter valid email")
      .normalizeEmail();
  }
  async passwordValidator() {
    return body("password").trim().isLength({ min: 5 });
  }
}
