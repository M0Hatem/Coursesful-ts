import { Router } from "express";
import { body } from "express-validator";

import { authController } from "../controllers/auth.js";
import User from "../models/user.js";

const router = Router();

router.post(
  "/signup",
  [
    body("name").trim().not().isEmpty().isLength({ min: 3 }),
    body("email")
      .isEmail()
      .withMessage("enter valid email")
      .custom(async (value, { req }) => {
        const doc = await User.findOne({ email: value });
        if (doc) {
          return Promise.reject("E-Mail address already exists!");
        }
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.signup
);

router.post("/login", authController.login);

export default router;
