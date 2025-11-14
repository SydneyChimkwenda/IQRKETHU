'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Receipt, Edit, Trash2, Eye } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { storage } from '@/lib/storage';
import { Document } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Document[]>([]);

  useEffect(() => {
    const allDocs = storage.getDocuments();
    setReceipts(allDocs.filter(d => d.type === 'receipt'));
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this receipt?')) {
      storage.deleteDocument(id);
      setReceipts(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Receipts</h2>
            <p className="mt-2 text-gray-600">Manage your receipts</p>
          </div>
          <Link
            href="/receipts/new"
            className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors w-full sm:w-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Receipt
          </Link>
        </div>

        {receipts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No receipts yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first receipt.</p>
            <Link
              href="/receipts/new"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Receipt
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt #
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Customer
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {receipts.map((receipt) => (
                    <tr key={receipt.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900">
                        <div className="flex flex-col">
                          <span>{receipt.documentNumber}</span>
                          <span className="text-xs text-gray-500 sm:hidden mt-1">{receipt.customerName}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {receipt.customerName}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {new Date(receipt.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(receipt.total)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/receipts/${receipt.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            aria-label="View receipt"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/receipts/${receipt.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                            aria-label="Edit receipt"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(receipt.id)}
                            className="text-red-600 hover:text-red-900"
                            aria-label="Delete receipt"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}





