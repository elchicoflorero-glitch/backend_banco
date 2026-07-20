import { api } from '@/lib/api';
import { AuthResponse, User } from '@/types';

/**
 * Login with username and password
 */
export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', {
    username,
    password,
  });
  return response.data;
}

/**
 * Register a new user
 */
export async function register(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', {
    username,
    email,
    password,
  });
  return response.data;
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>('/auth/me');
  return response.data;
}
