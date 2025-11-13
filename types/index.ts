export type DocumentType = 'invoice' | 'quotation' | 'receipt';

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
  items: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  notes?: string;
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




