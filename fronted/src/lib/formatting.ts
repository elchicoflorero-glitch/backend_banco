/**
 * Format currency values
 */
export function formatCurrency(value: number, currency: string = 'PEN'): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format date in a human-readable format
 */
export function formatDate(date: string | Date, locale: string = 'es-PE'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date and time
 */
export function formatDateTime(date: string | Date, locale: string = 'es-PE'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format account number with spaces
 */
export function formatAccountNumber(accountNumber: string): string {
  return accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/**
 * Format DNI/ID number
 */
export function formatDNI(dni: string): string {
  const cleaned = dni.replace(/\D/g, '');
  return cleaned.substring(0, 8).replace(/(\d{2})(?=\d)/g, '$1-');
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `+51 ${cleaned.substring(0, 1)} ${cleaned.substring(1, 4)} ${cleaned.substring(4)}`;
  }
  return phone;
}

/**
 * Truncate long text
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Get initials from name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Format full name
 */
export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
