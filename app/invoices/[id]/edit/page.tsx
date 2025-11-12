'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import DocumentForm from '@/components/DocumentForm';
import { storage } from '@/lib/storage';
import { Document } from '@/types';

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const [invoice, setInvoice] = useState<Document | null>(null);

  useEffect(() => {
    if (params.id) {
      const doc = storage.getDocument(params.id as string);
      if (doc && doc.type === 'invoice') {
        setInvoice(doc);
      } else {
        router.push('/invoices');
      }
    }
  }, [params.id, router]);

  const handleSave = (document: Document) => {
    storage.saveDocument(document);
    router.push(`/invoices/${document.id}`);
  };

  const handleCancel = () => {
    router.push(`/invoices/${params.id}`);
  };

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Edit Invoice</h2>
          <p className="mt-2 text-gray-600">Update invoice details</p>
        </div>
        <DocumentForm
          type="invoice"
          document={invoice}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
}

