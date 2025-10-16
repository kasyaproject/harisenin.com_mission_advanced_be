import express from "express";
import categoryController from "../controllers/category.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/categories", categoryController.findAll);
router.get("/categories/:id", categoryController.getCategoryById);
router.post("/categories", authMiddleware, categoryController.createCategory);
router.put(
  "/categories/:id",
  authMiddleware,
  categoryController.updateCategory
);
router.delete(
  "/categories/:id",
  authMiddleware,
  categoryController.deleteCategory
);

export default router;
