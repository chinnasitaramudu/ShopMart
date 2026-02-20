/*
 * Purpose: Shared display formatter utilities for prices and dates.
 * API Integration: Formats values received from backend API responses.
 * State Management: Stateless helper functions.
 * Navigation Flow: Consistent formatting improves readability across routed pages.
 * Backend Connection: Expects numeric prices and ISO dates from backend responses.
 */
export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0)

export const formatDate = (value) => new Date(value).toLocaleDateString('en-IN')
