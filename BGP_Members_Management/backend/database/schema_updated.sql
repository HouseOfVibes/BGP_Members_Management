-- BGP Members Management Database Schema - UPDATED
-- Version: 2.0.0
-- Updated to match Church Center form requirements

CREATE DATABASE IF NOT EXISTS bgp_members;
USE bgp_members;

-- Members table with enhanced fields
CREATE TABLE IF NOT EXISTS members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    -- Personal Information
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'prefer_not_to_say') NULL,

    -- Address Information
    street_address VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    country VARCHAR(2) DEFAULT 'US',

    -- Church Information
    join_date DATE DEFAULT (CURRENT_DATE),
    baptism_status ENUM('baptized', 'not_baptized', 'planning_to', 'prefer_not_to_say') DEFAULT 'prefer_not_to_say',
    baptism_date DATE NULL,
    previous_church VARCHAR(200) NULL,
    member_status ENUM('new_member', 'active', 'inactive') DEFAULT 'new_member',

    -- Family Information
    marital_status ENUM('single', 'married', 'divorced', 'widowed') NULL,
    spouse_name VARCHAR(100) NULL,

    -- Volunteer Interests (stored as JSON array)
    volunteer_interests JSON NULL COMMENT 'Array of volunteer interest areas',
    skills_talents JSON NULL COMMENT 'Array of skills and talents',

    -- Permissions & Consent
    photo_consent ENUM('yes', 'no', 'not_answered') DEFAULT 'not_answered',
    social_media_consent BOOLEAN DEFAULT FALSE,
    email_consent BOOLEAN DEFAULT TRUE,
    children_photo_consent ENUM('yes', 'no', 'not_applicable') DEFAULT 'not_applicable',
    parental_consent BOOLEAN DEFAULT FALSE,

    -- Metadata
    registration_method ENUM('online', 'manual') DEFAULT 'online',
    referral_source VARCHAR(255) NULL,
    admin_notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_status (member_status),
    INDEX idx_join_date (join_date)
);

-- Children table
CREATE TABLE IF NOT EXISTS children (
    id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    age INT GENERATED ALWAYS AS (TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE())) STORED,
    gender ENUM('male', 'female', 'not_specified') NULL,
    special_notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_parent (parent_id)
);

-- Household Members table (for other adults living in the same household)
CREATE TABLE IF NOT EXISTS household_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    primary_member_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NULL COMMENT 'e.g., parent, sibling, roommate',
    email VARCHAR(100) NULL,
    phone VARCHAR(20) NULL,
    date_of_birth DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (primary_member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_primary_member (primary_member_id)
);

-- Admin users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('admin', 'staff', 'viewer') DEFAULT 'staff',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
);

-- Insert default admin user (password: admin123 - CHANGE IMMEDIATELY)
INSERT INTO users (username, email, password_hash, full_name, role, is_active)
VALUES (
    'admin',
    'admin@bgpnc.com',
    '$2a$10$YourHashHere', -- Replace with actual bcrypt hash
    'System Administrator',
    'admin',
    TRUE
) ON DUPLICATE KEY UPDATE id=id;
