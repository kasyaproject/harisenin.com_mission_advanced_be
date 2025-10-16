import { NextFunction, Request, Response } from "express";
import { getUserData } from "../utils/jwt";
import response from "../utils/response";

export default (req: Request, res: Response, next: NextFunction) => {
  const authorized = req.headers?.authorization;

  // Periksa apakah permintaan memiliki header authorization
  if (!authorized) return response.unauthorized(res);

  // Periksa apakah authorized valid
  const [prefix, token] = authorized.split(" ");

  if (!(prefix === "Bearer" && token)) return response.unauthorized(res);

  // Periksa apakah user ada
  const user = getUserData(token);
  if (!user) return response.unauthorized(res);

  // jika validasi lolos Simpan user ke dalam request
  req.user = user;

  next();
};
