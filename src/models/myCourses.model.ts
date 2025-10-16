import * as yup from "yup";
import { connectToMySql } from "../db/connectToMySql";
import { ICourse } from "../utils/interface";
import { ResultSetHeader } from "mysql2";

// Schema validasi menggunakan Yup
export const createMyCoursesDTO = yup.object({
  user_id: yup.number().required("User ID is required"),
  product_id: yup.number().required("Product ID is required"),
  order_id: yup.number().required("Order ID is required"),
});

export type CreateMyCoursesDto = yup.InferType<typeof createMyCoursesDTO>;

export const getAllCourses = async () => {
  const db = await connectToMySql();
  const [rows] = await db.query("SELECT * FROM mycourses");

  return rows as ICourse[];
};

export const getOneCourse = async (id: number) => {
  const db = await connectToMySql();
  const [rows] = await db.query("SELECT * FROM mycourses WHERE id = ?", [id]);

  return rows as ICourse[];
};

export const createCourse = async (data: CreateMyCoursesDto) => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await createMyCoursesDTO.validate(data, {});

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO mycourses SET ?, status = 'active'",
    [validatedData]
  );

  // ✅ Ambil data yang baru dibuat berdasarkan insertId
  const [rows]: any = await db.query("SELECT * FROM mycourses WHERE id = ?", [
    result.insertId,
  ]);

  if (!rows.length) {
    const err: any = new Error("MyCourse not found");
    err.status = 404;
    throw err;
  }

  // ✅ Return data lengkap
  return {
    message: "Course created successfully",
    data: rows[0],
  };
};

export const updateCourseDone = async (id: number) => {
  const db = await connectToMySql();

  const [result] = await db.query<ResultSetHeader>(
    "UPDATE mycourses SET status = 'done' WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    const err: any = new Error("MyCourse not found");
    err.status = 404;
    throw err;
  }

  const [rows]: any = await db.query("SELECT * FROM mycourses WHERE id = ?", [
    id,
  ]);

  if (!rows.length) {
    const err: any = new Error("MyCourse not found");
    err.status = 404;
    throw err;
  }

  return {
    message: "MyCourse status updated successfully",
    data: rows[0],
  };
};
