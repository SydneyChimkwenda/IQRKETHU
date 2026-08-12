import { CurrencyCode, DocumentType } from '@/types';

export function normalizeCurrency(currency?: CurrencyCode): CurrencyCode {
  if (currency === 'MK') return 'MWK';
  return currency || 'MWK';
}

export function formatCurrency(amount: number, currency: CurrencyCode = 'MWK'): string {
  const normalizedCurrency = normalizeCurrency(currency);
  const localeMap: Record<string, string> = {
    USD: 'en-US',
    GBP: 'en-GB',
    EUR: 'en-IE',
    MWK: 'en-MW',
    ZMW: 'en-ZM',
  };

  return new Intl.NumberFormat(localeMap[normalizedCurrency] || 'en-MW', {
    style: 'currency',
    currency: normalizedCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function generateDocumentNumber(type: DocumentType, existingCount: number): string {
  const prefix = type === 'invoice' ? 'INV' : type === 'quotation' ? 'QUO' : 'REC';
  const number = String(existingCount + 1).padStart(4, '0');
  return `${prefix}-${number}`;
}

export function calculateTotal(items: Array<{ quantity: number; unitPrice: number }>, taxRate: number = 0, discount: number = 0): {
  subtotal: number;
  taxAmount: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const discountAmount = (subtotal * discount) / 100;
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = (afterDiscount * taxRate) / 100;
  const total = afterDiscount + taxAmount;

  return { subtotal, taxAmount, total };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

