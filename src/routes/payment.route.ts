import express from "express";
import paymentController from "../controllers/payment.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";

const router = express.Router();

router.get("/payments", authMiddleware, paymentController.findAll);
router.get("/payments/:id", authMiddleware, paymentController.getOnebyId);
router.post("/payments", authMiddleware, paymentController.createPayment);
router.put(
  "/payments/:id/paid",
  authMiddleware,
  paymentController.updateStatusPaid
);
router.put(
  "/payments/:id/cancelled",
  authMiddleware,
  paymentController.updateStatusCancelled
);
router.put(
  "/payments/:id/pending",
  authMiddleware,
  paymentController.updateStatusPending
);

export default router;
