import { ResultSetHeader } from "mysql2";
import { connectToMySql } from "../db/connectToMySql";
import { IProduct_Category } from "../utils/interface";

export const getCategorybyProduct = async (product_id: number) => {
  const db = await connectToMySql();
  const [result] = await db.query<any>(
    "SELECT * FROM product_categories WHERE product_id = ?",
    [product_id]
  );

  return result;
};

export const addCategorytoProduct = async (data: any) => {
  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
    [data.product_id, data.category_id]
  );

  // ✅ Ambil data yang baru dibuat berdasarkan insertId
  const [rows]: any = await db.query(
    "SELECT * FROM product_categories WHERE id = ?",
    [result.insertId]
  );

  if (!rows.length) {
    const err: any = new Error("Failed to retrieve Modul Materi course data");
    err.status = 500;
    throw err;
  }

  // ✅ Return data lengkap
  return {
    message: "Course Modul Materi successfully",
    data: rows[0],
  };
};

export const removeCategoryFromProduct = async (
  product_id: number,
  data: IProduct_Category
) => {
  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "DELETE FROM product_categories WHERE product_id = ? AND category_id = ?",
    [product_id, data.category_id]
  );

  return result;
};
