import dotenv from "dotenv";

dotenv.config();

export const PORT: string = process.env.PORT || "";
export const CLIENT_HOST: string =
  process.env.CLIENT_HOST || "http://localhost:5001";

export const DB_HOST: string = process.env.DB_HOST || "";
export const DB_USER: string = process.env.DB_USER || "";
export const DB_PASSWORD: string = process.env.DB_PASSWORD || "";
export const DB_NAME: string = process.env.DB_NAME || "";

export const GMAIL_USER: string = process.env.GMAIL_USER || "";
export const GMAIL_PASS: string = process.env.GMAIL_APP_PASSWORD || "";
