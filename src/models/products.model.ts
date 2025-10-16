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

export const getAllProducts = async (params: any) => {
  const filter = params.filter || null;
  const sort = params.sort || "created_at";
  const search = params.search || "";

  const db = await connectToMySql();

  let query = `
    SELECT 
      products.*, 
      GROUP_CONCAT(DISTINCT categories.name) AS category_names
    FROM products 
    INNER JOIN product_categories  ON products.id = product_categories.product_id
    INNER JOIN categories ON product_categories.category_id = categories.id
    WHERE (products.title LIKE ? OR products.description LIKE ?)
  `;

  const values: any[] = [`%${search}%`, `%${search}%`];

  // Filter kategori jika ada
  if (filter) {
    query += " AND categories.name = ?";
    values.push(filter);
  }

  // Urutkan berdasarkan kolom tertentu dengan ASC
  query += `
    GROUP BY products.id
    ORDER BY products.${sort} ASC
  `;

  const [rows]: any = await db.query(query, values);

  // Ubah hasil kategori dari string ke array
  const products = rows.map((product: any) => ({
    ...product,
    category_names: product.category_names
      ? product.category_names.split(",")
      : [],
  }));

  return products as IProduct[];
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
