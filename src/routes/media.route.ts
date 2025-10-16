import express from "express";
import mediaController from "../controllers/media.controller";
import multer from "multer";
import path from "path";

// konfigurasi penyimpanan file
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  // konfigurasi penamaan file yang unik
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: diskStorage }); // konfigurasi upload
const router = express.Router(); // membuat router

router.post("/media", upload.single("file"), mediaController.upload);
router.delete("/media/:fileName", mediaController.delete);

export default router;
