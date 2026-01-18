-- ========================================
-- MIDNIGHT CONSTRUCTION - DATABASE SETUP
-- ========================================

-- Create database
CREATE DATABASE IF NOT EXISTS midnight_construction;
USE midnight_construction;

-- ========================================
-- QUOTATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS quotations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_type VARCHAR(100) NOT NULL,
    budget DECIMAL(15, 2) NOT NULL,
    has_plans ENUM('yes', 'no') DEFAULT 'no',
    plan_file VARCHAR(255) NULL,
    start_date DATE NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    consultation ENUM('yes', 'no') DEFAULT 'no',
    status ENUM('pending', 'contacted', 'quoted', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- ADMIN USERS TABLE (Simple authentication)
-- ========================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user
-- Username: admin
-- Password: admin123 (CHANGE THIS IN PRODUCTION!)
INSERT INTO admin_users (username, password, full_name, email) 
VALUES ('admin', '$2y$10$9Kgifx2xie4eHdhvpQmbxOPMFc4lgmztSbXnR.oNwlw75KI251pja', 'System Administrator', 'admin@midnight.com')
ON DUPLICATE KEY UPDATE password = VALUES(password);
ON DUPLICATE KEY UPDATE username = username;

-- ========================================
-- ACTIVITY LOG TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- SAMPLE DATA (Optional)
-- ========================================
-- Uncomment to insert sample quotations for testing
/*
INSERT INTO quotations (project_type, budget, has_plans, start_date, full_name, email, phone, city, consultation, status) VALUES
('Independent House', 7500000.00, 'yes', '2026-03-15', 'Rajesh Kumar', 'rajesh@example.com', '+91-9876543210', 'Bangalore', 'yes', 'pending'),
('Villa', 12000000.00, 'no', '2026-04-01', 'Priya Sharma', 'priya@example.com', '+91-9876543211', 'Mumbai', 'yes', 'contacted'),
('Apartment', 4500000.00, 'yes', '2026-02-20', 'Amit Patel', 'amit@example.com', '+91-9876543212', 'Pune', 'no', 'quoted');
*/
