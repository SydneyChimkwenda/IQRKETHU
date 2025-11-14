import { Document } from '@/types';
import { formatCurrency } from './utils';
import { storage } from './storage';
import { getModuleName } from './module';
import emailjs from '@emailjs/browser';

// Backend API URL
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001';

// EmailJS Configuration
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';

// Initialize EmailJS
if (typeof window !== 'undefined' && EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface EmailParams {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  document_html: string;
}

export function generateEmailHTML(document: Document, pdfDownloadLink?: string): string {
  const companyInfo = storage.getCompanyInfo();
  const documentTitle = document.type === 'invoice' ? 'INVOICE' : 
                        document.type === 'quotation' ? 'QUOTATION' : 
                        'RECEIPT';

  // Dynamic labels based on document type
  const documentTypeLabel = document.type === 'invoice' ? 'Invoice' : 
                            document.type === 'quotation' ? 'Quotation' : 
                            'Receipt';
  const documentNumberLabel = `${documentTypeLabel} no`;
  const documentToLabel = `${documentTypeLabel} to`;

  // Use green for all document types
  const documentColor = '#16a34a';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${documentTitle} - ${document.documentNumber}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-top: 5px solid ${documentColor}; border-bottom: 5px solid ${documentColor}; position: relative;">
              ${document.type === 'receipt' ? `
                <!-- PAID Stamp -->
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-12deg); z-index: 10; pointer-events: none; opacity: 0.45;">
                  <div style="border: 4px solid #dc2626; border-radius: 50%; width: 140px; height: 140px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: transparent; box-shadow: 0 3px 10px rgba(220, 38, 38, 0.3), inset 0 0 15px rgba(220, 38, 38, 0.1); position: relative; overflow: hidden; padding: 8px;">
                    <!-- Stamp texture effect -->
                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 20% 30%, rgba(220, 38, 38, 0.12) 0.5px, transparent 0.5px), radial-gradient(circle at 80% 70%, rgba(220, 38, 38, 0.12) 0.5px, transparent 0.5px), radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.08) 1px, transparent 1px); background-size: 8px 8px, 10px 10px, 12px 12px; opacity: 0.7;"></div>
                    
                    <!-- Module Name -->
                    <div style="font-size: 10px; font-weight: bold; color: #dc2626; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; position: relative; z-index: 1; text-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.1); line-height: 1.1;">${getModuleName()}</div>
                    
                    <!-- Decorative line -->
                    <div style="width: 70px; height: 1.5px; background-color: #dc2626; margin-bottom: 4px; position: relative; z-index: 1;"></div>
                    
                    <!-- PAID text -->
                    <span style="font-size: 24px; font-weight: 900; color: #dc2626; letter-spacing: 4px; text-transform: uppercase; position: relative; z-index: 1; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15); font-family: Arial, sans-serif; line-height: 1;">PAID</span>
                    
                    <!-- Date line -->
                    <div style="font-size: 8px; font-weight: 600; color: #dc2626; letter-spacing: 0.5px; margin-top: 4px; position: relative; z-index: 1; text-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.1); line-height: 1.1;">${new Date(document.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</div>
                  </div>
                </div>
              ` : ''}
              <!-- Header Section -->
              <tr>
                <td style="padding: 30px; border-bottom: 2px solid ${documentColor};">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td valign="top">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td valign="top" style="padding-right: 15px;">
                              <img src="https://via.placeholder.com/80x80/16a34a/ffffff?text=LOGO" alt="KETHU CONSULT Logo" style="width: 80px; height: 80px; object-fit: contain; display: block;" />
                            </td>
                            <td valign="top">
                              <h1 style="margin: 0 0 4px 0; font-size: 28px; font-weight: bold; color: #008080;">${getModuleName()}</h1>
                              <p style="margin: 0 0 8px 0; font-size: 13px; color: #374151; font-style: italic;">Second to None – Serving You the Best Way</p>
                              <p style="margin: 0 0 4px 0; font-size: 13px; color: #374151;">P.O. Box 2069, Area 7, Lilongwe</p>
                              <p style="margin: 0; font-size: 13px; color: #374151;">Tel: +265 888 921 085 | Email: kethugroups@hotmail.com</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td align="right">
                        <h2 style="margin: 0 0 10px 0; font-size: 36px; font-weight: bold; color: ${documentColor};">${documentTitle}</h2>
                        ${document.type === 'receipt' ? `
                          <div style="margin-bottom: 8px;">
                            <span style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 6px 16px; border-radius: 4px; font-size: 14px; font-weight: bold;">PAID</span>
                          </div>
                        ` : ''}
                        <p style="margin: 0; font-size: 14px; color: #4b5563; font-weight: 600;">${documentNumberLabel} : ${document.documentNumber}</p>
                        <p style="margin: 5px 0 0 0; font-size: 14px; color: #4b5563;">${new Date(document.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <!-- Customer To Section -->
                  <div style="margin-bottom: 25px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #374151;">${documentToLabel} :</h3>
                    <p style="margin: 0 0 5px 0; font-size: 18px; font-weight: bold; color: #111827;">${document.customerName}</p>
                    ${document.customerPhone ? `<p style="margin: 3px 0; font-size: 14px; color: #4b5563;">${document.customerPhone}</p>` : ''}
                    ${document.customerEmail ? `<p style="margin: 3px 0; font-size: 14px; color: #4b5563;">${document.customerEmail}</p>` : ''}
                    ${document.customerAddress ? `<p style="margin: 3px 0; font-size: 14px; color: #4b5563;">${document.customerAddress}</p>` : ''}
                  </div>
                  
                  <!-- Items Table -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px; border-collapse: collapse;">
                    <thead>
                      <tr style="background-color: ${documentColor};">
                        <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #ffffff; border: none; width: ${document.type === 'receipt' ? '4%' : '5%'};">NO</th>
                        <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #ffffff; border: none; width: ${document.type === 'receipt' ? '38%' : '45%'};">DESCRIPTION</th>
                        <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: 600; color: #ffffff; border: none; width: ${document.type === 'receipt' ? '10%' : '12%'};">QTY</th>
                        <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #ffffff; border: none; width: ${document.type === 'receipt' ? '15%' : '18%'};">PRICE</th>
                        <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #ffffff; border: none; width: ${document.type === 'receipt' ? '16%' : '20%'};">TOTAL</th>
                        ${document.type === 'receipt' ? '<th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #ffffff; border: none; width: 17%;">BALANCE</th>' : ''}
                      </tr>
                    </thead>
                    <tbody>
                      ${document.items.map((item, index) => `
                        <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f0fdf4'};">
                          <td style="padding: 12px; font-size: 14px; color: #374151; border: none;">${index + 1}</td>
                          <td style="padding: 12px; font-size: 14px; color: #111827; font-weight: 500; border: none;">${item.description}</td>
                          <td style="padding: 12px; text-align: center; font-size: 14px; color: #374151; border: none;">${item.quantity}</td>
                          <td style="padding: 12px; text-align: right; font-size: 14px; color: #374151; border: none;">${formatCurrency(item.unitPrice)}</td>
                          <td style="padding: 12px; text-align: right; font-size: 14px; color: #111827; font-weight: 600; border: none;">${formatCurrency(item.total)}</td>
                          ${document.type === 'receipt' ? `<td style="padding: 12px; text-align: right; font-size: 14px; color: #16a34a; font-weight: 600; border: none;">${formatCurrency(0)}</td>` : ''}
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                  
                  <!-- Summary Section -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                    <tr>
                      <td align="right">
                        <table cellpadding="0" cellspacing="0" style="width: 280px;">
                          <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #374151; font-weight: 500;">Sub Total :</td>
                            <td align="right" style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 600;">${formatCurrency(document.subtotal)}</td>
                          </tr>
                          ${document.discount > 0 ? `
                            <tr>
                              <td style="padding: 8px 0; font-size: 14px; color: #dc2626; font-weight: 500;">Discount (${document.discount}%) :</td>
                              <td align="right" style="padding: 8px 0; font-size: 14px; color: #dc2626; font-weight: 600;">-${formatCurrency((document.subtotal * document.discount) / 100)}</td>
                            </tr>
                          ` : ''}
                          ${document.taxRate > 0 ? `
                            <tr>
                              <td style="padding: 8px 0; font-size: 14px; color: #374151; font-weight: 500;">VAT ${document.taxRate}% :</td>
                              <td align="right" style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 600;">${formatCurrency(document.taxAmount)}</td>
                            </tr>
                          ` : ''}
                          <tr>
                            <td colspan="2" style="padding-top: 12px;">
                              <div style="background-color: ${documentColor}; padding: 12px; color: #ffffff;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="font-size: 16px; font-weight: bold; color: #ffffff;">GRAND TOTAL :</td>
                                    <td align="right" style="font-size: 16px; font-weight: bold; color: #ffffff;">${formatCurrency(document.total)}</td>
                                  </tr>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Payment Method -->
                  <div style="background-color: ${documentColor}; color: #ffffff; padding: 15px; margin-bottom: 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600;">PAYMENT METHOD :</p>
                    <div style="font-size: 13px;">
                      <p style="margin: 3px 0; color: #ffffff;">Bank : ${companyInfo.taxId || 'Please contact us for bank details'}</p>
                      <p style="margin: 3px 0; color: #ffffff;">Mobile Money : ${companyInfo.phone || '+265 888 921 085'}</p>
                    </div>
                  </div>
                  
                  <!-- Thank You -->
                  <div style="border-top: 1px solid #d1d5db; padding-top: 15px; margin-bottom: 20px;">
                    <p style="margin: 0; font-size: 15px; color: #374151; font-weight: 500;">Thank you for business with us!</p>
                  </div>
                  
                  ${pdfDownloadLink ? `
                  <!-- PDF Download Link -->
                  <div style="margin-bottom: 25px; text-align: center;">
                    <a href="${pdfDownloadLink}" style="display: inline-block; background-color: ${documentColor}; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                      📥 Download PDF Document
                    </a>
                    <p style="margin: 12px 0 0 0; font-size: 13px; color: #6b7280; text-align: center;">
                      Click the button above to download your ${documentTypeLabel.toLowerCase()} as a PDF file
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af; text-align: center; word-break: break-all;">
                      Or copy this link: <a href="${pdfDownloadLink}" style="color: ${documentColor}; text-decoration: underline;">${pdfDownloadLink}</a>
                    </p>
                  </div>
                  ` : ''}
                  
                  <!-- Terms and Conditions -->
                  <div style="margin-bottom: 30px;">
                    <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #374151;">Term and Conditions :</p>
                    ${document.notes ? `
                      <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.6; white-space: pre-line;">${document.notes}</p>
                    ` : (document.type === 'invoice' ? `
                      <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.6;">Please send payment within 30 days of receiving this invoice. There will be 10% interest charge per month on late invoice.</p>
                    ` : '')}
                  </div>
                  
                  <!-- Footer Contact Info -->
                  <div style="border-top: 2px solid ${documentColor}; padding-top: 20px; text-align: center;">
                    <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 500; color: #374151;">Be rest assured of the best service possible.</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 5px;">
                          <p style="margin: 0; font-size: 13px; color: ${documentColor}; font-weight: 500;">📞 +265 888 921 085</p>
                        </td>
                        <td align="center" style="padding: 5px;">
                          <p style="margin: 0; font-size: 13px; color: ${documentColor}; font-weight: 500;">✉️ kethugroups@hotmail.com</p>
                        </td>
                        <td align="center" style="padding: 5px;">
                          <p style="margin: 0; font-size: 13px; color: ${documentColor}; font-weight: 500;">📍 P.O. Box 2069, Area 7, Lilongwe</p>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function sendDocumentEmailViaBackend(
  document: Document,
  recipientEmail: string,
  recipientName: string,
  pdfDownloadLink?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get module name for backend
    const moduleName = getModuleName();
    
    // Call backend API to send email
    const response = await fetch(`${BACKEND_API_URL}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document,
        recipientEmail,
        recipientName,
        pdfDownloadLink,
        moduleName,
      }),
    });

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    let data: any = {};
    if (isJson) {
      try {
        data = await response.json();
      } catch (e) {
        // If JSON parsing fails, treat as error
        throw new Error('Invalid response from backend');
      }
    } else {
      // If not JSON (likely HTML error page), treat as endpoint not available
      if (!response.ok) {
        throw new Error(`Backend endpoint not available (${response.status})`);
      }
    }

    if (!response.ok) {
      // Fallback to mailto link if backend is not available (404, 500, 503)
      if (response.status === 404 || response.status === 500 || response.status === 503) {
        const subject = encodeURIComponent(
          `${document.type === 'invoice' ? 'Invoice' : document.type === 'quotation' ? 'Quotation' : 'Receipt'} - ${document.documentNumber}`
        );
        const pdfLinkText = pdfDownloadLink ? `\n\nDownload PDF: ${pdfDownloadLink}` : '';
        const body = encodeURIComponent(
          `Dear ${recipientName},\n\n` +
          `Please find the ${document.type} ${document.documentNumber} from ${getModuleName()}.${pdfLinkText}\n\n` +
          `Total Amount: ${formatCurrency(document.total)}\n` +
          `Date: ${new Date(document.date).toLocaleDateString()}\n\n` +
          `Thank you for your business!\n\n` +
          `Best regards,\n` +
          `${getModuleName()}\n` +
          `Email: kethugroups@hotmail.com\n` +
          `Tel: +265 888 921 085`
        );
        window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
        return { success: true };
      }
      
      return {
        success: false,
        error: data.error || 'Failed to send email. Please check your backend configuration.'
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Email sending error:', error);
    
    // Fallback to mailto link on network errors or endpoint not available
    if (
      error.message?.includes('fetch') || 
      error.message?.includes('network') ||
      error.message?.includes('endpoint not available') ||
      error.message?.includes('Invalid response')
    ) {
      const subject = encodeURIComponent(
        `${document.type === 'invoice' ? 'Invoice' : document.type === 'quotation' ? 'Quotation' : 'Receipt'} - ${document.documentNumber}`
      );
      const pdfLinkText = pdfDownloadLink ? `\n\nDownload PDF: ${pdfDownloadLink}` : '';
      const body = encodeURIComponent(
        `Dear ${recipientName},\n\n` +
        `Please find the ${document.type} ${document.documentNumber} from ${getModuleName()}.${pdfLinkText}\n\n` +
        `Total Amount: ${formatCurrency(document.total)}\n` +
        `Date: ${new Date(document.date).toLocaleDateString()}\n\n` +
        `Thank you for your business!\n\n` +
        `Best regards,\n` +
        `${getModuleName()}\n` +
        `Email: kethugroups@hotmail.com\n` +
        `Tel: +265 888 921 085`
      );
      window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
      return { success: true };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to send email. Please check your backend connection.'
    };
  }
}

/**
 * Sends a document email using EmailJS directly from the frontend.
 * This function calls the backend to generate the document PDF, then uses EmailJS to send the email.
 * 
 * @param recipientEmail - The email address of the recipient
 * @param documentType - The type of document ('invoice' | 'quotation' | 'receipt')
 * @param document - The document object to send (required to generate PDF)
 * @returns Promise with success status and optional error message
 */
export async function sendDocumentEmail(
  recipientEmail: string,
  documentType: 'invoice' | 'quotation' | 'receipt',
  document: Document
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate EmailJS configuration
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      return {
        success: false,
        error: 'EmailJS is not configured. Please set NEXT_PUBLIC_EMAILJS_PUBLIC_KEY, NEXT_PUBLIC_EMAILJS_SERVICE_ID, and NEXT_PUBLIC_EMAILJS_TEMPLATE_ID environment variables.'
      };
    }

    // Validate recipient email
    if (!recipientEmail || !recipientEmail.includes('@')) {
      return {
        success: false,
        error: 'Please provide a valid recipient email address.'
      };
    }

    // Validate document type matches
    if (document.type !== documentType) {
      return {
        success: false,
        error: `Document type mismatch. Expected ${documentType}, but document is ${document.type}.`
      };
    }

    // Step 1: Call backend to generate document PDF and get URL
    const moduleName = getModuleName();
    const generateResponse = await fetch(`${BACKEND_API_URL}/api/pdf/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ document, moduleName }),
    });

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json().catch(() => ({}));
      return {
        success: false,
        error: `Failed to generate document: ${errorData.error || generateResponse.statusText || 'Unknown error'}`
      };
    }

    const generateData = await generateResponse.json();
    
    if (!generateData.success || !generateData.downloadLink) {
      return {
        success: false,
        error: generateData.error || 'Failed to generate document URL'
      };
    }

    const documentUrl = generateData.downloadLink;

    // Step 2: Send email using EmailJS
    // Prepare template parameters - replace {documentUrl} with the actual URL
    const templateParams = {
      to_email: recipientEmail,
      to_name: document.customerName || 'Valued Customer',
      from_name: getModuleName(),
      from_email: 'kethugroups@hotmail.com',
      reply_to: 'kethugroups@hotmail.com',
      subject: `${documentType === 'invoice' ? 'Invoice' : documentType === 'quotation' ? 'Quotation' : 'Receipt'} - ${document.documentNumber}`,
      message: `Please find your ${documentType} ${document.documentNumber} attached.`,
      document_url: documentUrl,
      documentUrl: documentUrl, // Support both naming conventions
      document_number: document.documentNumber,
      document_type: documentType,
      total_amount: formatCurrency(document.total),
      document_date: new Date(document.date).toLocaleDateString(),
    };

    // Send email via EmailJS
    const emailResult = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (emailResult.status === 200) {
      return { success: true };
    } else {
      return {
        success: false,
        error: `EmailJS returned status ${emailResult.status}. Please check your EmailJS configuration.`
      };
    }

  } catch (error: any) {
    console.error('Error sending document email via EmailJS:', error);
    
    // Provide user-friendly error messages
    if (error.message?.includes('EmailJS')) {
      return {
        success: false,
        error: `EmailJS error: ${error.text || error.message || 'Failed to send email. Please check your EmailJS configuration.'}`
      };
    }
    
    if (error.message?.includes('fetch') || error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
      return {
        success: false,
        error: 'Network error: Could not connect to the backend API. Please check your internet connection and backend configuration.'
      };
    }

    return {
      success: false,
      error: error.message || 'An unexpected error occurred while sending the email. Please try again.'
    };
  }
}

