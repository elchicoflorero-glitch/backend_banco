export const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: 'Invalid username or password',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',
  FORBIDDEN: 'Access forbidden',

  // User errors
  USER_NOT_FOUND: 'User not found',
  USERNAME_EXISTS: 'Username already exists',
  EMAIL_EXISTS: 'Email already exists',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',

  // Client errors
  CLIENT_NOT_FOUND: 'Client not found',
  DNI_EXISTS: 'DNI already exists',
  CLIENT_HAS_ACTIVE_ACCOUNTS: 'Cannot delete client with active accounts',

  // Account errors
  ACCOUNT_NOT_FOUND: 'Account not found',
  INVALID_ACCOUNT_NUMBER: 'Invalid account number',
  ACCOUNT_NUMBER_EXISTS: 'Account number already exists',

  // Transaction errors
  INVALID_AMOUNT: 'Invalid transfer amount',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  SAME_ACCOUNT_TRANSFER: 'Cannot transfer to the same account',
  TRANSACTION_FAILED: 'Transaction failed',

  // General errors
  BAD_REQUEST: 'Bad request',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
};

export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  RETRIEVED: 'Resource retrieved successfully',
  TRANSFER_COMPLETED: 'Transfer completed successfully',
};
