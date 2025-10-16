import * as yup from "yup";
import { ResultSetHeader } from "mysql2";
import { connectToMySql } from "../db/connectToMySql";
import { IModuls } from "../utils/interface";

// Schema validasi menggunakan Yup
export const createModulDTO = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
});

export type CreateModulDto = yup.InferType<typeof createModulDTO>;

export const getAllModuls = async () => {
  const db = await connectToMySql();
  const [rows] = await db.query(`
    SELECT 
      m.id AS modul_id,
      m.title AS modul_title,
      m.description AS modul_description,
      ma.id AS materi_id,
      ma.title AS materi_title,
      ma.content AS materi_content
    FROM moduls m
    LEFT JOIN modul_materi mm ON m.id = mm.modul_id
    LEFT JOIN materis ma ON ma.id = mm.materi_id
    ORDER BY m.id;
  `);

  // Gabungkan data menjadi array nested
  const modulsMap: Record<number, any> = {};

  for (const row of rows as any[]) {
    if (!modulsMap[row.modul_id]) {
      modulsMap[row.modul_id] = {
        id: row.modul_id,
        title: row.modul_title,
        description: row.modul_description,
        materi_list: [],
      };
    }

    if (row.materi_id) {
      modulsMap[row.modul_id].materi_list.push({
        id: row.materi_id,
        title: row.materi_title,
        content: row.materi_content,
      });
    }
  }

  // Ubah map ke array
  return Object.values(modulsMap);
};

export const getOneModul = async (id: number): Promise<IModuls | null> => {
  const db = await connectToMySql();
  const [rows]: any = await db.query(
    `
    SELECT 
      m.id AS modul_id,
      m.title AS modul_title,
      m.description AS modul_description,
      ma.id AS materi_id,
      ma.title AS materi_title,
      ma.content AS materi_content
    FROM moduls m
    LEFT JOIN modul_materi mm ON m.id = mm.modul_id
    LEFT JOIN materis ma ON ma.id = mm.materi_id
    WHERE m.id = ?
    `,
    [id]
  );

  if (!rows.length) {
    const err: any = new Error("Modul not found");
    err.status = 404;
    throw err;
  }

  const modul: IModuls = {
    id: rows[0].modul_id,
    title: rows[0].modul_title,
    description: rows[0].modul_description,
    materi_list: [],
  };

  for (const row of rows) {
    if (row.materi_id) {
      modul.materi_list.push({
        id: row.materi_id,
        title: row.materi_title,
        content: row.materi_content,
        video_url: row.video_url,
      });
    }
  }

  return modul;
};

export const createModul = async (data: CreateModulDto) => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await createModulDTO.validate(data, {});

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO moduls (title, description) VALUES (?, ?)",
    [validatedData.title, validatedData.description]
  );

  // ✅ Ambil data yang baru dibuat berdasarkan insertId
  const [rows]: any = await db.query("SELECT * FROM moduls WHERE id = ?", [
    result.insertId,
  ]);

  if (!rows.length) {
    const err: any = new Error("Failed to retrieve created Moduls data");
    err.status = 500;
    throw err;
  }

  // ✅ Return data lengkap
  return {
    message: "Moduls created successfully",
    data: rows[0],
  };
};

export const updateModul = async (
  id: number,
  data: CreateModulDto
): Promise<IModuls> => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await createModulDTO.validate(data, {});

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "UPDATE moduls SET title = ?, description = ? WHERE id = ?",
    [validatedData.title, validatedData.description, id]
  );

  if (result.affectedRows === 0) {
    const err: any = new Error("Modul not found");
    err.status = 404;
    throw err;
  }

  const updatedModul = await getOneModul(id);

  if (!updatedModul) {
    const err: any = new Error("Modul not found after update");
    err.status = 404;
    throw err;
  }

  return updatedModul;
};

export const removeModul = async (id: number): Promise<void> => {
  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "DELETE FROM moduls WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    const err: any = new Error("Modul not found");
    err.status = 404;
    throw err;
  }
};
