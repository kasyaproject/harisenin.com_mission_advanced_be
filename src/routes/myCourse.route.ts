import express from "express";
import myCourseController from "../controllers/myCourse.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/my-courses", authMiddleware, myCourseController.findAll);
router.get("/my-courses/:id", authMiddleware, myCourseController.getCoursebyId);
router.post("/my-courses", authMiddleware, myCourseController.createMyCourse);
router.put(
  "/my-courses/:id",
  authMiddleware,
  myCourseController.updateCourseDone
);

export default router;
