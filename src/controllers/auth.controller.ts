import { Request, Response } from "express";
import response from "../utils/response";
import { registerUser } from "./../models/auth.model";

export default {
  login: async (req: Request, res: Response) => {
    try {
      res.send("Login");
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

  logout: async (req: Request, res: Response) => {
    try {
      res.send("Logout");
    } catch (err) {
      response.error(res, err, "Failed to logout");
    }
  },
};
