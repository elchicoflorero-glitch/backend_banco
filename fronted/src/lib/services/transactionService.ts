import { api } from '@/lib/api';
import { Transaction, TransferDto, PaginatedResponse } from '@/types';

/**
 * Get all transactions with optional pagination
 */
export async function getTransactions(
  page?: number,
  limit?: number
): Promise<PaginatedResponse<Transaction> | Transaction[]> {
  const params: any = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const response = await api.get<any>('/transactions', { params });
  return response.data;
}

/**
 * Get transactions for a specific account
 */
export async function getAccountTransactions(
  accountId: string,
  page?: number,
  limit?: number
): Promise<PaginatedResponse<Transaction> | Transaction[]> {
  const params: any = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const response = await api.get<any>(`/transactions/account/${accountId}`, { params });
  return response.data;
}

/**
 * Get a single transaction by ID
 */
export async function getTransaction(id: string): Promise<Transaction> {
  const response = await api.get<Transaction>(`/transactions/${id}`);
  return response.data;
}

/**
 * Perform a money transfer between accounts
 */
export async function transferMoney(data: TransferDto): Promise<Transaction> {
  const response = await api.post<Transaction>('/transfers', data);
  return response.data;
}
