'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, FileCheck, Receipt, Plus, TrendingUp } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { storage } from '@/lib/storage';
import { Document, DocumentType } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState({
    invoices: 0,
    quotations: 0,
    receipts: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const allDocs = storage.getDocuments();
    setDocuments(allDocs);

    const invoices = allDocs.filter(d => d.type === 'invoice');
    const quotations = allDocs.filter(d => d.type === 'quotation');
    const receipts = allDocs.filter(d => d.type === 'receipt');
    const revenue = receipts.reduce((sum, r) => sum + r.total, 0);

    setStats({
      invoices: invoices.length,
      quotations: quotations.length,
      receipts: receipts.length,
      totalRevenue: revenue,
    });
  }, []);

  const recentDocuments = documents
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getTypeIcon = (type: DocumentType) => {
    switch (type) {
      case 'invoice':
        return FileText;
      case 'quotation':
        return FileCheck;
      case 'receipt':
        return Receipt;
    }
  };

  const getTypeColor = (type: DocumentType) => {
    switch (type) {
      case 'invoice':
        return 'bg-blue-100 text-blue-800';
      case 'quotation':
        return 'bg-green-100 text-green-800';
      case 'receipt':
        return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-2 text-gray-600">Overview of your documents and business metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{stats.invoices}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quotations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.quotations}</p>
              </div>
              <FileCheck className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receipts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.receipts}</p>
              </div>
              <Receipt className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/invoices/new"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow p-6 flex items-center justify-between transition-colors"
          >
            <div>
              <h3 className="text-lg font-semibold">Create Invoice</h3>
              <p className="text-blue-100 text-sm mt-1">Generate a new invoice</p>
            </div>
            <Plus className="h-8 w-8" />
          </Link>

          <Link
            href="/quotations/new"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow p-6 flex items-center justify-between transition-colors"
          >
            <div>
              <h3 className="text-lg font-semibold">Create Quotation</h3>
              <p className="text-green-100 text-sm mt-1">Generate a new quotation</p>
            </div>
            <Plus className="h-8 w-8" />
          </Link>

          <Link
            href="/receipts/new"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow p-6 flex items-center justify-between transition-colors"
          >
            <div>
              <h3 className="text-lg font-semibold">Create Receipt</h3>
              <p className="text-purple-100 text-sm mt-1">Generate a new receipt</p>
            </div>
            <Plus className="h-8 w-8" />
          </Link>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Documents</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentDocuments.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No documents yet. Create your first document using the quick actions above.
              </div>
            ) : (
              recentDocuments.map((doc) => {
                const Icon = getTypeIcon(doc.type);
                return (
                  <Link
                    key={doc.id}
                    href={`/${doc.type}s/${doc.id}`}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors block"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Icon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.documentNumber}</p>
                          <p className="text-sm text-gray-500">{doc.customerName}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(doc.type)}`}>
                          {doc.type}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(doc.total)}</p>
                        <p className="text-sm text-gray-500">{new Date(doc.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


