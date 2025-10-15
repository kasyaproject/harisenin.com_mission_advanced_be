CREATE DATABASE IF NOT EXISTS video_belajar_andika;
USE video_belajar_andika;

-- Create table for users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100) NOT NULL,
  userName VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  noTelp VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student') DEFAULT 'student',
  profileImg VARCHAR(255) DEFAULT '/image/avatar-men.png',
  isVerified ENUM('verified', 'unverified') DEFAULT 'unverified',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Seed initial users
INSERT INTO users (fullName,userName, email, noTelp, password, role, profileImg)
VALUES
('Admin Utama','adminutama', 'admin@example.com', '081234567890', '$2b$10$uD9WkbMKmBqC1TzP6HR4Ve3rTg9V88oItg.Bo6FzRjKksSR7bG9u2', 'admin', '/image/avatar-men.png'),
('Student 1','student1', 'student@example.com', '089876543210', '$2b$10$uD9WkbMKmBqC1TzP6HR4Ve3rTg9V88oItg.Bo6FzRjKksSR7bG9u2', 'student', '/image/avatar-women.png');
-- Password for both users is '123456' --

-- Create table for categories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed initial categories
INSERT INTO categories (name, description)
VALUES
('Digital & Teknologi', 'Kategori ini berfokus pada dunia digital, pemrograman, teknologi informasi, dan inovasi berbasis internet. Cocok untuk kamu yang ingin belajar coding, data science, AI, atau keamanan siber.'),
('Pemasaran', 'Kategori ini membahas strategi pemasaran digital, media sosial, branding, dan analisis pasar untuk membantu bisnis tumbuh secara efektif.'),
('Manajemen Bisnis', 'Berisi materi tentang pengelolaan bisnis, kepemimpinan, pengambilan keputusan, serta strategi bisnis modern untuk wirausahawan dan profesional.'),
('Pengembangan Diri', 'Fokus pada peningkatan kemampuan pribadi, termasuk komunikasi, produktivitas, mindset, dan soft skill yang dibutuhkan di dunia kerja.'),
('Desain', 'Membahas prinsip desain grafis, UI/UX, ilustrasi, dan tools kreatif seperti Figma, Adobe, dan lainnya untuk menciptakan karya visual yang menarik.');

-- Create table for tutors
CREATE TABLE tutors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100) NOT NULL,
  avatarImg VARCHAR(255) NOT NULL,
  title VARCHAR(100) NOT NULL,
  companyName VARCHAR(100) NOT NULL,
  jobTitle VARCHAR(100) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed initial tutors
INSERT INTO tutors (fullName, avatarImg, title, companyName, jobTitle)
VALUES
('John Doe', '/image/avatar-men.png', 'Full Stack Developer', 'ABC Company', 'Software Engineer'),
('Jane Smith', '/image/avatar-women.png', 'Data Scientist', 'XYZ Inc.', 'Data Analyst'),
('Alice Johnson', '/image/avatar-women2.png', 'UI/UX Designer', 'Design Studio', 'Lead Designer');

-- Create table for pretests
CREATE TABLE pretests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  options JSON NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed initial pretests
INSERT INTO pretests (question, options, correct_answer)
VALUES
('Apa itu JavaScript?', 
  JSON_ARRAY(
    'Bahasa pemrograman untuk pengembangan web',
    'Sistem manajemen basis data',
    'Bahasa pemrograman untuk pengembangan aplikasi mobile',
    'Bahasa pemrograman untuk pengembangan aplikasi desktop'
  ),
  'Bahasa pemrograman untuk pengembangan web'
),
('Apa itu HTML?', 
  JSON_ARRAY(
    'Bahasa pemrograman untuk pengembangan web',
    'Bahasa markup untuk membuat struktur halaman web',
    'Bahasa pemrograman untuk pengembangan aplikasi mobile',
    'Bahasa pemrograman untuk pengembangan aplikasi desktop'
  ),
  'Bahasa markup untuk membuat struktur halaman web'
);

