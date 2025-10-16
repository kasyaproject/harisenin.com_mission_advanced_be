import { IUserToken } from "../../utils/interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUserToken;
    }
  }
}
