import { Request, Response } from "express";
import response from "../utils/response";
import {
  activationEmail,
  checkMe,
  loginUser,
  registerUser,
} from "./../models/auth.model";
import { IReqUser } from "../utils/interface";

export default {
  login: async (req: Request, res: Response) => {
    try {
      const user = await loginUser(req.body);

      response.success(res, user, "Login success");
    } catch (err) {
      response.error(res, err, "Failed to login");
    }
  },

  register: async (req: Request, res: Response) => {
    try {
      const user = await registerUser(req.body);

      response.success(res, user, "Register success");
    } catch (err) {
      response.error(res, err, "Failed to register");
    }
  },

  checkMe: async (req: Request, res: Response) => {
    try {
      // Ambil data user berdasarkan token
      const user = req.user;

      if (!user?.id) {
        throw new Error("User ID not found");
      }

      const result = await checkMe(user?.id);

      if (!result) return response.unauthorized(res, "User not found!");

      // Jika data user ditemukan, return data user
      response.success(res, result, "Success get user profile!");
    } catch (err) {
      response.error(res, err, "Failed to check me");
    }
  },

  activationEmail: async (req: Request, res: Response) => {
    try {
      const { code } = req.body;

      const user = await activationEmail(code);

      response.success(res, user, "Activation email success");
    } catch (err) {
      response.error(res, err, "Failed to activation email");
    }
  },
};
