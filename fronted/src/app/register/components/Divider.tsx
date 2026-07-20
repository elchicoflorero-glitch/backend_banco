export function Divider() {
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            borderTop: '1px solid #d1d5db',
          }}
        />
      </div>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          fontSize: '0.875rem',
        }}
      >
        <span
          style={{
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            background: 'white',
            color: '#6b7280',
          }}
        >
          o
        </span>
      </div>
    </div>
  );
}
