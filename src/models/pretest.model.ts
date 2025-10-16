import * as yup from "yup";
import { connectToMySql } from "../db/connectToMySql";
import { IPretest } from "../utils/interface";
import { ResultSetHeader } from "mysql2";

// Schema validasi menggunakan Yup
export const createPretestDTO = yup.object({
  question: yup.string().required("Question is required"),
  options: yup
    .array()
    .of(yup.string().required())
    .required("Options are required")
    .min(2, "At least two options are required"),
  correct_answer: yup.string().required("Correct answer is required"),
});

export type CreatePretestDto = yup.InferType<typeof createPretestDTO>;

export const getAllPretests = async () => {
  const db = await connectToMySql();
  const [rows] = await db.query("SELECT * FROM pretests");

  return rows as IPretest[];
};

export const getOnePretest = async (id: number): Promise<IPretest | null> => {
  const db = await connectToMySql();
  const [rows]: any = await db.query("SELECT * FROM pretests WHERE id = ?", [
    id,
  ]);

  return rows.length ? (rows[0] as IPretest) : null;
};

export const createPretest = async (data: CreatePretestDto) => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await createPretestDTO.validate(data, {});

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO pretests (question, options, correct_answer) VALUES (?, ?, ?)",
    [
      validatedData.question,
      JSON.stringify(validatedData.options),
      validatedData.correct_answer,
    ]
  );

  // ✅ Ambil data yang baru dibuat berdasarkan insertId
  const [rows]: any = await db.query("SELECT * FROM pretests WHERE id = ?", [
    result.insertId,
  ]);

  if (!rows.length) {
    const err: any = new Error("Failed to retrieve created Pretests data");
    err.status = 500;
    throw err;
  }

  // ✅ Return data lengkap
  return {
    message: "Pretests created successfully",
    data: rows[0],
  };
};

export const updatePretest = async (
  id: number,
  data: CreatePretestDto
): Promise<IPretest> => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await createPretestDTO.validate(data, {});

  const db = await connectToMySql();
  const [result] = await db.query<any>(
    "UPDATE pretests SET question = ?, options = ?, correct_answer = ? WHERE id = ?",
    [
      validatedData.question,
      JSON.stringify(validatedData.options),
      validatedData.correct_answer,
      id,
    ]
  );

  if (result.affectedRows === 0) {
    const err: any = new Error("Pretest not found");
    err.status = 404;
    throw err;
  }

  const updatedPretest = await getOnePretest(id);

  if (!updatedPretest) {
    const err: any = new Error("Pretest not found after update");
    err.status = 500;
    throw err;
  }

  return updatedPretest;
};

export const deletePretest = async (id: number): Promise<void> => {
  const db = await connectToMySql();
  const [result] = await db.query<any>("DELETE FROM pretests WHERE id = ?", [
    id,
  ]);

  if (result.affectedRows === 0) {
    const err: any = new Error("Pretest not found");
    err.status = 404;
    throw err;
  }

  return;
};
