import * as yup from "yup";
import { connectToMySql } from "../db/connectToMySql";
import { ITutor } from "../utils/interface";
import { ResultSetHeader } from "mysql2";

// Schema validasi menggunakan Yup
export const createTutorDTO = yup.object({
  fullName: yup.string().required("Name is required"),
  avatarImg: yup.string().required("Avatar Image is required"),
  title: yup.string().required("Title is required"),
  companyName: yup.string().required("Company Name is required"),
  jobTitle: yup.string().required("Job Title is required"),
});

export type CreateTutorDto = yup.InferType<typeof createTutorDTO>;

export const getAllTutors = async (): Promise<ITutor[]> => {
  const db = await connectToMySql();
  const [rows] = await db.query("SELECT * FROM tutors");

  return rows as ITutor[];
};

export const getOneTutor = async (id: number): Promise<ITutor | null> => {
  const db = await connectToMySql();
  const [rows]: any = await db.query("SELECT * FROM tutors WHERE id = ?", [id]);

  return rows.length ? (rows[0] as ITutor) : null;
};

export const createTutor = async (data: CreateTutorDto) => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await createTutorDTO.validate(data, {});

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO tutors (fullName, avatarImg, title, companyName, jobTitle) VALUES (?, ?, ?, ?, ?)",
    [
      validatedData.fullName,
      validatedData.avatarImg,
      validatedData.title,
      validatedData.companyName,
      validatedData.jobTitle,
    ]
  );

  // ✅ Ambil data yang baru dibuat berdasarkan insertId
  const [rows]: any = await db.query("SELECT * FROM tutors WHERE id = ?", [
    result.insertId,
  ]);

  if (!rows.length) {
    const err: any = new Error("Failed to retrieve created Tutors data");
    err.status = 500;
    throw err;
  }

  // ✅ Return data lengkap
  return {
    message: "Tutors created successfully",
    data: rows[0],
  };
};

export const updateTutor = async (
  id: number,
  data: CreateTutorDto
): Promise<ITutor> => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await createTutorDTO.validate(data, {});

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "UPDATE tutors SET fullName = ?, avatarImg = ?, title = ?, companyName = ?, jobTitle = ? WHERE id = ?",
    [
      validatedData.fullName,
      validatedData.avatarImg,
      validatedData.title,
      validatedData.companyName,
      validatedData.jobTitle,
      id,
    ]
  );

  if (result.affectedRows === 0) {
    const err: any = new Error("Tutor not found");
    err.status = 404;
    throw err;
  }

  const updatedTutor = await getOneTutor(id);

  if (!updatedTutor) {
    const err: any = new Error("Failed to retrieve updated Tutor data");
    err.status = 500;
    throw err;
  }

  return updatedTutor;
};

export const deleteTutor = async (id: number): Promise<void> => {
  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "DELETE FROM tutors WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Tutor not found");
  }
};
