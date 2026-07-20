$sql = @"
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'PEN';

SELECT column_name FROM information_schema.columns 
WHERE table_name = 'accounts' AND column_name = 'currency';
"@

# Ejecutar el SQL contra la base de datos con credenciales correctas
$env:PGPASSWORD = "1234"
& psql -U carlos -h localhost -p 5433 -d banco_peru -c $sql
