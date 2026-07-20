-- Insertar usuario admin
-- Password: admin123 (hasheado con bcrypt)
INSERT INTO users (username, email, password, role, "createdAt", "updatedAt") 
VALUES (
  'admin', 
  'admin@bancoperu.com',
  '$2b$10$rQJ5jqKZ8xK.8YqKZx.xvOYxQ8qKZx.xvOYxQ8qKZx.xvOYxQ8qKZx',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (username) DO NOTHING;

-- Verificar
SELECT id, username, email, role FROM users WHERE username = 'admin';
