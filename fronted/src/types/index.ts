/**
 * User roles enum
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  CLIENT = 'client',
}

/**
 * User type for authentication
 */
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole | string;
}

/**
 * Auth response from login/register
 */
export interface AuthResponse {
  access_token: string;
  user: User;
}

/**
 * Client type for bank customers
 */
export interface Client {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create client DTO
 */
export interface CreateClientDto {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/**
 * Update client DTO
 */
export interface UpdateClientDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

/**
 * Account type for bank accounts
 */
export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  clientId: string;
  client?: Client;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create account DTO
 */
export interface CreateAccountDto {
  clientId: string;
}

/**
 * Transaction type for money transfers
 */
export interface Transaction {
  id: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  sourceAccount?: Account;
  destinationAccount?: Account;
  createdAt: string;
}

/**
 * Transfer DTO for money transfers
 */
export interface TransferDto {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * API Error response
 */
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

/**
 * Audit log type
 */
export interface AuditLog {
  id: string;
  operationType: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, any>;
  timestamp: string;
}
