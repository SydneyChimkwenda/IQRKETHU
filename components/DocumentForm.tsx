'use client';

import { useState, useEffect } from 'react';
import { LineItem, Document, DocumentType } from '@/types';
import { calculateTotal, generateId, generateDocumentNumber } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { X, Plus } from 'lucide-react';

interface DocumentFormProps {
  type: DocumentType;
  document?: Document;
  onSave: (document: Document) => void;
  onCancel: () => void;
}

export default function DocumentForm({ type, document, onSave, onCancel }: DocumentFormProps) {
  // Generate document number for new documents
  const getInitialDocumentNumber = () => {
    if (document?.documentNumber) return document.documentNumber;
    const existingDocs = storage.getDocuments().filter(d => d.type === type);
    return generateDocumentNumber(type, existingDocs.length);
  };

  const [formData, setFormData] = useState({
    documentNumber: getInitialDocumentNumber(),
    date: document?.date || new Date().toISOString().split('T')[0],
    dueDate: document?.dueDate || '',
    customerName: document?.customerName || '',
    customerAddress: document?.customerAddress || '',
    customerEmail: document?.customerEmail || '',
    customerPhone: document?.customerPhone || '',
    items: document?.items || [{ id: generateId(), description: '', quantity: 1, unitPrice: 0, total: 0 }],
    taxRate: document?.taxRate || 16.5,
    discount: document?.discount || 0,
    notes: document?.notes || '',
  });

  const [calculations, setCalculations] = useState(calculateTotal(formData.items, formData.taxRate, formData.discount));

  useEffect(() => {
    const calc = calculateTotal(formData.items, formData.taxRate, formData.discount);
    setCalculations(calc);
  }, [formData.items, formData.taxRate, formData.discount]);

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      }),
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: generateId(), description: '', quantity: 1, unitPrice: 0, total: 0 }],
    }));
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const newDocument: Document = {
      id: document?.id || generateId(),
      type,
      documentNumber: formData.documentNumber,
      date: formData.date,
      dueDate: formData.dueDate || undefined,
      customerName: formData.customerName,
      customerAddress: formData.customerAddress || undefined,
      customerEmail: formData.customerEmail || undefined,
      customerPhone: formData.customerPhone || undefined,
      items: formData.items,
      subtotal: calculations.subtotal,
      taxRate: formData.taxRate,
      taxAmount: calculations.taxAmount,
      discount: formData.discount,
      total: calculations.total,
      notes: formData.notes || undefined,
      status: document?.status || 'draft',
      createdAt: document?.createdAt || now,
      updatedAt: now,
    };
    onSave(newDocument);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Document Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Number
            </label>
            <input
              type="text"
              required
              value={formData.documentNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, documentNumber: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          {type === 'invoice' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          )}
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={formData.customerAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, customerAddress: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Description</th>
                <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">Quantity</th>
                <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">Unit Price</th>
                <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">Total</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      required
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                      placeholder="Item description"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                    />
                  </td>
                  <td className="py-2 px-2 text-right">
                    ${item.total.toFixed(2)}
                  </td>
                  <td className="py-2 px-2">
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-700">VAT Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.taxRate}
                onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-700">Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.discount}
                onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="space-y-2 text-right">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${calculations.subtotal.toFixed(2)}</span>
            </div>
            {formData.discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount ({formData.discount}%):</span>
                <span>-${((calculations.subtotal * formData.discount) / 100).toFixed(2)}</span>
              </div>
            )}
            {formData.taxRate > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">VAT ({formData.taxRate}%):</span>
                <span className="font-medium">${calculations.taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total:</span>
              <span>${calculations.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
          placeholder="Additional notes or terms..."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {document ? 'Update' : 'Create'} {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      </div>
    </form>
  );
}

