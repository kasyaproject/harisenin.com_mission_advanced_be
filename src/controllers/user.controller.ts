import { Request, Response } from "express";
import response from "../utils/response";
import {
  createUser,
  getAllUser,
  getOneUser,
  removeUser,
  updateUser,
} from "../models/users.model";
import { ValidationError } from "yup";

export default {
  async findAll(req: Request, res: Response) {
    try {
      const user = await getAllUser();

      response.success(res, user, "Get All User success");
    } catch (err) {
      response.error(res, err, "Failed to get User");
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await getOneUser(Number(id));

      if (user) {
        response.success(res, user, "Get User by ID success");
      } else {
        response.notFound(res, "User not found");
      }
    } catch (err) {
      response.error(res, err, "Failed to get User by ID");
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const user = await createUser(req.body);

      response.success(res, user, "Create User success");
    } catch (err) {
      response.error(res, err, "Failed to create User");
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await updateUser(Number(id), req.body);

      response.success(res, user, "Update User success");
    } catch (err) {
      response.error(res, err, "Failed to update User");
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await removeUser(Number(id));

      if (user) {
        response.success(res, user, "Delete User success");
      } else {
        response.notFound(res, "User not found");
      }
    } catch (err) {
      response.error(res, err, "Failed to delete User");
    }
  },
};
