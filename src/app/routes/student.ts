import { Router } from "express";

import { studentControllers } from "../controllers/student.js";
import { isAuth } from "../middleware/is-auth.js";

const router = Router();

router.get("/subscribed", isAuth, studentControllers.getSubscribedCourses);
router.post("/:id/subscribe", isAuth, studentControllers.subscribeToCourse);

router.delete(
  "/:id/unsubscribe",
  isAuth,
  studentControllers.unSubscribeToCourse
);
router.get("/:id", isAuth, studentControllers.getOneCourse);

router.get("/", isAuth, studentControllers.getCourses);
export default router;
