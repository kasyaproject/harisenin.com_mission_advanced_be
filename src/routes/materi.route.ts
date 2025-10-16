import express from "express";
import materiController from "../controllers/materi.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/materis", materiController.findAll);
router.get("/materis/:id", materiController.getOnebyId);
router.post("/materis", authMiddleware, materiController.createMateri);
router.put("/materis/:id", authMiddleware, materiController.updateMateri);
router.delete("/materis/:id", authMiddleware, materiController.deleteMateri);

export default router;
