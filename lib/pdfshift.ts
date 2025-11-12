'use client';

/**
 * PDFShift.io Integration
 * 
 * This module provides PDF generation using PDFShift.io API.
 * It's designed to work frontend-only on Netlify (no backend server required).
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Get your PDFShift API key:
 *    - Sign up at https://pdfshift.io
 *    - Get your API key from the dashboard
 * 
 * 2. For local development (.env.local):
 *    - Create a file named .env.local in the root directory
 *    - Add: NEXT_PUBLIC_PDFSHIFT_API_KEY=your_api_key_here
 *    - Restart your dev server after adding the variable
 * 
 * 3. For Netlify deployment:
 *    - Go to Netlify Dashboard → Your Site → Site settings → Environment variables
 *    - Click "Add variable"
 *    - Key: NEXT_PUBLIC_PDFSHIFT_API_KEY
 *    - Value: your_api_key_here
 *    - Click "Save"
 *    - Redeploy your site
 * 
 * TESTING:
 * - Test locally by creating .env.local with your API key
 * - The function will automatically use the environment variable
 * - Check browser console for any errors during PDF generation
 */

/**
 * Generates a PDF from HTML content using PDFShift.io API
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
  // Get API key from environment variable
  const apiKey = process.env.NEXT_PUBLIC_PDFSHIFT_API_KEY;

  // Check if API key is configured
  if (!apiKey) {
    throw new Error(
      'PDFShift API key is not configured. ' +
      'Please set NEXT_PUBLIC_PDFSHIFT_API_KEY in your environment variables. ' +
      'For local development, add it to .env.local. ' +
      'For Netlify, add it in Site settings → Environment variables.'
    );
  }

  try {
    // Prepare the request to PDFShift API
    // PDFShift API endpoint: https://api.pdfshift.io/v3/convert/pdf
    // PDFShift uses Basic authentication with the API key
    const response = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${apiKey}:`)}`, // Basic auth: API key as username, empty password
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: invoiceHtml, // HTML content to convert
        format: 'A4', // PDF format
        margin: '0mm', // No margins for full-page PDF
        print_background: true, // Include background colors and images
        wait_for: 'networkidle0', // Wait for network to be idle
      }),
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: 'Unknown error occurred',
        message: response.statusText 
      }));
      
      throw new Error(
        `PDFShift API error (${response.status}): ${errorData.error || errorData.message || 'Failed to generate PDF'}`
      );
    }

    // Get the PDF as a blob
    const pdfBlob = await response.blob();

    // Check if we got a valid PDF
    if (pdfBlob.type !== 'application/pdf' && pdfBlob.size === 0) {
      throw new Error('PDFShift returned an invalid PDF file');
    }

    // Create a blob URL that can be used for download or email
    const blobUrl = URL.createObjectURL(pdfBlob);

    return blobUrl;
  } catch (error: any) {
    // Provide helpful error messages
    if (error.message.includes('API key')) {
      throw error; // Re-throw API key errors as-is
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

