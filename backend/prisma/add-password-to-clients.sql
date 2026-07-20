-- Add password column to clients table
ALTER TABLE clients ADD COLUMN password VARCHAR(255);

-- Update existing clients with a temporary password
-- In production, this should be done manually or through a secure process
UPDATE clients SET password = '' WHERE password IS NULL;

-- Make the password column NOT NULL
ALTER TABLE clients ALTER COLUMN password SET NOT NULL;
