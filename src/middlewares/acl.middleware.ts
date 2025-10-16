import { Response, NextFunction, Request } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";

// MIDDLEWARE ACCES CONTROL LIST
// middelware untuk memastikan role user sudah benar "admin" / "student"
export default (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role || !roles.includes(role))
      return response.unauthorized(res, "Forbidden");

    next();
  };
};
