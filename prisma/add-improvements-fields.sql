-- Script SQL para agregar mejoras a Banco Perú
-- Ejecutado el: 27/06/2026
-- Cambios: Límites diarios, OTP, Reportes PDF

-- 1. Actualizar tabla accounts con nuevos campos
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS daily_withdrawal_limit DECIMAL(15, 2) DEFAULT 5000;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS daily_withdrawn_amount DECIMAL(15, 2) DEFAULT 0;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS last_withdrawal_reset TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 2. Crear tabla otp_requests
CREATE TABLE IF NOT EXISTS otp_requests (
  id VARCHAR(255) PRIMARY KEY,
  account_id VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_otp_account FOREIGN KEY (account_id) 
    REFERENCES accounts(id) ON DELETE CASCADE
);

-- 3. Crear tabla pdf_reports
CREATE TABLE IF NOT EXISTS pdf_reports (
  id VARCHAR(255) PRIMARY KEY,
  account_id VARCHAR(255) NOT NULL,
  report_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  s3_path VARCHAR(500),
  file_size INTEGER,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  download_count INTEGER DEFAULT 0,
  last_download_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pdf_account FOREIGN KEY (account_id) 
    REFERENCES accounts(id) ON DELETE CASCADE
);

-- 4. Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_otp_account_id ON otp_requests(account_id);
CREATE INDEX IF NOT EXISTS idx_otp_code ON otp_requests(code);
CREATE INDEX IF NOT EXISTS idx_otp_type ON otp_requests(type);
CREATE INDEX IF NOT EXISTS idx_otp_expires_at ON otp_requests(expires_at);

CREATE INDEX IF NOT EXISTS idx_pdf_account_id ON pdf_reports(account_id);
CREATE INDEX IF NOT EXISTS idx_pdf_report_type ON pdf_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_pdf_expires_at ON pdf_reports(expires_at);

CREATE INDEX IF NOT EXISTS idx_account_daily_limit ON accounts(daily_withdrawal_limit);
CREATE INDEX IF NOT EXISTS idx_account_last_reset ON accounts(last_withdrawal_reset);

-- 5. Comentarios documentando los cambios
COMMENT ON COLUMN accounts.daily_withdrawal_limit IS 'Límite máximo de retiros diarios en la moneda de la cuenta';
COMMENT ON COLUMN accounts.daily_withdrawn_amount IS 'Monto total retirado en el día actual';
COMMENT ON COLUMN accounts.last_withdrawal_reset IS 'Timestamp del último reseteo del contador diario (cada 24 horas)';

COMMENT ON TABLE otp_requests IS 'Almacena solicitudes de OTP para verificación de dos factores en operaciones sensibles';
COMMENT ON TABLE pdf_reports IS 'Almacena metadatos de reportes PDF generados para descargas';

-- 6. Crear vista para estadísticas de OTP
CREATE OR REPLACE VIEW otp_statistics AS
SELECT 
  account_id,
  type,
  COUNT(*) as total_otps,
  COUNT(CASE WHEN is_used THEN 1 END) as used_otps,
  COUNT(CASE WHEN is_used = false THEN 1 END) as unused_otps,
  COUNT(CASE WHEN attempts > 0 THEN 1 END) as with_failed_attempts,
  AVG(CAST(attempts AS FLOAT)) as avg_attempts
FROM otp_requests
GROUP BY account_id, type;

-- 7. Crear vista para estadísticas de reportes
CREATE OR REPLACE VIEW pdf_report_statistics AS
SELECT 
  account_id,
  report_type,
  COUNT(*) as total_reports,
  COUNT(CASE WHEN expires_at > CURRENT_TIMESTAMP THEN 1 END) as active_reports,
  COUNT(CASE WHEN expires_at <= CURRENT_TIMESTAMP THEN 1 END) as expired_reports,
  SUM(download_count) as total_downloads,
  SUM(COALESCE(file_size, 0)) as total_size_bytes
FROM pdf_reports
GROUP BY account_id, report_type;

-- 8. Crear vista de límites diarios
CREATE OR REPLACE VIEW daily_withdrawal_status AS
SELECT 
  a.id,
  a.account_number,
  c.first_name,
  c.last_name,
  a.daily_withdrawal_limit,
  a.daily_withdrawn_amount,
  (a.daily_withdrawal_limit - a.daily_withdrawn_amount) as remaining_limit,
  a.last_withdrawal_reset,
  CASE 
    WHEN (EXTRACT(HOUR FROM (CURRENT_TIMESTAMP - a.last_withdrawal_reset)) >= 24) 
    THEN 'NEEDS_RESET'
    ELSE 'ACTIVE'
  END as status
FROM accounts a
JOIN clients c ON a.client_id = c.id;

-- 9. Mostrar resumen de cambios
SELECT 'MIGRATION SUMMARY' as action;
SELECT 'Tables created/modified:' as status;
SELECT '  - accounts (added 3 columns)' as change;
SELECT '  - otp_requests (new table)' as change;
SELECT '  - pdf_reports (new table)' as change;
SELECT 'Indexes created:' as status;
SELECT '  - 8 indexes for performance' as change;
SELECT 'Views created:' as status;
SELECT '  - otp_statistics' as change;
SELECT '  - pdf_report_statistics' as change;
SELECT '  - daily_withdrawal_status' as change;
SELECT 'Status: ✅ COMPLETE' as status;
