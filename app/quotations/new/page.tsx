'use client';

import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import DocumentForm from '@/components/DocumentForm';
import { storage } from '@/lib/storage';
import { Document } from '@/types';

export default function NewQuotationPage() {
  const router = useRouter();

  const handleSave = (document: Document) => {
    storage.saveDocument(document);
    router.push('/quotations');
  };

  const handleCancel = () => {
    router.push('/quotations');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create New Quotation</h2>
          <p className="mt-2 text-gray-600">Fill in the details to create a new quotation</p>
        </div>
        <DocumentForm
          type="quotation"
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
}

