import express from "express";
import tutorController from "../controllers/tutor.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/tutors", authMiddleware, tutorController.findAll);
router.get("/tutors/:id", authMiddleware, tutorController.findOne);
router.post("/tutors", authMiddleware, tutorController.createTutor);
router.put("/tutors/:id", authMiddleware, tutorController.updateTutor);
router.delete("/tutors/:id", authMiddleware, tutorController.deleteTutor);

export default router;
