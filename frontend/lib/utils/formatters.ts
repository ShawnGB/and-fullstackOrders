/**
 * Format price with Euro symbol
 */
export function formatPrice(price: number): string {
  return `${Number(price).toFixed(2)} €`;
}

/**
 * Format date to locale string
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}
