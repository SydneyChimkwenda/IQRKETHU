# Backend API Documentation

## Overview
The backend API handles PDF generation, storage, and serving for invoices, quotations, and receipts.

## API Endpoints

### POST `/api/documents`
Generates a PDF from document data and returns a unique download link.

**Request Body:**
```json
{
  "document": {
    "id": "string",
    "type": "invoice" | "quotation" | "receipt",
    "documentNumber": "string",
    "date": "string (ISO date)",
    "customerName": "string",
    "items": [...],
    "subtotal": number,
    "taxRate": number,
    "taxAmount": number,
    "discount": number,
    "total": number,
    ...
  },
  "moduleName": "KETHU GROUPS" | "KETHU CONSULTS" | "KETHU MENTORS" (optional)
}
```

**Response:**
```json
{
  "success": true,
  "documentId": "uuid",
  "downloadLink": "https://yourdomain.com/api/documents/{documentId}/download",
  "filename": "invoice_INV-001.pdf"
}
```

### GET `/api/documents/[id]/download`
Serves the PDF file for download.

**Response:**
- Content-Type: `application/pdf`
- Returns the PDF file directly

## Usage in Frontend

```typescript
import { generatePDFLink } from '@/lib/api-client';

// Generate PDF and get download link
const result = await generatePDFLink(document);
if (result.success) {
  console.log('Download link:', result.downloadLink);
  // Use this link in EmailJS or share with recipients
}
```

## File Storage

- PDFs are stored in `/public/pdfs/` directory
- Each PDF is named with a unique UUID: `{documentId}.pdf`
- The directory is automatically created if it doesn't exist

## Environment Variables

Optional:
- `NEXT_PUBLIC_BASE_URL`: Base URL for generating download links (defaults to request origin)

## Notes

- PDFs are generated server-side using Puppeteer
- Each document gets a unique UUID for secure access
- PDFs are stored permanently (consider cleanup strategy for production)

