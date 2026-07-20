import { api } from '@/lib/api';
import { Client, CreateClientDto, UpdateClientDto, PaginatedResponse } from '@/types';

/**
 * Get all clients with optional pagination
 */
export async function getClients(
  page?: number,
  limit?: number
): Promise<PaginatedResponse<Client> | Client[]> {
  const params: any = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const response = await api.get<any>('/clients', { params });
  return response.data;
}

/**
 * Get a single client by ID
 */
export async function getClient(id: string): Promise<Client> {
  const response = await api.get<Client>(`/clients/${id}`);
  return response.data;
}

/**
 * Create a new client
 */
export async function createClient(data: CreateClientDto): Promise<Client> {
  const response = await api.post<Client>('/clients', data);
  return response.data;
}

/**
 * Update a client
 */
export async function updateClient(id: string, data: UpdateClientDto): Promise<Client> {
  const response = await api.put<Client>(`/clients/${id}`, data);
  return response.data;
}

/**
 * Delete a client
 */
export async function deleteClient(id: string): Promise<void> {
  await api.delete(`/clients/${id}`);
}
