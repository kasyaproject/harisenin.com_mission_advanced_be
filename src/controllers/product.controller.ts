import { Request, Response } from "express";
import {
  createProduct,
  getAllProducts,
  getOneProduct,
  removeProduct,
  updateProduct,
} from "../models/products.model";
import response from "../utils/response";

export default {
  findAll: async (req: Request, res: Response) => {
    try {
      const params = req.query;

      const products = await getAllProducts(params);

      response.success(res, products, "Get All Products success");
    } catch (err) {
      response.error(res, err, "Failed to get Products");
    }
  },

  getProductbyId: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await getOneProduct(Number(id));

      if (product) {
        response.success(res, product, "Get Product by ID success");
      } else {
        response.notFound(res, "Product not found");
      }
    } catch (err) {
      response.error(res, err, "Failed to get Product by ID");
    }
  },

  createProduct: async (req: Request, res: Response) => {
    try {
      const product = await createProduct(req.body);

      response.success(res, product, "Create Product success");
    } catch (err) {
      response.error(res, err, "Failed to create Product");
    }
  },

  updateProduct: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await updateProduct(Number(id), req.body);

      response.success(res, product, "Update Product success");
    } catch (err) {
      response.error(res, err, "Failed to update Product");
    }
  },

  deleteProduct: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await removeProduct(Number(id));

      response.success(res, null, "Delete Product success");
    } catch (err) {
      response.error(res, err, "Failed to delete Product");
    }
  },
};
