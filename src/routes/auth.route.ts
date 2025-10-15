import express from "express";
import authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/sign-up", authController.register);
router.post("/sign-in", authController.login);
router.post("/sign-out", authController.logout);

export default router;
