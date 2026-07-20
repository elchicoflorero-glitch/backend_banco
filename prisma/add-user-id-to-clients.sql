-- Add user_id column to clients table (optional relationship to users)
ALTER TABLE clients ADD COLUMN user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL;
