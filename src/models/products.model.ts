import * as yup from "yup";
import { ResultSetHeader } from "mysql2";
import { connectToMySql } from "../db/connectToMySql";
import { IProduct } from "../utils/interface";

// Schema validasi menggunakan Yup
export const createProductDTO = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  coverImg: yup.string().required("Image is required"),
  price: yup.number().required("Price is required"),
  discount: yup.number().required("Discount is required"),

  author_id: yup.number().required("Author ID is required"),
  pretest_id: yup.number().required("Pretest ID is required"),
});

export type CreateProductDto = yup.InferType<typeof createProductDTO>;

export const getAllProducts = async () => {
  const db = await connectToMySql();
  const [rows] = await db.query("SELECT * FROM products");

  return rows as IProduct[];
};

export const getOneProduct = async (id: number): Promise<IProduct | null> => {
  const db = await connectToMySql();
  const [rows]: any = await db.query("SELECT * FROM products WHERE id = ?", [
    id,
  ]);

  return rows.length ? (rows[0] as IProduct) : null;
};

export const createProduct = async (data: CreateProductDto) => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await createProductDTO.validate(data, {});

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO products SET ?",
    [validatedData]
  );

  // ✅ Ambil data yang baru dibuat berdasarkan insertId
  const [rows]: any = await db.query("SELECT * FROM products WHERE id = ?", [
    result.insertId,
  ]);

  if (!rows.length) {
    const err: any = new Error("Failed to retrieve created Products data");
    err.status = 500;
    throw err;
  }

  // ✅ Return data lengkap
  return {
    message: "Products created successfully",
    data: rows[0],
  };
};

export const updateProduct = async (
  id: number,
  data: CreateProductDto
): Promise<IProduct | null> => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await createProductDTO.validate(data, {});

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "UPDATE products SET ? WHERE id = ?",
    [validatedData, id]
  );

  if (result.affectedRows === 0) {
    const err: any = new Error("Product not found");
    err.status = 404;
    throw err;
  }

  const updatedProduct = await getOneProduct(id);

  if (!updatedProduct) {
    const err: any = new Error("Failed to retrieve updated product data");
    err.status = 500;
    throw err;
  }

  return updatedProduct;
};

export const removeProduct = async (id: number): Promise<boolean> => {
  const db = await connectToMySql();
  const [result]: any = await db.query("DELETE FROM products WHERE id = ?", [
    id,
  ]);

  return result.affectedRows > 0;
};
