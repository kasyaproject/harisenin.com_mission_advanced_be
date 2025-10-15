export interface IUser {
  id?: number;
  fullName: string;
  userName: string;
  email: string;
  noTelp: string;
  profileImg: string;
  password: string;
  confirmPassword: string;
  role: "admin" | "student";
  isVerified: "verified" | "unverified";
}

export interface ICategory {
  id: number;
  name: string;
  description: string;
}

export interface ITutor {
  id: number;
  fullName: string;
  avatarImg: string;
  title: string;
  companyName: string;
  jobTitle: string;
}

export interface IPretest {
  id: number;
  question: string;
  options: string[]; // Simpan sebagai JSON string
  correct_answer: string;
}

export interface IMateri {
  id: number;
  title: string;
  content: string;
  video_url: string;
}

export interface IModuls {
  id: number;
  title: string;
  description: string;
  materi_list: IMateri[];
}

export interface IMateri_Modul {
  id: number;
  modul_id: number;
  materi_id: number;
}

export interface IModul_Product {
  id: number;
  modul_id: number;
  product_id: number;
}

export interface IProduct_Category {
  id: number;
  product_id: number;
  category_id: number;
}

export interface IProduct_Review {
  id: number;
  product_id: number;
  review_id: number;
}

export interface IProduct {
  id: number;
  title: string;
  description: string;
  coverImg: string;
  price: number;
  discount: number;
  author_id: number;
  pretest_id: number;
}

export interface IReview {
  id: number;
  rating: number;
  review: string;
  user_id: number;
}

export interface IPayment {
  id: number;
  price: number;
  discount: number;
  total_price: number;
  status: string;
  payment_method: string;
  payment_url: string;
}

export interface IOrder {
  id: number;
  user_id: number;
  product_id: number;
  payment_id: number;
}

export interface ICourse {
  id: number;
  user_id: number;
  product_id: number;
  order_id: number;
  status: string;
}
