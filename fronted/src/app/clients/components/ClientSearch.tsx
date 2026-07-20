'use client';

interface ClientSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function ClientSearch({ searchTerm, onSearchChange }: ClientSearchProps) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <input
        type="text"
        placeholder="Buscar por nombre, DNI o email..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}
