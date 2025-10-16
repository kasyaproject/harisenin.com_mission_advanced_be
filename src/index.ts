import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { PORT } from "./utils/env";
import { connectToMySql } from "./db/connectToMySql";

import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import productRouter from "./routes/products.route";
import reviewRouter from "./routes/review.route";
import categoryRouter from "./routes/category.route";
import tutorRouter from "./routes/tutor.route";
import pretestRouter from "./routes/pretest.route";
import materiRouter from "./routes/materi.route";
import modulRouter from "./routes/modul.route";
import modul_materiRouter from "./routes/modul_materi.route";
import modul_productRouter from "./routes/modul_product.route";
import paymentRouter from "./routes/payment.route";
import orderRouter from "./routes/order.route";
import myCourseRouter from "./routes/myCourse.route";
import product_categoryRouter from "./routes/product_categories.route";
import product_reviewsRouter from "./routes/product_reviews.route";
import mediaRouter from "./routes/media.route";

async function init() {
  try {
    // Koneksi ke MySQL
    connectToMySql();

    const app = express();

    dotenv.config();
    app.use(cors());
    app.use(bodyParser.json()); // Untuk membaca json dari req.body
    app.use(express.urlencoded({ extended: true })); // (Opsional) Untuk form-data

    app.get("/", (req, res) => {
      res.status(200).json({
        message: "Welcome to API for App Video Belajar by Andika Syamsiana ☕",
      });
    });
    // Import routes
    app.use("/api", [
      authRouter,
      userRouter,
      productRouter,
      reviewRouter,
      categoryRouter,
      tutorRouter,
      pretestRouter,
      materiRouter,
      modulRouter,
      modul_materiRouter,
      modul_productRouter,
      paymentRouter,
      orderRouter,
      myCourseRouter,
      product_categoryRouter,
      product_reviewsRouter,
      mediaRouter,
    ]);

    // Jalankan server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
