import { api } from '@/lib/api';
import { Account, CreateAccountDto, PaginatedResponse } from '@/types';

/**
 * Get all accounts with optional pagination
 */
export async function getAccounts(
  page?: number,
  limit?: number
): Promise<PaginatedResponse<Account> | Account[]> {
  const params: any = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const response = await api.get<any>('/accounts', { params });
  return response.data;
}

/**
 * Get accounts for a specific client
 */
export async function getClientAccounts(clientId: string): Promise<Account[]> {
  const response = await api.get<Account[]>(`/accounts/client/${clientId}`);
  return response.data;
}

/**
 * Get a single account by ID
 */
export async function getAccount(id: string): Promise<Account> {
  const response = await api.get<Account>(`/accounts/${id}`);
  return response.data;
}

/**
 * Get account by account number
 */
export async function getAccountByNumber(accountNumber: string): Promise<Account> {
  const response = await api.get<Account>(`/accounts/number/${accountNumber}`);
  return response.data;
}

/**
 * Create a new account for a client
 */
export async function createAccount(data: CreateAccountDto): Promise<Account> {
  const response = await api.post<Account>('/accounts', data);
  return response.data;
}

/**
 * Get account balance
 */
export async function getAccountBalance(id: string): Promise<{ balance: number }> {
  const response = await api.get<{ balance: number }>(`/accounts/${id}/balance`);
  return response.data;
}
