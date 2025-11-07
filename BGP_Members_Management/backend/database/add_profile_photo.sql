-- Migration: Add profile_photo_url field to members table
-- Date: November 6, 2025
-- Description: Add field to store member's profile photo URL

-- Check if column exists before adding
SET @dbname = DATABASE();
SET @tablename = 'members';
SET @columnname = 'profile_photo_url';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT "Column already exists" AS msg;',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(500) DEFAULT NULL COMMENT "URL to members profile photo";')
));

PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Success message
SELECT 'Migration completed: profile_photo_url field added successfully' AS result;
