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
INSERT INTO Categories (category_name, description, belong_to) VALUES
('Thời sự', 'Chuyên mục thời sự', NULL),
('Kinh tế', 'Chuyên mục kinh tế', NULL),
('Thể thao', 'Chuyên mục thể thao', NULL),
('Giải trí', 'Chuyên mục giải trí', NULL),
('Đời sống', 'Chuyên mục đời sống', NULL),
('Công nghệ', 'Chuyên mục công nghệ', NULL),
('Du lịch', 'Chuyên mục du lịch', NULL),
('Giáo dục', 'Chuyên mục giáo dục', NULL),
('Xe', 'Chuyên mục xe', NULL),
('Thế giới', 'Chuyên mục thế giới', NULL),
('Bất động sản', 'Chuyên mục bất động sản', NULL),
('Kinh doanh', 'Chuyên mục kinh doanh', NULL),
-- Thời sự
('Chính trị', 'Chuyên mục chính trị', 1),
('Xã hội', 'Chuyên mục xã hội', 1),
('Pháp luật', 'Chuyên mục pháp luật', 1),
-- Kinh tế
('Tài chính', 'Chuyên mục tài chính', 2),
('Bất động sản', 'Chuyên mục bất động sản', 2),
('Doanh nghiệp', 'Chuyên mục doanh nghiệp', 2),
-- Thể thao
('Bóng đá Việt Nam', 'Chuyên mục bóng đá Việt Nam', 3),
('Bóng đá quốc tế', 'Chuyên mục bóng đá quốc tế', 3),
('Chuyển nhượng', 'Chuyên mục chuyển nhượng', 3),
-- Giải trí
('Sao Việt', 'Chuyên mục sao Việt', 4),
('Âm nhạc', 'Chuyên mục âm nhạc', 4),
('Điện ảnh', 'Chuyên mục điện ảnh', 4),
-- Đời sống
('Sức khỏe', 'Chuyên mục sức khỏe', 5),
('Ẩm thực', 'Chuyên mục ẩm thực', 5),
('Làm đẹp', 'Chuyên mục làm đẹp', 5),
-- Công nghệ
('Điện thoại', 'Chuyên mục điện thoại', 6),
('Internet', 'Chuyên mục internet', 6),
('Games', 'Chuyên mục games', 6),
-- Du lịch
('Điểm đến', 'Chuyên mục điểm đến', 7),
('Ẩm thực', 'Chuyên mục ẩm thực', 7),
('Kinh nghiệm', 'Chuyên mục kinh nghiệm', 7),
-- Giáo dục
('Tuyển sinh', 'Chuyên mục tuyển sinh', 8),
('Du học', 'Chuyên mục du học', 8),
('Học tiếng Anh', 'Chuyên mục học tiếng Anh', 8),
-- Xe
('Thị trường xe', 'Chuyên mục thị trường xe', 9),
('Đánh giá xe', 'Chuyên mục đánh giá xe', 9),
('Ô tô', 'Chuyên mục ô tô', 9),
-- Thế giới
('Quân sự', 'Chuyên mục quân sự', 10),
('Người Việt 5 châu', 'Chuyên mục người Việt 5 châu', 10),
('Chính trị thế giới', 'Chuyên mục chính trị thế giới', 10),
-- Bất động sản
('Dự án', 'Chuyên mục dự án', 11),
('Thị trường', 'Chuyên mục thị trường', 11),
('Nhà đất cho thuê', 'Chuyên mục nhà đất cho thuê', 11),
-- Kinh doanh
('Khởi nghiệp', 'Chuyên mục khởi nghiệp', 12),
('Chứng khoán', 'Chuyên mục chứng khoán', 12),
('Doanh nhân', 'Chuyên mục doanh nhân', 12);

-- Insert Articles
INSERT INTO Articles (title, content, abstract, thumbnail, views, status, published_date, is_premium, writer_id, category_id, editor_id)
VALUES
    ('Xu hướng công nghệ 2024', 'Nội dung bài viết về xu hướng công nghệ năm 2024...', 'Xu hướng công nghệ nổi bật năm 2024', 'tech2024.jpg', 1200, 'published', '2024-12-01', TRUE, 1, 6, 2),
    ('Tình hình kinh tế Việt Nam', 'Phân tích tình hình kinh tế Việt Nam 2024...', 'Tóm tắt tình hình kinh tế trong năm 2024', 'economy2024.jpg', 850, 'published', '2024-12-10', FALSE, 1, 2, 2),
    ('Đời sống người dân vùng cao', 'Câu chuyện đời sống vùng cao...', 'Khám phá cuộc sống vùng cao', 'highland.jpg', 500, 'draft', NULL, FALSE, 1, 5, NULL),
    ('Chuyển nhượng bóng đá mùa đông', 'Các thương vụ chuyển nhượng đáng chú ý...', 'Thị trường chuyển nhượng mùa đông', 'football.jpg', 950, 'published', '2024-12-05', FALSE, 1, 3, 2),
    ('Ẩm thực đường phố Hà Nội', 'Những món ăn đặc sắc của Hà Nội...', 'Trải nghiệm ẩm thực đường phố tại Hà Nội', 'streetfood.jpg', 300, 'published', '2024-11-25', FALSE, 1, 5, 2);

-- Insert Tags
INSERT INTO Tags (tag_name) VALUES
    ('Công nghệ'),
    ('Kinh tế'),
    ('Đời sống'),
    ('Thể thao'),
    ('Ẩm thực'),
    ('Du lịch'),
    ('Giáo dục'),
    ('Xe cộ');

-- Link Articles with Tags
INSERT INTO ArticleTags (article_id, tag_id) VALUES
    (1, 1), -- Công nghệ cho bài "Xu hướng công nghệ 2024"
    (2, 2), -- Kinh tế cho bài "Tình hình kinh tế Việt Nam"
    (3, 3), -- Đời sống cho bài "Đời sống người dân vùng cao"
    (4, 4), -- Thể thao cho bài "Chuyển nhượng bóng đá mùa đông"
    (5, 5); -- Ẩm thực cho bài "Ẩm thực đường phố Hà Nội"

-- Insert Comments
INSERT INTO Comments (content, article_id, user_id) VALUES
    ('Bài viết rất hay và hữu ích!', 1, 4),
    ('Tôi đồng ý với quan điểm trong bài này.', 2, 4),
    ('Chưa thấy đủ chi tiết, mong bài viết được mở rộng hơn.', 3, 5),
    ('Thông tin rất thú vị, cảm ơn tác giả.', 5, 4),
    ('Cần thêm hình ảnh minh họa cho bài viết.', 4, 5);

-- Insert Notifications
INSERT INTO Notifications (sender_id, receiver_id, note_content) VALUES
    (3, 2, 'Vui lòng duyệt bài viết mới: "Đời sống người dân vùng cao".'),
    (2, 1, 'Bài viết "Tình hình kinh tế Việt Nam" đã được duyệt và đăng tải.'),
    (3, 4, 'Hãy kiểm tra bình luận của bạn trên bài viết "Xu hướng công nghệ 2024".');

-- Insert Approval Histories
INSERT INTO ApprovalHistories (editor_id, approval_date, note_content, article_id) VALUES
    (2, '2024-12-01 10:30:00', 'Bài viết đã hoàn thiện và sẵn sàng đăng.', 1),
    (2, '2024-12-10 15:45:00', 'Phân tích sâu sắc, bài viết đạt yêu cầu.', 2),
    (2, '2024-12-05 09:20:00', 'Cần chú ý hơn vào hình ảnh minh họa.', 4);