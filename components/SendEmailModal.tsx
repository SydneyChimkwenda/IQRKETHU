'use client';

import { useState } from 'react';
import { X, Mail, Loader2 } from 'lucide-react';
import { sendDocumentEmail } from '@/lib/email';
import { generatePDFLink } from '@/lib/api-client';
import { Document } from '@/types';

interface SendEmailModalProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SendEmailModal({ document, isOpen, onClose, onSuccess }: SendEmailModalProps) {
  const [email, setEmail] = useState(document.customerEmail || '');
  const [name, setName] = useState(document.customerName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // First, generate PDF and get download link
      setError('Generating PDF...');
      const pdfResult = await generatePDFLink(document);
      
      if (!pdfResult.success || !pdfResult.downloadLink) {
        setError(pdfResult.error || 'Failed to generate PDF link');
        setLoading(false);
        return;
      }

      // Then send email with PDF link
      setError('Sending email...');
      const result = await sendDocumentEmail(document, email, name, pdfResult.downloadLink);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
          setSuccess(false);
          setError('');
        }, 2000);
      } else {
        setError(result.error || 'Failed to send email');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending the email');
    } finally {
      setLoading(false);
    }
  };

  const documentTitle = document.type === 'invoice' ? 'Invoice' : 
                        document.type === 'quotation' ? 'Quotation' : 
                        'Receipt';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center mb-6">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Send {documentTitle}</h2>
            <p className="text-sm text-gray-600">#{document.documentNumber}</p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Sent Successfully!</h3>
            <p className="text-gray-600">The {documentTitle.toLowerCase()} has been sent to {email}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Customer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="customer@example.com"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> If EmailJS is not configured, this will open your default email client with a pre-filled message.
                To enable direct email sending, configure EmailJS in your environment variables.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

