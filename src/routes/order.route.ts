import express from "express";
import orderController from "../controllers/order.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/orders", authMiddleware, orderController.findAll);
router.get("/orders/:id", authMiddleware, orderController.getOrderbyId);
router.get("/orders/:id/user", authMiddleware, orderController.getOrderbyUser);
router.post("/orders", authMiddleware, orderController.createOrder);

export default router;
