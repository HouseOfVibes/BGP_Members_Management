-- Migration: Add small_groups field to members table
-- Date: November 6, 2025
-- Description: Add JSON field to store member's small group interests

-- Check if column exists before adding
SET @dbname = DATABASE();
SET @tablename = 'members';
SET @columnname = 'small_groups';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT "Column already exists" AS msg;',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' JSON DEFAULT NULL COMMENT "Small groups the member is interested in";')
));

PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Success message
SELECT 'Migration completed: small_groups field added successfully' AS result;
