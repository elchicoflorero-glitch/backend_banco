export function InfoBox() {
  return (
    <div
      style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        color: '#1e40af',
        padding: '1rem',
        borderRadius: '0.375rem',
        marginTop: '1.5rem',
        fontSize: '0.875rem',
      }}
    >
      <strong>ℹ️ Información importante:</strong>
      <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem' }}>
        <li>El retiro se procesará inmediatamente</li>
        <li>Tu saldo se actualizará en tiempo real</li>
        <li>Puedes ver el historial de tus retiros en tu portal</li>
        <li>Se registrará un comprobante de cada transacción</li>
      </ul>
    </div>
  );
}
