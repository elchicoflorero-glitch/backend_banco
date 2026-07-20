'use client';

export function InfoBox() {
  return (
    <div
      style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '0.375rem',
        padding: '1rem',
        marginTop: '1.5rem',
        fontSize: '0.875rem',
        color: '#1e40af',
      }}
    >
      <p style={{ margin: 0, fontWeight: 500, marginBottom: '0.5rem' }}>
        📌 Información importante:
      </p>
      <ul style={{ margin: '0.5rem 0', paddingLeft: '1.25rem' }}>
        <li>Las cuentas origen y destino deben ser diferentes</li>
        <li>El monto debe ser mayor a 0</li>
        <li>La transferencia se procesará inmediatamente</li>
        <li>Recibirás una confirmación con el ID de transacción</li>
      </ul>
    </div>
  );
}
