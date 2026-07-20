'use client';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, title, onClose, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const widthMap = {
    sm: '400px',
    md: '600px',
    lg: '800px',
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '0.5rem',
          width: widthMap[size],
          maxWidth: '90vw',
          boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>
    </div>
  );
}
