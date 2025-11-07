-- Migration script to update existing database to v2.0.0
-- Run this if you already have data in your database

USE bgp_members;

-- Add new columns to members table
ALTER TABLE members
ADD COLUMN IF NOT EXISTS gender ENUM('male', 'female', 'prefer_not_to_say') NULL AFTER date_of_birth,
ADD COLUMN IF NOT EXISTS country VARCHAR(2) DEFAULT 'US' AFTER zip_code,
ADD COLUMN IF NOT EXISTS baptism_status ENUM('baptized', 'not_baptized', 'planning_to', 'prefer_not_to_say') DEFAULT 'prefer_not_to_say' AFTER join_date,
ADD COLUMN IF NOT EXISTS previous_church VARCHAR(200) NULL AFTER baptism_date,
ADD COLUMN IF NOT EXISTS volunteer_interests JSON NULL COMMENT 'Array of volunteer interest areas' AFTER spouse_name,
ADD COLUMN IF NOT EXISTS skills_talents JSON NULL COMMENT 'Array of skills and talents' AFTER volunteer_interests;

-- Update photo_consent column to use ENUM with more options
ALTER TABLE members
MODIFY COLUMN photo_consent ENUM('yes', 'no', 'not_answered') DEFAULT 'not_answered';

-- Add children_photo_consent column
ALTER TABLE members
ADD COLUMN IF NOT EXISTS children_photo_consent ENUM('yes', 'no', 'not_applicable') DEFAULT 'not_applicable' AFTER email_consent;

-- Update children table to ensure age is calculated
-- Note: If the age column already exists, this will update it
ALTER TABLE children
MODIFY COLUMN age INT GENERATED ALWAYS AS (TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE())) STORED;

-- Remove parental_consent from children table if it exists and move to members
ALTER TABLE children
DROP COLUMN IF EXISTS parental_consent;

-- Add parental_consent to members table
ALTER TABLE members
ADD COLUMN IF NOT EXISTS parental_consent BOOLEAN DEFAULT FALSE AFTER children_photo_consent;

-- Create household_members table
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

-- Update existing photo_consent values from boolean to enum
-- This assumes existing boolean values: 1 = 'yes', 0 = 'no'
-- Commented out as it depends on your current data structure
-- UPDATE members SET photo_consent = CASE
--     WHEN photo_consent = 1 THEN 'yes'
--     WHEN photo_consent = 0 THEN 'no'
--     ELSE 'not_answered'
-- END;
