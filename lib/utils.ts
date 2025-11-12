import { DocumentType } from '@/types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-MW', {
    style: 'currency',
    currency: 'MWK',
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

