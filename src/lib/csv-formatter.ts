import { OrderRow } from '../dal/orders-dal.js';

/**
 * Escape CSV fields: quote if contains comma, newline, or quote
 * Double internal quotes per CSV spec
 */
function escapeCsvField(field: string | number | null): string {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatCurrency(cents: number): string {
  return (cents / 100).toFixed(2);
}

function formatDate(isoString: string): string {
  // Format: YYYY-MM-DD HH:mm:ss
  return isoString.replace('T', ' ').slice(0, 19);
}

export function ordersToCSV(orders: OrderRow[]): string {
  const headers = ['Order ID', 'Date', 'Customer Email', 'Type', 'Status', 'Amount'];
  const headerRow = headers.join(',');

  const dataRows = orders.map(order => [
    escapeCsvField(order.id),
    escapeCsvField(formatDate(order.created_at)),
    escapeCsvField(order.customer_email),
    escapeCsvField(order.type),
    escapeCsvField(order.status),
    escapeCsvField(formatCurrency(order.total_amount)),
  ].join(','));

  return [headerRow, ...dataRows].join('\n');
}