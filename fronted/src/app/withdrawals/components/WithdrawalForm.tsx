import React from 'react';
import type { Account, WithdrawalForm as WithdrawalFormType } from './types';

interface WithdrawalFormComponentProps {
  formData: WithdrawalFormType;
  accounts: Account[];
  isLoading: boolean;
  onFormChange: (data: WithdrawalFormType) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function WithdrawalFormComponent({
  formData,
  accounts,
  isLoading,
  onFormChange,
  onSubmit,
}: WithdrawalFormComponentProps) {
  return (
    <form onSubmit={onSubmit} style={{ marginTop: '1.5rem' }}>
      {/* Cuenta origen */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="accountNumber"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
          }}
        >
          Selecciona tu cuenta
        </label>
        <select
          id="accountNumber"
          value={formData.accountNumber}
          onChange={(e) => onFormChange({ ...formData, accountNumber: e.target.value })}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid #d1d5db',
            fontSize: '1rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            boxSizing: 'border-box',
          }}
        >
          <option value="">-- Selecciona una cuenta --</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.accountNumber}>
              {account.accountNumber} (S/. {parseFloat(String(account.balance)).toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      {/* Monto */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="amount"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
          }}
        >
          Monto a retirar
        </label>
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              fontSize: '1rem',
              fontWeight: '600',
            }}
          >
            S/.
          </span>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => onFormChange({ ...formData, amount: e.target.value })}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db',
              fontSize: '1rem',
              boxSizing: 'border-box',
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'text',
            }}
          />
        </div>
      </div>

      {/* Razón del retiro (opcional) */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="reason"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
          }}
        >
          Razón del retiro (opcional)
        </label>
        <input
          id="reason"
          type="text"
          placeholder="Ej: Retiro en cajero automático"
          defaultValue=""
          onChange={(e) => onFormChange({ ...formData, reason: e.target.value })}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid #d1d5db',
            fontSize: '1rem',
            boxSizing: 'border-box',
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'text',
          }}
        />
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: isLoading ? '#9ca3af' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'background 0.3s ease',
          opacity: isLoading ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.background = '#1d4ed8';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.background = '#2563eb';
          }
        }}
      >
        {isLoading ? '⏳ Procesando...' : '💰 Procesar Retiro'}
      </button>
    </form>
  );
}
