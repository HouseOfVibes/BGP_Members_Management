-- BGP Members Management Database Schema
-- Compatible with MySQL 8.0+ and PlanetScale

-- ==========================================
-- 1. MEMBERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS members (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Personal Information
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,

    -- Address Information
    street_address VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,

    -- Church Information
    join_date DATE DEFAULT (CURRENT_DATE),
    baptism_date DATE,
    member_status ENUM('new_member', 'active', 'inactive') DEFAULT 'new_member',

    -- Family Information
    marital_status ENUM('single', 'married', 'divorced', 'widowed'),
    spouse_name VARCHAR(100),

    -- Permissions & Consent
    photo_consent BOOLEAN DEFAULT FALSE,
    social_media_consent BOOLEAN DEFAULT FALSE,
    email_consent BOOLEAN DEFAULT TRUE,

    -- Additional Information
    registration_method ENUM('online', 'manual') DEFAULT 'online',
    referral_source VARCHAR(255),
    previous_church VARCHAR(255),
    admin_notes TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Indexes for performance
    INDEX idx_email (email),
    INDEX idx_status (member_status),
    INDEX idx_join_date (join_date),
    INDEX idx_name (last_name, first_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 2. CHILDREN TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS children (
    id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT NOT NULL,

    -- Child Information
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'not_specified') DEFAULT 'not_specified',

    -- Permissions
    parental_consent BOOLEAN DEFAULT FALSE,
    photo_consent BOOLEAN DEFAULT FALSE,

    -- Additional Information
    special_notes TEXT,
    allergies TEXT,
    medical_info TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key relationship
    FOREIGN KEY (parent_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 3. USERS TABLE (Admin Users)
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Authentication
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    -- User Information
    full_name VARCHAR(100),
    role ENUM('admin', 'staff', 'viewer') DEFAULT 'staff',
    is_active BOOLEAN DEFAULT TRUE,

    -- Password Reset
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,

    -- Session Management
    last_login TIMESTAMP NULL,
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 4. ACTIVITY LOGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Activity Information
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,

    -- Details
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key (nullable for system actions)
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at),
    INDEX idx_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 5. SESSIONS TABLE (Optional - for session management)
-- ==========================================
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,

    -- Session Data
    data TEXT,
    expires_at TIMESTAMP NOT NULL,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 6. INTEGRATIONS TABLE (for Zoho CRM sync)
-- ==========================================
CREATE TABLE IF NOT EXISTS integrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,

    -- Integration Details
    platform VARCHAR(50) NOT NULL, -- 'zoho_crm', 'zoho_mail', etc.
    external_id VARCHAR(255) NOT NULL,
    sync_status ENUM('pending', 'synced', 'failed') DEFAULT 'pending',

    -- Sync Information
    last_synced_at TIMESTAMP NULL,
    sync_error TEXT,
    sync_data JSON,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    UNIQUE KEY unique_integration (member_id, platform, external_id),
    INDEX idx_member (member_id),
    INDEX idx_platform (platform),
    INDEX idx_status (sync_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- INITIAL DATA - Default Admin User
-- ==========================================
-- Password: Admin123! (CHANGE THIS IMMEDIATELY)
-- Hash generated with bcrypt rounds=10
INSERT INTO users (username, email, password_hash, full_name, role, is_active)
VALUES (
    'admin',
    'admin@bgpnc.com',
    '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', -- Replace with actual hash
    'System Administrator',
    'admin',
    TRUE
) ON DUPLICATE KEY UPDATE id=id;

-- ==========================================
-- VIEWS (Optional - for reporting)
-- ==========================================

-- Active Members Summary
CREATE OR REPLACE VIEW v_active_members AS
SELECT
    m.*,
    COUNT(DISTINCT c.id) as children_count,
    TIMESTAMPDIFF(YEAR, m.date_of_birth, CURDATE()) as age,
    TIMESTAMPDIFF(MONTH, m.join_date, CURDATE()) as months_as_member
FROM members m
LEFT JOIN children c ON m.id = c.parent_id
WHERE m.member_status = 'active'
GROUP BY m.id;

-- Member Statistics by Month
CREATE OR REPLACE VIEW v_monthly_statistics AS
SELECT
    DATE_FORMAT(join_date, '%Y-%m') as month,
    COUNT(*) as new_members,
    SUM(CASE WHEN member_status = 'active' THEN 1 ELSE 0 END) as active_count,
    SUM(CASE WHEN photo_consent = TRUE THEN 1 ELSE 0 END) as photo_consent_count,
    SUM(CASE WHEN social_media_consent = TRUE THEN 1 ELSE 0 END) as social_consent_count
FROM members
GROUP BY DATE_FORMAT(join_date, '%Y-%m')
ORDER BY month DESC;

-- ==========================================
-- STORED PROCEDURES (Optional)
-- ==========================================

DELIMITER //

-- Get Member Full Profile
CREATE PROCEDURE IF NOT EXISTS sp_get_member_profile(IN member_id INT)
BEGIN
    SELECT
        m.*,
        COUNT(DISTINCT c.id) as children_count,
        TIMESTAMPDIFF(YEAR, m.date_of_birth, CURDATE()) as age
    FROM members m
    LEFT JOIN children c ON m.id = c.parent_id
    WHERE m.id = member_id
    GROUP BY m.id;

    SELECT * FROM children WHERE parent_id = member_id;
END //

-- Update Member Status
CREATE PROCEDURE IF NOT EXISTS sp_update_member_status(
    IN member_id INT,
    IN new_status ENUM('new_member', 'active', 'inactive'),
    IN admin_user_id INT
)
BEGIN
    UPDATE members
    SET member_status = new_status
    WHERE id = member_id;

    INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
    VALUES (
        admin_user_id,
        'status_update',
        'member',
        member_id,
        JSON_OBJECT('new_status', new_status)
    );
END //

DELIMITER ;

-- ==========================================
-- PERFORMANCE TIPS FOR PLANETSCALE
-- ==========================================
-- 1. PlanetScale doesn't support foreign key constraints in the same way
--    They're converted to application-level constraints
-- 2. Use composite indexes for complex queries
-- 3. Keep JSON columns small for better performance
-- 4. Use connection pooling (handled by PlanetScale automatically)
