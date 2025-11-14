'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Printer, Mail, Download } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { storage } from '@/lib/storage';
import { Document } from '@/types';
import DocumentView from '@/components/DocumentView';
import SendEmailModal from '@/components/SendEmailModal';
import { downloadDocumentAsPDF } from '@/lib/pdf';

export default function InvoiceViewPage() {
  const router = useRouter();
  const params = useParams();
  const [invoice, setInvoice] = useState<Document | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (invoice) {
      try {
        await downloadDocumentAsPDF(invoice);
      } catch (error) {
        console.error('Error downloading PDF:', error);
        alert('Failed to download PDF. Please try again.');
      }
    }
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
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link
            href="/invoices"
            className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Invoices</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm flex-1 sm:flex-initial"
            >
              <Printer className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm flex-1 sm:flex-initial"
            >
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex-1 sm:flex-initial"
            >
              <Mail className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Send Email</span>
              <span className="sm:hidden">Email</span>
            </button>
            <Link
              href={`/invoices/${invoice.id}/edit`}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex-1 sm:flex-initial"
            >
              <Edit className="h-4 w-4 sm:mr-2" />
              Edit
            </Link>
          </div>
        </div>
        <DocumentView document={invoice} />
        {invoice && (
          <SendEmailModal
            document={invoice}
            isOpen={showEmailModal}
            onClose={() => setShowEmailModal(false)}
          />
        )}
      </main>
    </div>
  );
}

