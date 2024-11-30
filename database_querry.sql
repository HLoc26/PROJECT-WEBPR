CREATE DATABASE OnlineNewspaper;

USE OnlineNewspaper;

-- Bảng Users
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    full_name VARCHAR(100),
    dob DATE,
    is_active BOOLEAN DEFAULT TRUE,
    subscription_expired_date DATE,
    premium BOOLEAN DEFAULT FALSE
);

-- Bảng Categories
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    description TEXT,
    belong_to INT,
    FOREIGN KEY (mother_id) REFERENCES Categories (category_id)
);

-- Bảng Articles
CREATE TABLE Articles (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    abstract TEXT,
    thumbnail VARCHAR(255),
    views INT DEFAULT 0,
    status ENUM('draft', 'published', 'archived', 'waiting', 'need changes') DEFAULT 'draft',
    published_date DATE,
    is_premium BOOLEAN DEFAULT FALSE,
    writer_id INT,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id),
    FOREIGN KEY (writer_id) REFERENCES Users(user_id)
);

-- Bảng Tags
CREATE TABLE Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL
);

-- Bảng Comments
CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    article_id INT,
    user_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES Articles(article_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
);

-- Bảng Notifications
CREATE TABLE Notifications (
    not_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    note_content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES Users(user_id)
);

-- Bảng ApprovalHistories
CREATE TABLE ApprovalHistories (
    approval_id INT AUTO_INCREMENT PRIMARY KEY,
    editor_id INT,
    approval_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    note_content TEXT,
    FOREIGN KEY (editor_id) REFERENCES Users(user_id)
);

-- Liên kết Articles với Tags (N-N)
CREATE TABLE ArticleTags (
    article_id INT,
    tag_id INT,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES Articles(article_id),
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id)
);

-- Phân quyền người dùng (Writer, Editor, Admin)
ALTER TABLE Users
ADD COLUMN role ENUM('writer', 'editor', 'admin') DEFAULT '';

-- Liên kết giữa bảng (Quản lý và phê duyệt)
ALTER TABLE Articles
ADD COLUMN editor_id INT,
ADD FOREIGN KEY (editor_id) REFERENCES Users(user_id);
