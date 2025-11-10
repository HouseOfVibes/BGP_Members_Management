-- BGP Members Management Database Schema - PostgreSQL/Supabase
-- Version: 2.0.0 (Supabase Migration)
-- Created: 2025

-- Enable UUID extension (optional but recommended for Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUMs (PostgreSQL type system)
CREATE TYPE member_status_enum AS ENUM ('new_member', 'active', 'inactive');
CREATE TYPE marital_status_enum AS ENUM ('single', 'married', 'divorced', 'widowed');
CREATE TYPE registration_method_enum AS ENUM ('online', 'manual', 'bulk_import');
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'not_specified');
CREATE TYPE user_role_enum AS ENUM ('admin', 'staff', 'viewer');

-- Members table
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    -- Personal Information
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    street_address VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    date_of_birth DATE,

    -- Church Information
    join_date DATE DEFAULT CURRENT_DATE,
    baptism_date DATE,
    member_status member_status_enum DEFAULT 'new_member',

    -- Family Information
    marital_status marital_status_enum,
    spouse_name VARCHAR(100),

    -- Permissions
    photo_consent BOOLEAN DEFAULT FALSE,
    social_media_consent BOOLEAN DEFAULT FALSE,
    email_consent BOOLEAN DEFAULT TRUE,

    -- Metadata
    registration_method registration_method_enum DEFAULT 'online',
    referral_source VARCHAR(255),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for members
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(member_status);
CREATE INDEX IF NOT EXISTS idx_members_join_date ON members(join_date);
CREATE INDEX IF NOT EXISTS idx_members_created_at ON members(created_at);

-- Children table
CREATE TABLE IF NOT EXISTS children (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender gender_enum,
    parental_consent BOOLEAN DEFAULT FALSE,
    special_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_children_parent
        FOREIGN KEY (parent_id)
        REFERENCES members(id)
        ON DELETE CASCADE
);

-- Create index for children
CREATE INDEX IF NOT EXISTS idx_children_parent ON children(parent_id);

-- Admin users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role user_role_enum DEFAULT 'staff',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for users
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activity_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Create indexes for activity_logs
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_details ON activity_logs USING GIN (details);

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_children_updated_at
    BEFORE UPDATE ON children
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - Recommended for Supabase
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (adjust based on your authentication needs)
-- These are basic policies - you may need to customize based on your auth setup

-- Members: Allow public insert (for registration), admin full access
CREATE POLICY "Allow public registration" ON members
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON members
    FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Allow admin update" ON members
    FOR UPDATE
    USING (auth.role() = 'service_role');

CREATE POLICY "Allow admin delete" ON members
    FOR DELETE
    USING (auth.role() = 'service_role');

-- Users: Admin/service role only
CREATE POLICY "Users admin only" ON users
    USING (auth.role() = 'service_role');

-- Activity logs: Service role only
CREATE POLICY "Activity logs service only" ON activity_logs
    USING (auth.role() = 'service_role');

-- Children: Same as members
CREATE POLICY "Children follow members policy" ON children
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- SECURITY: To create the initial admin user, use the API endpoint after database setup:
-- POST /api/auth/setup-admin
-- This will create an admin user using credentials from environment variables:
-- SUPABASE_URL, SUPABASE_SERVICE_KEY, ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD
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

-- Optional: Create a view for member age calculation
CREATE OR REPLACE VIEW members_with_age AS
SELECT
    m.*,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, m.date_of_birth))::INTEGER as age
FROM members m;

-- Optional: Create a view for children with age
CREATE OR REPLACE VIEW children_with_age AS
SELECT
    c.*,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, c.date_of_birth))::INTEGER as age
FROM children c;
