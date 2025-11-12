import { Document } from '@/types';

const STORAGE_KEY = 'kethu_documents';
const COMPANY_KEY = 'kethu_company';

export const storage = {
  // Documents
  getDocuments: (): Document[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveDocument: (document: Document): void => {
    if (typeof window === 'undefined') return;
    const documents = storage.getDocuments();
    const index = documents.findIndex(d => d.id === document.id);
    if (index >= 0) {
      documents[index] = document;
    } else {
      documents.push(document);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  },

  deleteDocument: (id: string): void => {
    if (typeof window === 'undefined') return;
    const documents = storage.getDocuments();
    const filtered = documents.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  getDocument: (id: string): Document | null => {
    const documents = storage.getDocuments();
    return documents.find(d => d.id === id) || null;
  },

  // Company Info
  getCompanyInfo: () => {
    if (typeof window === 'undefined') {
      return {
        name: 'Kethu Groups',
        address: '',
        phone: '',
        email: '',
        taxId: '',
      };
    }
    const data = localStorage.getItem(COMPANY_KEY);
    return data ? JSON.parse(data) : {
      name: 'Kethu Groups',
      address: '',
      phone: '',
      email: '',
      taxId: '',
    };
  },

  saveCompanyInfo: (info: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(COMPANY_KEY, JSON.stringify(info));
  },
};


