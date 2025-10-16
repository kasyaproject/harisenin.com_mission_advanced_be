import express from "express";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";

const router = express.Router();

router.get(
  "/users",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  userController.findAll
);
router.get(
  "/users/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.STUDENT])],
  userController.getUserById
);
router.post(
  "/users",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  userController.createUser
);
router.put(
  "/users/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.STUDENT])],
  userController.updateUser
);
router.delete(
  "/users/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  userController.deleteUser
);

export default router;
