import express from "express";
import pretestController from "../controllers/pretest.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";

const router = express.Router();

router.get(
  "/pretests",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  pretestController.findAll
);
router.get("/pretests/:id", pretestController.getPretestById);
router.post(
  "/pretests",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  pretestController.createPretest
);
router.put(
  "/pretests/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  pretestController.updatePretest
);
router.delete(
  "/pretests/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  pretestController.deletePretest
);

export default router;
