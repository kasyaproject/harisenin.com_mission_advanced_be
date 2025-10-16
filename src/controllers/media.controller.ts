import { Request, Response } from "express";
import response from "../utils/response";
import path from "path";
import fs from "fs";

export default {
  upload: async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return response.error(res, null, "Failed to upload file");
      }

      response.success(
        res,
        {
          filePath: `/uploads/${req.file.filename}`,
          fileName: req.file.filename,
        },
        "Success upload a file"
      );
    } catch (err) {
      response.error(res, err, "Failed to upload file");
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { fileName } = req.params;

      if (!fileName) {
        return response.error(res, null, "File name is required");
      }

      // arahkan ke folder uploads
      const filePath = path.join(__dirname, "../../uploads", fileName);

      // cek apakah file ada
      if (!fs.existsSync(filePath)) {
        return response.error(res, null, "File not found");
      }

      // hapus file
      fs.unlinkSync(filePath);

      response.success(res, null, "File deleted successfully");
    } catch (err) {
      response.error(res, err, "Failed to detele file");
    }
  },
};
