import { ResultSetHeader } from "mysql2";
import { connectToMySql } from "../db/connectToMySql";
import { IMateri_Modul } from "../utils/interface";

// Ambil semua materi berdasarkan id modul
export const getMateriByModul = async (modulId: number) => {
  const db = await connectToMySql();
  const [result] = await db.query<any>(
    "SELECT materis.* FROM modul_materi JOIN materis ON modul_materi.materi_id = materis.id WHERE modul_materi.modul_id = ?",
    [modulId]
  );

  return result;
};

// Tambahkan materi ke modul
export const addMateriToModul = async (data: IMateri_Modul) => {
  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO modul_materi (modul_id, materi_id) VALUES (?, ?)",
    [data.modul_id, data.materi_id]
  );

  // ✅ Ambil data yang baru dibuat berdasarkan insertId
  const [rows]: any = await db.query(
    "SELECT * FROM modul_materi WHERE id = ?",
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

// Hapus materi dari modul
export const removeMateriFromModul = async (
  modul_id: number,
  data: IMateri_Modul
) => {
  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "DELETE FROM modul_materi WHERE modul_id = ? AND materi_id = ?",
    [modul_id, data.materi_id]
  );

  // ✅ Ambil data yang baru dibuat berdasarkan insertId
  const [rows]: any = await db.query(
    "SELECT * FROM modul_materi WHERE id = ?",
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
