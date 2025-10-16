import { ResultSetHeader } from "mysql2";
import { connectToMySql } from "../db/connectToMySql";
import { IModul_Product } from "../utils/interface";

export const getModulbyProduct = async (productId: number) => {
  const db = await connectToMySql();
  const [result] = await db.query<any>(
    "SELECT * FROM modul_products WHERE product_id = ?",
    [productId]
  );

  return result;
};

export const addModultoProduct = async (data: IModul_Product) => {
  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO modul_products (modul_id, product_id) VALUES (?, ?)",
    [data.modul_id, data.product_id]
  );

  // ✅ Ambil data yang baru dibuat berdasarkan insertId
  const [rows]: any = await db.query(
    "SELECT * FROM modul_products WHERE id = ?",
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

export const removeModulFromProduct = async (
  modul_id: number,
  data: IModul_Product
) => {
  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "DELETE FROM modul_products WHERE modul_id = ? AND product_id = ?",
    [modul_id, data.product_id]
  );

  return result;
};
