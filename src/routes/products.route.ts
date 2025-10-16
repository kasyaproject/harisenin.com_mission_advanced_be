import express from "express";
import productController from "../controllers/product.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";

const router = express.Router();

router.get("/products", productController.findAll);
router.get("/products/:id", productController.getProductbyId);
router.post(
  "/products",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  productController.createProduct
);
router.put(
  "/products/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  productController.updateProduct
);
router.delete(
  "/products/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  productController.deleteProduct
);

export default router;
