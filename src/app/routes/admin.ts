import { Router } from "express";
import { body } from "express-validator";

import { adminControllers } from "../controllers/admin.js";
import Course from "../models/course.js";
import { isAuth } from "../middleware/is-auth.js";

const router = Router();

router.post(
  "/add",
  [
    body("name")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 3 })
      .custom(async (value, { req }) => {
        const doc = await Course.findOne({ name: value });
        if (doc) {
          return Promise.reject("there is a course with the same name");
        }
      }),
    body("instructor").trim().not().isEmpty().isLength({ min: 3 }),
    body("maxStudents").isNumeric({ no_symbols: true }),
  ],
  isAuth,
  adminControllers.addCourse
);

router.put("/:id", isAuth, adminControllers.updateCourse);

router.delete("/:id", isAuth, adminControllers.deleteCourse);

export default router;
