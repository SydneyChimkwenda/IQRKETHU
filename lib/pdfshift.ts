'use client';

/**
 * PDFShift.io Integration (Client-side wrapper)
 * 
 * This module provides PDF generation using PDFShift.io API via a secure server-side route.
 * The API key is kept secure on the server and never exposed to the client.
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Get your PDFShift API key:
 *    - Sign up at https://pdfshift.io
 *    - Get your API key from the dashboard
 * 
 * 2. For local development (.env.local):
 *    - Create a file named .env.local in the root directory
 *    - Add: PDFSHIFT_API_KEY=your_api_key_here
 *    - Note: Do NOT use NEXT_PUBLIC_ prefix (server-side only)
 *    - Restart your dev server after adding the variable
 * 
 * 3. For Netlify deployment:
 *    - Go to Netlify Dashboard → Your Site → Site settings → Environment variables
 *    - Click "Add variable"
 *    - Key: PDFSHIFT_API_KEY (no NEXT_PUBLIC_ prefix)
 *    - Value: your_api_key_here
 *    - Click "Save"
 *    - Redeploy your site
 * 
 * TESTING:
 * - Test locally by creating .env.local with your API key
 * - The function will call the server-side API route
 * - Check browser console for any errors during PDF generation
 */

/**
 * Generates a PDF from HTML content using PDFShift.io API via server-side route
 * 
 * @param invoiceHtml - The HTML content to convert to PDF
 * @returns Promise that resolves to a blob URL that can be used for download or email
 * @throws Error if PDF generation fails
 * 
 * @example
 * ```typescript
 * const html = '<html><body><h1>Invoice</h1></body></html>';
 * const pdfUrl = await generateInvoicePDF(html);
 * // Use pdfUrl for download or email attachment
 * ```
 */
export async function generateInvoicePDF(invoiceHtml: string): Promise<string> {
  try {
    // Call the server-side API route (keeps API key secure)
    const response = await fetch('/api/pdf/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: invoiceHtml,
      }),
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: 'Unknown error occurred',
        details: response.statusText 
      }));
      
      throw new Error(
        errorData.details || errorData.error || `Failed to generate PDF (${response.status})`
      );
    }

    // Get the response with base64 PDF
    const data = await response.json();
    
    if (!data.success || !data.pdfBase64) {
      throw new Error('Invalid response from PDF generation service');
    }

    // Convert base64 to blob
    const base64Data = data.pdfBase64;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });

    // Check if we got a valid PDF
    if (pdfBlob.size === 0) {
      throw new Error('PDF generation returned an empty file');
    }

    // Create a blob URL that can be used for download or email
    const blobUrl = URL.createObjectURL(pdfBlob);

    return blobUrl;
  } catch (error: any) {
    // Provide helpful error messages
    if (error.message.includes('API key')) {
      throw new Error(
        'PDFShift API key is not configured on the server. ' +
        'Please set PDFSHIFT_API_KEY in your server environment variables. ' +
        'For local development, add it to .env.local. ' +
        'For Netlify, add it in Site settings → Environment variables.'
      );
    }
    
    if (error.message.includes('network') || error.message.includes('fetch')) {
      throw new Error(
        'Network error while generating PDF. Please check your internet connection and try again.'
      );
    }

    // Re-throw with original message
    throw new Error(`Failed to generate PDF: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Downloads a PDF from a blob URL
 * 
 * @param blobUrl - The blob URL of the PDF
 * @param filename - The filename for the download (default: 'document.pdf')
 */
export function downloadPDFFromBlob(blobUrl: string, filename: string = 'document.pdf'): void {
  try {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the blob URL after a delay to free memory
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF');
  }
}

/**
 * Converts a blob URL to a data URL (base64) for email attachments
 * Note: This loads the entire PDF into memory, so use with caution for large files
 * 
 * @param blobUrl - The blob URL of the PDF
 * @returns Promise that resolves to a data URL string
 */
export async function blobUrlToDataUrl(blobUrl: string): Promise<string> {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert blob to data URL'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting blob to data URL:', error);
    throw new Error('Failed to convert PDF to data URL');
  }
}