-- Create table for materis
CREATE TABLE materis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  video_url VARCHAR(255) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed initial materis
INSERT INTO materis (title, content, video_url)
VALUES
('Belajar Dasar HTML', 'Materi ini membahas dasar-dasar HTML, termasuk struktur halaman web, elemen HTML, dan cara membuat halaman web sederhana.', 'https://example.com/video/html'),
('Belajar Dasar JavaScript', 'Materi ini membahas dasar-dasar JavaScript, termasuk variabel, tipe data, fungsi, dan manipulasi DOM.', 'https://example.com/video/javascript');

-- Create table for moduls
CREATE TABLE moduls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed initial moduls
INSERT INTO moduls (title, description)
VALUES
('Modul HTML Dasar', 'Membahas pengenalan HTML dan elemen dasar.'),
('Modul JavaScript Dasar', 'Membahas dasar-dasar JavaScript dan fungsi.');

-- Create table for modul_materi
CREATE TABLE modul_materi (
  modul_id INT NOT NULL,
  materi_id INT NOT NULL,

  PRIMARY KEY (modul_id, materi_id),
  FOREIGN KEY (modul_id) REFERENCES moduls(id) ON DELETE CASCADE,
  FOREIGN KEY (materi_id) REFERENCES materis(id) ON DELETE CASCADE
);

-- Seed initial modul_materi
INSERT INTO modul_materi (modul_id, materi_id)
VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2);

-- Create table for products
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  coverImg VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) NOT NULL,
  author_id INT NOT NULL,
  pretest_id INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (author_id) REFERENCES tutors(id)  ON DELETE CASCADE,
  FOREIGN KEY (pretest_id) REFERENCES pretests(id)  ON DELETE CASCADE
);

-- Seed initial products
INSERT INTO products (title, description, coverImg, price, discount, author_id, pretest_id)
VALUES
('Belajar React Dasar', 'Pelajari fundamental React mulai dari konsep komponen, props, state, hingga membuat aplikasi sederhana. Materi ini dirancang khusus untuk pemula yang ingin memahami dasar React sebelum melangkah ke level yang lebih lanjut.', '/image/cover/1.jpg', 100000, 20, 1, 1),
('Strategi Marketing', 'Kenali strategi pemasaran modern dengan pendekatan digital dan konvensional. Kursus ini membahas cara memahami target pasar, menyusun kampanye yang efektif, serta meningkatkan brand awareness untuk bisnis Anda.', '/image/cover/2.jpg', 50000, 20, 2, 1),
('Desain UI/UX', 'Pelajari prinsip dasar desain antarmuka dan pengalaman pengguna. Materi meliputi wireframing, prototyping, hingga praktik terbaik dalam menciptakan produk digital yang estetis sekaligus mudah digunakan.', '/image/cover/3.jpg', 150000, 20, 3, 1),
('Manajemen Proyek Agile', 'Pahami cara mengelola proyek menggunakan metode Agile. Kursus ini membahas Scrum, Sprint Planning, serta bagaimana membangun kolaborasi tim yang produktif untuk mencapai target dengan fleksibilitas tinggi.', '/image/cover/4.jpg', 200000, 20, 1, 1),
('SEO untuk Pemula', 'Belajar langkah-langkah meningkatkan visibilitas website di mesin pencari. Anda akan memahami dasar-dasar keyword research, optimasi on-page, serta strategi link building untuk mendapatkan peringkat yang lebih baik.', '/image/cover/5.jpg', 100000, 20, 2, 1),
('Photoshop Dasar', 'Pelajari keterampilan dasar menggunakan Adobe Photoshop. Materi meliputi teknik cropping, color adjustment, retouching foto, hingga membuat desain grafis sederhana yang siap digunakan dalam proyek nyata.', '/image/cover/6.jpg', 150000, 20, 3, 1),
('Keterampilan Public Speaking', 'Tingkatkan kemampuan berbicara di depan umum dengan percaya diri. Kursus ini memberikan tips mengenai struktur presentasi, bahasa tubuh, serta cara mengatasi rasa gugup agar komunikasi lebih efektif.', '/image/cover/7.jpg', 200000, 20, 1, 1),
('Data Analysis dengan Excel', 'Kuasi teknik analisis data menggunakan Microsoft Excel. Dari fungsi dasar, pivot table, hingga visualisasi data, kursus ini membantu Anda mengambil keputusan bisnis berdasarkan data yang akurat.', '/image/cover/8.jpg', 150000, 20, 2, 1),
('Branding & Positioning', 'Pelajari bagaimana membangun identitas merek yang kuat. Kursus ini membahas strategi brand positioning, storytelling, dan cara membedakan produk Anda di pasar yang kompetitif.', '/image/cover/9.jpg', 100000, 20, 3, 1);


