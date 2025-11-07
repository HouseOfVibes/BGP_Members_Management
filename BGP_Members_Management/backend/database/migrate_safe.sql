-- Safe Migration Script for BGP Members Database v2.0
-- This script checks for column existence before adding

USE bgp_members_db;

-- Add gender column if it doesn't exist
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'bgp_members_db'
AND TABLE_NAME = 'members'
AND COLUMN_NAME = 'gender';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE members ADD COLUMN gender ENUM(''male'', ''female'', ''prefer_not_to_say'') NULL AFTER date_of_birth',
    'SELECT ''gender column already exists'' as status');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add country column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'bgp_members_db'
AND TABLE_NAME = 'members'
AND COLUMN_NAME = 'country';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE members ADD COLUMN country VARCHAR(2) DEFAULT ''US'' AFTER zip_code',
    'SELECT ''country column already exists'' as status');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add baptism_status column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'bgp_members_db'
AND TABLE_NAME = 'members'
AND COLUMN_NAME = 'baptism_status';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE members ADD COLUMN baptism_status ENUM(''baptized'', ''not_baptized'', ''planning_to'', ''prefer_not_to_say'') DEFAULT ''prefer_not_to_say'' AFTER baptism_date',
    'SELECT ''baptism_status column already exists'' as status');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add previous_church column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'bgp_members_db'
AND TABLE_NAME = 'members'
AND COLUMN_NAME = 'previous_church';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE members ADD COLUMN previous_church VARCHAR(200) NULL AFTER baptism_status',
    'SELECT ''previous_church column already exists'' as status');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add volunteer_interests column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'bgp_members_db'
AND TABLE_NAME = 'members'
AND COLUMN_NAME = 'volunteer_interests';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE members ADD COLUMN volunteer_interests JSON NULL AFTER spouse_name',
    'SELECT ''volunteer_interests column already exists'' as status');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add skills_talents column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'bgp_members_db'
AND TABLE_NAME = 'members'
AND COLUMN_NAME = 'skills_talents';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE members ADD COLUMN skills_talents JSON NULL AFTER volunteer_interests',
    'SELECT ''skills_talents column already exists'' as status');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add children_photo_consent column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'bgp_members_db'
AND TABLE_NAME = 'members'
AND COLUMN_NAME = 'children_photo_consent';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE members ADD COLUMN children_photo_consent ENUM(''yes'', ''no'', ''not_applicable'') DEFAULT ''not_applicable'' AFTER email_consent',
    'SELECT ''children_photo_consent column already exists'' as status');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add parental_consent column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'bgp_members_db'
AND TABLE_NAME = 'members'
AND COLUMN_NAME = 'parental_consent';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE members ADD COLUMN parental_consent BOOLEAN DEFAULT FALSE AFTER children_photo_consent',
    'SELECT ''parental_consent column already exists'' as status');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create household_members table if it doesn't exist
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

SELECT '✅ Migration completed successfully!' as status;
SELECT 'New columns added to members table' as info;
SELECT 'household_members table created' as info;
