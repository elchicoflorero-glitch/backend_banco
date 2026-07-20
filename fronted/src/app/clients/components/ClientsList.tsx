'use client';

interface Client {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface ClientsListProps {
  clients: Client[];
  loading: boolean;
  searchTerm: string;
  token: string;
  onClientDeleted: (id: string) => void;
  onEdit: (clientId: string) => void;
  onDelete: (clientId: string, clientName: string) => void;
  onError: (message: string) => void;
}

export function ClientsList({
  clients,
  loading,
  searchTerm,
  onEdit,
  onDelete,
  onError,
}: ClientsListProps) {
  const filteredClients = clients.filter(
    (client) =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.dni.includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          Cargando clientes...
        </div>
      ) : filteredClients.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          No hay clientes disponibles
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                DNI
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Nombre
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Email
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Teléfono
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1f2937' }}>
                  {client.dni}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1f2937' }}>
                  {`${client.firstName} ${client.lastName}`}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1f2937' }}>
                  {client.email}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1f2937' }}>
                  {client.phone}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button
                    onClick={() => onEdit(client.id)}
                    style={{
                      background: '#2563eb',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      marginRight: '0.5rem',
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(client.id, `${client.firstName} ${client.lastName}`)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
