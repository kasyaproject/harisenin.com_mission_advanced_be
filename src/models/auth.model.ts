import * as yup from "yup";
import { ResultSetHeader } from "mysql2";
import { connectToMySql } from "../db/connectToMySql";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import nodemailer from "nodemailer";
import { renderMail, sendMail } from "../utils/mail/mail";
import { CLIENT_HOST, GMAIL_USER } from "../utils/env";

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
  createdAt: yup.date().default(new Date()),
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

  // ✅ Generate code verifikasi
  const verifiedCode = await bcrypt.hash(validatedData.userName, 10);

  const db = await connectToMySql();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO users (fullName, userName, email, noTelp, password, verifiedCode) VALUES (?, ?, ?, ?, ?, ?)",
    [
      validatedData.fullName,
      validatedData.userName,
      validatedData.email,
      validatedData.noTelp,
      hashedPassword,
      verifiedCode,
    ]
  );

  // ✅ Ambil data yang baru dibuat berdasarkan insertId
  const [rows]: any = await db.query("SELECT * FROM users WHERE id = ?", [
    result.insertId,
  ]);

  if (!rows.length) {
    throw new Error("Failed to retrieve Registered User data");
  }

  // Kirim data user ke ejs untuk dikirim ke email
  const contentMail = await renderMail("registration-success.ejs", {
    userName: validatedData.userName,
    fullName: validatedData.fullName,
    email: validatedData.email,
    createdAt: validatedData.createdAt,
    verifiedCode: `${CLIENT_HOST}/api/auth/activation?code=${verifiedCode}`,
  });

  // Kirim email ke user
  await sendMail({
    from: GMAIL_USER,
    to: validatedData.email,
    subject: "Registrasi Berhasil - Aktivasi akun anda !",
    content: contentMail,
  });

  // ✅ Return data lengkap
  return {
    verifiedCode: rows[0].verifiedCode,
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
    accessToken: token,
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

export const activationEmail = async (code: string) => {
  const db = await connectToMySql();

  const [rows]: any = await db.query(
    "SELECT * FROM users WHERE verifiedCode = ?",
    [code]
  );

  // Jika user tidak ditemukan
  if (!rows.length) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
  }

  // Jika user sudah terverifikasi
  if (rows[0].isVerified === "verified") {
    const err: any = new Error("User already verified");
    err.status = 400;
    throw err;
  }

  const [result] = await db.query<ResultSetHeader>(
    "UPDATE users SET isVerified = 'verified' WHERE verifiedCode = ?",
    [code]
  );

  if (result.affectedRows === 0) {
    const err: any = new Error("User not found result");
    err.status = 404;
    throw err;
  }

  // ✅ Return data lengkap
  const [data]: any = await db.query("SELECT * FROM users WHERE id = ?", [
    rows[0].id,
  ]);

  if (!data.length) {
    const err: any = new Error("Failed to retrieve Registered User data");
    err.status = 500;
    throw err;
  }

  return data[0];
};
