import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document } from '@/types';

export async function downloadDocumentAsPDF(doc: Document, elementId: string = 'document-view'): Promise<void> {
  try {
    if (typeof window === 'undefined') {
      throw new Error('PDF download is only available in the browser');
    }
    
    const element = window.document.getElementById(elementId);
    if (!element) {
      throw new Error('Document element not found');
    }

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    
        // Calculate PDF dimensions - strictly A4
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Create PDF with strict A4 dimensions
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });
        
        // Ensure the content fits exactly on one A4 page
        // Scale down if content is taller than A4
        let finalHeight = imgHeight;
        let finalWidth = imgWidth;
        
        if (imgHeight > pageHeight) {
          // Scale down proportionally to fit on one page
          const scale = pageHeight / imgHeight;
          finalHeight = pageHeight;
          finalWidth = imgWidth * scale;
        }
        
        // Center the content if it's smaller than A4
        const xOffset = (imgWidth - finalWidth) / 2;
        const yOffset = 0;
        
        // Add image to PDF - single page only
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);

    // Generate filename
    const documentType = doc.type === 'invoice' ? 'Invoice' : 
                        doc.type === 'quotation' ? 'Quotation' : 
                        'Receipt';
    const filename = `${documentType}_${doc.documentNumber}.pdf`;

    // Download PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

