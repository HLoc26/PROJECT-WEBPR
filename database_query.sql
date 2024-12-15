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
    user_role ENUM('writer', 'editor', 'admin', 'reader') DEFAULT 'reader',
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
    FOREIGN KEY (belong_to) REFERENCES Categories (category_id)
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
    editor_id INT,
    FOREIGN KEY (writer_id) REFERENCES Users(user_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id),
    FOREIGN KEY (editor_id) REFERENCES Users(user_id)
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
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
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
    article_id INT,
    FOREIGN KEY (editor_id) REFERENCES Users(user_id),
    FOREIGN KEY (article_id) REFERENCES Articles(article_id)
);

-- Liên kết Articles với Tags (N-N)
CREATE TABLE ArticleTags (
    article_id INT,
    tag_id INT,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES Articles(article_id),
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id)
);

ALTER TABLE Users ADD managed_category_id INT;
ALTER TABLE Users ADD FOREIGN KEY (managed_category_id) REFERENCES Categories(category_id);

-- Phake data
USE OnlineNewspaper;

-- Insert Users
INSERT INTO Users (username, password, email, full_name, dob, user_role, is_active, subscription_expired_date, premium)
VALUES
    ('writer1', 'password123', 'writer1@example.com', 'John Doe', '1985-06-15', 'writer', TRUE, '2025-12-31', FALSE),
    ('editor1', 'password123', 'editor1@example.com', 'Jane Smith', '1978-03-22', 'editor', TRUE, NULL, FALSE),
    ('admin1', 'password123', 'admin1@example.com', 'Admin User', '1990-01-01', 'admin', TRUE, NULL, FALSE),
    ('reader1', 'password123', 'reader1@example.com', 'Mike Johnson', '2000-07-11', 'reader', TRUE, '2024-06-01', TRUE),
    ('reader2', 'password123', 'reader2@example.com', 'Sarah Lee', '1992-11-20', 'reader', TRUE, NULL, FALSE);

-- Insert Categories
INSERT INTO Categories (category_name, description, belong_to)
VALUES
    ('Technology', 'Articles related to technology', NULL),
    ('Mobile', 'Articles related to mobile devices', 1),
    ('AI', 'Articles related to artificial intelligence', 1),
    ('Health', 'Articles related to health and wellness', NULL),
    ('Fitness', 'Articles related to physical fitness', 4);

-- Insert Articles
INSERT INTO Articles (title, content, abstract, thumbnail, views, status, published_date, is_premium, writer_id, category_id, editor_id)
VALUES
    ('The Future of AI', 'Full content about AI...', 'A brief look into the future of AI', 'thumbnail1.jpg', 100, 'published', '2024-12-01', TRUE, 1, 3, 2),
    ('Top Mobile Devices in 2024', 'Full content about mobile devices...', 'A list of top mobile devices in 2024', 'thumbnail2.jpg', 150, 'published', '2024-11-15', FALSE, 1, 2, 2),
    ('Staying Fit in the Winter', 'Full content about fitness in winter...', 'How to stay fit during winter', 'thumbnail3.jpg', 80, 'published', '2024-12-02', FALSE, 1, 5, 2),
    ('AI and Healthcare', 'Full content about AI in healthcare...', 'The impact of AI on healthcare', 'thumbnail4.jpg', 120, 'waiting', NULL, FALSE, 1, 3, 2),
    ('Benefits of Morning Exercise', 'Full content about morning exercises...', 'Why morning exercise is beneficial', 'thumbnail5.jpg', 60, 'draft', NULL, FALSE, 1, 5, 2);

-- Insert Tags
INSERT INTO Tags (tag_name)
VALUES
    ('AI'), 
    ('Mobile'), 
    ('Health'), 
    ('Fitness'), 
    ('Technology');

-- Insert Comments
INSERT INTO Comments (content, article_id, user_id)
VALUES
    ('Great insights on AI!', 1, 4),
    ('I love this list of mobile devices.', 2, 5),
    ('Thanks for the fitness tips!', 3, 4);

-- Insert Notifications
INSERT INTO Notifications (sender_id, receiver_id, note_content)
VALUES
    (2, 1, 'Please make corrections to your latest article on AI and Healthcare.'),
    (1, 4, 'New article on AI published. Check it out!');

-- Insert ApprovalHistories
INSERT INTO ApprovalHistories (editor_id, approval_date, note_content, article_id)
VALUES
    (2, '2024-12-01 10:00:00', 'Approved for publishing', 1),
    (2, '2024-11-15 09:30:00', 'Approved for publishing', 2);

-- Insert ArticleTags
INSERT INTO ArticleTags (article_id, tag_id)
VALUES
    (1, 1),  -- The Future of AI -> AI
    (1, 5),  -- The Future of AI -> Technology
    (2, 2),  -- Top Mobile Devices in 2024 -> Mobile
    (2, 5),  -- Top Mobile Devices in 2024 -> Technology
    (3, 4),  -- Staying Fit in the Winter -> Fitness
    (4, 1),  -- AI and Healthcare -> AI
    (4, 3),  -- AI and Healthcare -> Health
    (5, 4);  -- Benefits of Morning Exercise -> Fitness
