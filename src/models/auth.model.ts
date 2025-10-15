import * as yup from "yup";
import { ResultSetHeader } from "mysql2";
import { connectToMySql } from "../db/connectToMySql";

// Schema validasi menggunakan Yup
export const registerUserDto = yup.object({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters"),
  userName: yup
    .string()
    .required("User name is required")
    .min(3, "User name must be at least 3 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  noTelp: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone must contain only digits"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export type RegisterUserDto = yup.InferType<typeof registerUserDto>;

export const registerUser = async (data: RegisterUserDto) => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await registerUserDto.validate(data, {});

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO users (fullName, userName, email, noTelp, password) VALUES (?, ?, ?, ?, ?)",
    [
      validatedData.fullName,
      validatedData.userName,
      validatedData.email,
      validatedData.noTelp,
      validatedData.password,
    ]
  );

  // ✅ Ambil data yang baru dibuat berdasarkan insertId
  const [rows]: any = await db.query("SELECT * FROM users WHERE id = ?", [
    result.insertId,
  ]);

  if (!rows.length) {
    throw new Error("Failed to retrieve Registered User data");
  }

  // ✅ Return data lengkap
  return {
    message: "Registered User successfully",
    data: rows[0],
  };
};