-- Create table for riview
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rating DECIMAL(10, 2) NOT NULL,
  review TEXT NOT NULL,
  user_id INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id)  ON DELETE CASCADE
);

-- Seed initial Riview
INSERT INTO reviews (rating, review, user_id)
VALUES
(4.5, 'Materi yang sangat membantu dalam memahami konsep React. Pembahasan yang jelas dan mudah dipahami.', 1),
(4.0, 'Kursus ini membantu saya memahami dasar-dasar React. Terima kasih!', 2),
(4.8, 'Materi yang sangat menarik dan membantu meningkatkan kemampuan React. Terima kasih!', 2),
(4.2, 'Materi yang sangat membantu dalam memahami konsep React. Pembahasan yang jelas dan mudah dipahami.', 1),
(4.5, 'Kursus ini membantu saya memahami dasar-dasar React. Terima kasih!', 2),
(4.0, 'Materi yang sangat menarik dan membantu meningkatkan kemampuan React. Terima kasih!', 2),
(4.8, 'Materi yang sangat membantu dalam memahami konsep React. Pembahasan yang jelas dan mudah dipahami.', 1),
(4.5, 'Kursus ini membantu saya memahami dasar-dasar React. Terima kasih!', 2);

-- Create table for payments
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(100) NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  payment_url VARCHAR(255) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);

-- Seed initial Payments
INSERT INTO payments (price, discount, total_price, status, payment_method, payment_url)
VALUES
(100000, 0, 100000, 'pending', 'bank transfer', 'https://example.com/bank-transfer'),
(150000, 0, 150000, 'cancelled', 'bank transfer', 'https://example.com/bank-transfer'),
(200000, 0, 200000, 'paid', 'bank transfer', 'https://example.com/bank-transfer'),
(250000, 0, 250000, 'paid', 'bank transfer', 'https://example.com/bank-transfer');

-- Create table for orders
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  payment_id INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);

-- Seed initial Orders
INSERT INTO orders (user_id, product_id, payment_id)
VALUES
(2, 1, 1),
(2, 2, 2),
(2, 3, 3),
(2, 4, 4);

-- Create table for myCourses
CREATE TABLE myCourses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  order_id INT NOT NULL,
  status VARCHAR(100) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Seed initial myCourses
INSERT INTO myCourses (user_id, product_id, order_id, status)
VALUES
(2, 1, 1, 'active'),
(2, 2, 2, 'done'),
(2, 3, 3, 'done'),
(2, 4, 4, 'active');

-- Create table for modul_products
CREATE TABLE modul_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  modul_id INT NOT NULL,
  product_id INT NOT NULL,

  FOREIGN KEY (modul_id) REFERENCES moduls(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Seed initial modul_products
INSERT INTO modul_products (modul_id, product_id)
VALUES
(1, 1),
(2, 1),
(1, 2),
(2, 2),
(1, 3),
(2, 3),
(1, 4),
(2, 4),
(1, 5),
(2, 5),
(1, 6),
(2, 7);

-- Create table for product_categories
CREATE TABLE product_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  category_id INT NOT NULL,

  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Seed initial product_categories
INSERT INTO product_categories (product_id, category_id)
VALUES
(1, 2),
(1, 4),
(2, 1),
(2, 5),
(3, 2),
(3, 3),
(4, 1),
(4, 4),
(5, 3),
(5, 5),
(6, 2),
(6, 5),
(7, 1),
(7, 3),
(8, 4),
(8, 5),
(9, 2),
(9, 5);

-- Create table for product_reviews
CREATE TABLE product_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  review_id INT NOT NULL,

  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

-- Seed initial product_reviews
INSERT INTO product_reviews (product_id, review_id)
VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5),
(3, 6),
(4, 7),
(4, 8);