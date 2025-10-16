import express from "express";
import modulsController from "../controllers/moduls.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/moduls", authMiddleware, modulsController.findAll);
router.get("/moduls/:id", modulsController.getOnebyId);
router.post("/moduls", authMiddleware, modulsController.createModul);
router.put("/moduls/:id", authMiddleware, modulsController.updateModul);
router.delete("/moduls/:id", authMiddleware, modulsController.deleteModul);

export default router;
