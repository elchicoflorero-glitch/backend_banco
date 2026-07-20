/**
 * Format date to ISO string without milliseconds
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('.')[0] + 'Z';
}

/**
 * Get start of day for a given date
 */
export function getStartOfDay(date: Date): Date {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  return startDate;
}

/**
 * Get end of day for a given date
 */
export function getEndOfDay(date: Date): Date {
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  return endDate;
}

/**
 * Get date range for a given month
 */
export function getMonthRange(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  endDate.setHours(23, 59, 59, 999);

  return {
    start: startDate,
    end: endDate,
  };
}

/**
 * Check if date is within range
 */
export function isDateInRange(
  date: Date,
  startDate: Date,
  endDate: Date,
): boolean {
  return date >= startDate && date <= endDate;
}

/**
 * Get days between two dates
 */
export function getDaysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if date is in the past
 */
export function isDateInPast(date: Date): boolean {
  return date < new Date();
}

/**
 * Check if date is in the future
 */
export function isDateInFuture(date: Date): boolean {
  return date > new Date();
}
