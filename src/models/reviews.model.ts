import * as yup from "yup";
import { connectToMySql } from "../db/connectToMySql";
import { IReview } from "../utils/interface";
import { ResultSetHeader } from "mysql2";

// Schema validasi menggunakan Yup
export const createReviewDTO = yup.object({
  rating: yup.number().required("Rating is required"),
  review: yup.string().required("Review is required"),

  user_id: yup.number().required("User ID is required"),
});

export type CreateReviewDto = yup.InferType<typeof createReviewDTO>;

export const getAllReviews = async () => {
  const db = await connectToMySql();
  const [rows] = await db.query("SELECT * FROM reviews");

  return rows as IReview[];
};

export const getOneReview = async (id: number): Promise<IReview | null> => {
  const db = await connectToMySql();
  const [rows]: any = await db.query("SELECT * FROM reviews WHERE id = ?", [
    id,
  ]);

  return rows.length ? (rows[0] as IReview) : null;
};

export const createReview = async (data: CreateReviewDto) => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await createReviewDTO.validate(data, {});

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO reviews SET ?",
    [validatedData]
  );

  // ✅ Ambil data yang baru dibuat berdasarkan insertId
  const [rows]: any = await db.query("SELECT * FROM reviews WHERE id = ?", [
    result.insertId,
  ]);

  if (!rows.length) {
    const err: any = new Error("Failed to retrieve created Reviews data");
    err.status = 500;
    throw err;
  }

  // ✅ Return data lengkap
  return {
    message: "Reviews created successfully",
    data: rows[0],
  };
};

export const updateReview = async (
  id: number,
  data: CreateReviewDto
): Promise<IReview> => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await createReviewDTO.validate(data, {});

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "UPDATE reviews SET ? WHERE id = ?",
    [validatedData, id]
  );

  if (result.affectedRows === 0) {
    const err: any = new Error("Product not found");
    err.status = 404;
    throw err;
  }

  const updatedReview = await getOneReview(id);

  if (!updatedReview) {
    throw new Error("Product not found after update");
  }

  return updatedReview;
};

export const removeReview = async (id: number) => {
  const db = await connectToMySql();
  const [result] = await db.query("DELETE FROM reviews WHERE id = ?", [id]);

  return result;
};
