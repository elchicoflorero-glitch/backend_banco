/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Peruvian DNI format (8 digits)
 */
export function isValidDNI(dni: string): boolean {
  const dniRegex = /^\d{8}$/;
  return dniRegex.test(dni);
}

/**
 * Validate phone number format (optional)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?(\d{1,3})?[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate account number format (10 digits)
 */
export function isValidAccountNumber(accountNumber: string): boolean {
  const accountRegex = /^\d{10}$/;
  return accountRegex.test(accountNumber);
}

/**
 * Validate amount is a positive number
 */
export function isValidAmount(amount: number | string): boolean {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return numAmount > 0 && !isNaN(numAmount);
}

/**
 * Generate a random string of given length
 */
export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Sanitize object properties by removing sensitive data
 */
export function sanitizeObject(obj: any, keysToRemove: string[] = ['password']): any {
  if (!obj) return obj;
  
  const sanitized = { ...obj };
  keysToRemove.forEach((key) => {
    delete sanitized[key];
  });
  
  return sanitized;
}

/**
 * Parse and validate decimal amount
 */
export function parseAmount(amount: string | number): number {
  const parsed = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error('Invalid amount');
  }
  
  return Math.round(parsed * 100) / 100; // Round to 2 decimal places
}
