'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import DocumentForm from '@/components/DocumentForm';
import { storage } from '@/lib/storage';
import { Document } from '@/types';

export default function EditQuotationPage() {
  const router = useRouter();
  const params = useParams();
  const [quotation, setQuotation] = useState<Document | null>(null);

  useEffect(() => {
    if (params.id) {
      const doc = storage.getDocument(params.id as string);
      if (doc && doc.type === 'quotation') {
        setQuotation(doc);
      } else {
        router.push('/quotations');
      }
    }
  }, [params.id, router]);

  const handleSave = (document: Document) => {
    storage.saveDocument(document);
    router.push(`/quotations/${document.id}`);
  };

  const handleCancel = () => {
    router.push(`/quotations/${params.id}`);
  };

  if (!quotation) {
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
          <h2 className="text-3xl font-bold text-gray-900">Edit Quotation</h2>
          <p className="mt-2 text-gray-600">Update quotation details</p>
        </div>
        <DocumentForm
          type="quotation"
          document={quotation}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
}

