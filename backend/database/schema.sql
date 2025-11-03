-- BGP Members Management Database Schema
-- Version: 1.0.0
-- Created: 2024

CREATE DATABASE IF NOT EXISTS bgp_members;
USE bgp_members;

-- Members table
CREATE TABLE IF NOT EXISTS members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    -- Personal Information
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    street_address VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    
    -- Church Information
    join_date DATE DEFAULT (CURRENT_DATE),
    baptism_date DATE,
    member_status ENUM('new_member', 'active', 'inactive') DEFAULT 'new_member',
    
    -- Family Information
    marital_status ENUM('single', 'married', 'divorced', 'widowed'),
    spouse_name VARCHAR(100),
    
    -- Permissions
    photo_consent BOOLEAN DEFAULT FALSE,
    social_media_consent BOOLEAN DEFAULT FALSE,
    email_consent BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    registration_method ENUM('online', 'manual') DEFAULT 'online',
    referral_source VARCHAR(255),
    admin_notes TEXT,
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
    date_of_birth DATE,
    age INT GENERATED ALWAYS AS (TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE())) STORED,
    gender ENUM('male', 'female', 'not_specified'),
    parental_consent BOOLEAN DEFAULT FALSE,
    special_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_parent (parent_id)
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

-- SECURITY: To create the initial admin user, use the API endpoint after database setup:
-- POST /api/auth/setup-admin
-- This will create an admin user using credentials from environment variables:
-- ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD
--
-- The API enforces strong password requirements:
-- - At least 12 characters
-- - Uppercase and lowercase letters
-- - Numbers and special characters
-- - Not a common weak password
--
-- Example using curl:
-- curl -X POST http://localhost:5000/api/auth/setup-admin
--
-- Make sure to set strong values in your .env file before running this!