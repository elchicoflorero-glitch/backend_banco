-- Agregar columna currency a la tabla accounts si no existe
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'PEN';

-- Verificar que se agregó correctamente
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'accounts' AND column_name = 'currency';
