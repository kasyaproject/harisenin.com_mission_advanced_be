import * as yup from "yup";
import { connectToMySql } from "../db/connectToMySql";
import { IOrder } from "../utils/interface";
import { ResultSetHeader } from "mysql2";

// Schema validasi menggunakan Yup
export const createOrderDTO = yup.object({
  user_id: yup.number().required("User ID is required"),
  product_id: yup.number().required("Product ID is required"),
  payment_id: yup.number().required("Payment ID is required"),
});

export type CreateOrderDto = yup.InferType<typeof createOrderDTO>;

export const getAllOrders = async () => {
  const db = await connectToMySql();
  const [rows] = await db.query("SELECT * FROM orders");

  return rows as IOrder[];
};

export const getOneOrder = async (id: number) => {
  const db = await connectToMySql();
  const [rows]: any = await db.query("SELECT * FROM orders WHERE id = ?", [id]);

  return rows.length ? (rows[0] as IOrder) : null;
};

export const getOrderbyUser = async (user_id: number) => {
  const db = await connectToMySql();
  const [rows]: any = await db.query("SELECT * FROM orders WHERE user_id = ?", [
    user_id,
  ]);

  return rows as IOrder[];
};

export const createOrder = async (data: CreateOrderDto) => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await createOrderDTO.validate(data, {});

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>("INSERT INTO orders SET ?", [
    validatedData,
  ]);

  // ✅ Ambil data yang baru dibuat berdasarkan insertId
  const [rows]: any = await db.query("SELECT * FROM orders WHERE id = ?", [
    result.insertId,
  ]);

  if (!rows.length) {
    const err: any = new Error("Failed to retrieve created Orders data");
    err.status = 500;
    throw err;
  }

  // ✅ Return data lengkap
  return {
    message: "Orders created successfully",
    data: rows[0],
  };
};
