'use client';

import type { TransferForm, Account } from './TransferFormData';

interface TransferFormProps {
  formData: TransferForm;
  accounts: Account[];
  isLoading: boolean;
  onFormChange: (data: TransferForm) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function TransferFormComponent({
  formData,
  accounts,
  isLoading,
  onFormChange,
  onSubmit,
}: TransferFormProps) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
          }}
        >
          Cuenta Origen
        </label>
        <select
          value={formData.fromAccountNumber}
          onChange={(e) =>
            onFormChange({ ...formData, fromAccountNumber: e.target.value })
          }
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            boxSizing: 'border-box',
            background: 'white',
            fontFamily: 'inherit',
            color: '#1f2937',
            outline: 'none',
          }}
        >
          <option value="">Selecciona una cuenta</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.accountNumber}>
              {acc.accountNumber} - Saldo: {acc.currency || 'N/A'}{' '}
              {(typeof acc.balance === 'string' ? parseFloat(acc.balance) : acc.balance).toFixed(
                2
              )}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
          }}
        >
          Número de Cuenta Destino
        </label>
        <input
          type="text"
          placeholder="Ej: 0001-2345-6789"
          value={formData.toAccountNumber}
          onChange={(e) =>
            onFormChange({ ...formData, toAccountNumber: e.target.value })
          }
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            color: '#1f2937',
            outline: 'none',
          }}
        />
      </div>

      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
          }}
        >
          Monto a Transferir
        </label>
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
            }}
          >
            S/.
          </span>
          <input
            type="number"
            placeholder="0.00"
            step="0.01"
            value={formData.amount}
            onChange={(e) => onFormChange({ ...formData, amount: e.target.value })}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.25rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              color: '#1f2937',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          background: isLoading ? '#9ca3af' : '#2563eb',
          color: 'white',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem',
          fontWeight: '600',
          marginTop: '1rem',
        }}
      >
        {isLoading ? 'Procesando transferencia...' : 'Realizar Transferencia'}
      </button>
    </form>
  );
}
