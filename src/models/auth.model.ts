import * as yup from "yup";
import { ResultSetHeader } from "mysql2";
import { connectToMySql } from "../db/connectToMySql";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

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

export const loginUserDto = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginUserDto = yup.InferType<typeof loginUserDto>;
export type RegisterUserDto = yup.InferType<typeof registerUserDto>;

export const registerUser = async (data: RegisterUserDto) => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await registerUserDto.validate(data, {});

  // Hash Password
  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO users (fullName, userName, email, noTelp, password) VALUES (?, ?, ?, ?, ?)",
    [
      validatedData.fullName,
      validatedData.userName,
      validatedData.email,
      validatedData.noTelp,
      hashedPassword,
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

export const loginUser = async (data: LoginUserDto) => {
  // ✅ Validasi data menggunakan Yup
  const validatedData = await loginUserDto.validate(data, {});

  // ✅ Cari user berdasarkan email
  const db = await connectToMySql();
  const [rows]: any = await db.query("SELECT * FROM users WHERE email = ? ", [
    validatedData.email,
  ]);

  // Jika user tidak ditemukan
  if (!rows.length) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
  }

  // Jika user belum terverifikasi
  if (rows[0].isVerified === "unverified") {
    const err: any = new Error("User not verified");
    err.status = 401;
    throw err;
  }

  // simpan data user ke const user jika lolos validasi
  const user = rows[0];

  // ✅ Verifikasi password
  const isPasswordCorrect = await bcrypt.compare(
    validatedData.password,
    user.password
  );

  if (!isPasswordCorrect) {
    const err: any = new Error("Invalid password");
    err.status = 401;
    throw err;
  }

  // Jika lolos validasi maka Generta Token jwt
  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  // ✅ Return data lengkap
  return {
    message: "Login User successfully",
    data: { ...user, accessToken: token },
  };
};

export const checkMe = async (id: number) => {
  // ✅ Cari user berdasarkan email
  const db = await connectToMySql();
  const [rows]: any = await db.query("SELECT * FROM users WHERE id = ?", [id]);

  if (!rows.length) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return rows[0];
};
