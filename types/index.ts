export type DocumentType = 'invoice' | 'quotation' | 'receipt';
export type CurrencyCode = 'USD' | 'MK' | 'MWK' | 'ZMW' | 'GBP' | 'EUR';

export const CURRENCY_OPTIONS: Array<{ value: CurrencyCode; label: string }> = [
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'MK', label: 'Malawi Kwacha (MK)' },
  { value: 'MWK', label: 'Malawi Kwacha (MWK)' },
  { value: 'ZMW', label: 'Zambian Kwacha (ZMW)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
  { value: 'EUR', label: 'Euro (EUR)' },
];

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Document {
  id: string;
  type: DocumentType;
  documentNumber: string;
  date: string;
  dueDate?: string;
  customerName: string;
  customerAddress?: string;
  customerEmail?: string;
  customerPhone?: string;
  currency?: CurrencyCode;
  items: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  notes?: string;
  termsAndConditions?: string;
  includeVat?: boolean;
  status?: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxId?: string;
  logo?: string;
}





