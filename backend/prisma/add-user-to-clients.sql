-- Add user_id column to clients table for role-based access control
ALTER TABLE clients ADD COLUMN user_id TEXT;

-- Add foreign key constraint
ALTER TABLE clients 
ADD CONSTRAINT fk_clients_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_clients_user_id ON clients(user_id);
