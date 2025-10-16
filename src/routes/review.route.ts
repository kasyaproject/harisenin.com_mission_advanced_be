import express from "express";
import reviewController from "../controllers/review.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/reviews", authMiddleware, reviewController.findAll);
router.get("/reviews/:id", authMiddleware, reviewController.getOnebyId);
router.post("/reviews", authMiddleware, reviewController.createReview);
router.put("/reviews/:id", authMiddleware, reviewController.updateReview);
router.delete("/reviews/:id", authMiddleware, reviewController.deleteReview);

export default router;
