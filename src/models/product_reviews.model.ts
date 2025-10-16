import { ResultSetHeader } from "mysql2";
import { connectToMySql } from "../db/connectToMySql";
import { IProduct_Review } from "../utils/interface";

export const getReviewbyProduct = async (product_id: number) => {
  const db = await connectToMySql();
  const [result] = await db.query<any>(
    "SELECT * FROM product_reviews WHERE product_id = ?",
    [product_id]
  );

  return result;
};

export const addReviewtoProduct = async (data: IProduct_Review) => {
  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO product_reviews (product_id, review_id) VALUES (?, ?)",
    [data.product_id, data.review_id]
  );

  // ✅ Ambil data yang baru dibuat berdasarkan insertId
  const [rows]: any = await db.query(
    "SELECT * FROM product_reviews WHERE id = ?",
    [result.insertId]
  );

  if (!rows.length) {
    const err: any = new Error("Failed to retrieve Review Product course data");
    err.status = 500;
    throw err;
  }

  // ✅ Return data lengkap
  return {
    message: "Review Product added successfully",
    data: rows[0],
  };
};

export const removeReviewFromProduct = async (
  product_id: number,
  data: IProduct_Review
) => {
  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "DELETE FROM product_reviews WHERE product_id = ? AND review_id = ?",
    [product_id, data.review_id]
  );

  return result;
};
