import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/auth/sign-up", authController.register);
router.post("/auth/sign-in", authController.login);
router.get("/auth/checkMe", authMiddleware, authController.checkMe);
router.post("/auth/activation", authController.activationEmail);

export default router;
