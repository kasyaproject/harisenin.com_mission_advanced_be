import * as yup from "yup";
import { ResultSetHeader } from "mysql2";
import { connectToMySql } from "../db/connectToMySql";
import { ICategory } from "../utils/interface";

// Schema validasi menggunakan Yup
export const createCategoryDTO = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
});

export type CreateCategoryDto = yup.InferType<typeof createCategoryDTO>;

// Fungsi untuk berinteraksi dengan database
export const getAllCategories = async (): Promise<ICategory[]> => {
  const db = await connectToMySql();
  const [rows] = await db.query("SELECT * FROM categories");

  return rows as ICategory[];
};

export const getOneCategory = async (id: number): Promise<ICategory | null> => {
  const db = await connectToMySql();
  const [rows]: any = await db.query("SELECT * FROM categories WHERE id = ?", [
    id,
  ]);

  return rows.length ? (rows[0] as ICategory) : null;
};

export const createCategory = async (data: CreateCategoryDto) => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await createCategoryDTO.validate(data, {});

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO categories (name, description) VALUES (?, ?)",
    [validatedData.name, validatedData.description]
  );

  // ✅ Ambil data yang baru dibuat berdasarkan insertId
  const [rows]: any = await db.query("SELECT * FROM categories WHERE id = ?", [
    result.insertId,
  ]);

  if (!rows.length) {
    const err: any = new Error("Failed to retrieve created Categories data");
    err.status = 500;
    throw err;
  }

  // ✅ Return data lengkap
  return {
    message: "Categories created successfully",
    data: rows[0],
  };
};

export const updateCategory = async (
  id: number,
  data: CreateCategoryDto
): Promise<ICategory> => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await createCategoryDTO.validate(data, {});

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "UPDATE categories SET name = ?, description = ? WHERE id = ?",
    [validatedData.name, validatedData.description, id]
  );

  if (result.affectedRows === 0) {
    const err: any = new Error("Category not found");
    err.status = 404;
    throw err;
  }

  const updatedCategory = await getOneCategory(id);

  if (!updatedCategory) {
    const err: any = new Error("Category not found after update");
    err.status = 404;
    throw err;
  }

  return updatedCategory;
};

export const deleteCategory = async (id: number): Promise<void> => {
  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "DELETE FROM categories WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    const err: any = new Error("Category not found");
    err.status = 404;
    throw err;
  }
};
