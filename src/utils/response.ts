import { Response } from "express";
import * as yup from "yup";

export default {
  success(res: Response, data: any, message: string) {
    res.status(200).json({
      meta: {
        status: 200,
        message,
      },
      data,
    });
  },

  error(res: Response, error: unknown, message: string) {
    // Response error dari yup validasi
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        meta: {
          status: 400,
          message,
        },
        message: { [`${error.path}`]: error.errors[0] },
      });
    }

    // Response error default
    res.status(500).json({
      meta: {
        status: 500,
        message,
      },
      data: error,
    });
  },

  notFound(res: Response, message: string = "not found") {
    res.status(404).json({
      meta: {
        status: 404,
        message,
      },
      data: null,
    });
  },

  unauthorized(res: Response, message: string = "unauthorized") {
    res.status(403).json({
      meta: {
        status: 403,
        message,
      },
      data: null,
    });
  },
};
