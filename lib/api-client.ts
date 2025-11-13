'use client';

import { Document } from '@/types';

export interface PDFGenerationResponse {
  success: boolean;
  documentId?: string;
  downloadLink?: string;
  filename?: string;
  error?: string;
  details?: string;
}

export async function generatePDFLink(document: Document): Promise<PDFGenerationResponse> {
  try {
    // Get module name from client-side storage
    const { getModuleName } = await import('./module');
    const moduleName = getModuleName();

    // Get backend API URL
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001';

    // Call backend API to generate PDF
    const response = await fetch(`${BACKEND_API_URL}/api/pdf/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ document, moduleName }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to generate PDF',
        details: data.details,
      };
    }

    return {
      success: true,
      documentId: data.documentId,
      downloadLink: data.downloadLink,
      filename: data.filename,
    };
  } catch (error: any) {
    console.error('Error generating PDF link:', error);
    return {
      success: false,
      error: 'Network error',
      details: error.message,
    };
  }
}

