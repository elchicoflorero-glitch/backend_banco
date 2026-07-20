'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import {
  WithdrawalFormComponent,
  ErrorAlert,
  SuccessAlert,
  InfoBox,
  BackLink,
} from './components';
import type { WithdrawalForm, WithdrawalResult, Account } from './components';

export default function WithdrawalsPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [formData, setFormData] = useState<WithdrawalForm>({
    accountNumber: '',
    amount: '',
    reason: '',
  });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState<WithdrawalResult | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchAccounts = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/accounts`, { headers });
        setAccounts(response.data || []);
      } catch (err: any) {
        setError('Error al cargar las cuentas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [token, router]);

  const validateForm = () => {
    if (!formData.accountNumber.trim()) {
      setError('Selecciona una cuenta');
      return false;
    }
    const amount = parseFloat(formData.amount);
    if (!formData.amount || amount <= 0) {
      setError('Ingresa un monto válido mayor a 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setWithdrawing(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.post(
        `${apiUrl}/withdrawals`,
        {
          accountNumber: formData.accountNumber,
          amount: parseFloat(formData.amount),
          reason: formData.reason || undefined,
        },
        { headers }
      );

      setResult({
        success: true,
        message: 'Retiro realizado exitosamente',
        transactionId: response.data?.transactionId,
      });
      setSuccess('Retiro realizado exitosamente');
      setFormData({ accountNumber: '', amount: '', reason: '' });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al procesar el retiro';
      setError(errorMsg);
      setResult({ success: false, message: errorMsg });
    } finally {
      setWithdrawing(false);
    }
  };

  if (!token) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f9fafb',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <BackLink />

        {/* Card */}
        <div
          style={{
            background: 'white',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0,
              marginBottom: '1.5rem',
            }}
          >
            Retiro de Dinero
          </h1>

          <ErrorAlert message={error} />
          <SuccessAlert message={success} transactionId={result?.transactionId} />

          <WithdrawalFormComponent
            formData={formData}
            accounts={accounts}
            isLoading={withdrawing || loading}
            onFormChange={setFormData}
            onSubmit={handleSubmit}
          />

          <InfoBox />
        </div>
      </div>
    </div>
  );
}
