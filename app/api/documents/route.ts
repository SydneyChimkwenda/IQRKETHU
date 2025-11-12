import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Document } from '@/types';
import { generatePDFFromDocument } from '@/lib/server-pdf';

// Use /tmp in production (Netlify) or public/pdfs in development
const isNetlify = 
  process.env.NETLIFY === 'true' || 
  process.env.NETLIFY_DEV === 'true' ||
  (process.env.NODE_ENV === 'production' && process.env.VERCEL !== 'true');
const PDFS_DIR = isNetlify 
  ? join('/tmp', 'pdfs')
  : join(process.cwd(), 'public', 'pdfs');

async function ensurePdfsDirectory() {
  if (!existsSync(PDFS_DIR)) {
    await mkdir(PDFS_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { document, moduleName }: { document: Document; moduleName?: string } = body;

    // Validate document data
    if (!document || !document.type || !document.documentNumber) {
      return NextResponse.json(
        { error: 'Invalid document data' },
        { status: 400 }
      );
    }

    // Ensure PDFs directory exists
    await ensurePdfsDirectory();

    // Generate unique ID for this document
    const documentId = uuidv4();
    
    // Generate PDF with module name
    const pdfBuffer = await generatePDFFromDocument(document, moduleName);

    // In Netlify, return PDF as base64 since /tmp is temporary
    // In development, save to file system
    if (isNetlify) {
      // Return PDF as base64 for direct download
      const base64Pdf = pdfBuffer.toString('base64');
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                     request.nextUrl.origin;
      
      return NextResponse.json({
        success: true,
        documentId,
        pdfBase64: base64Pdf,
        downloadLink: `${baseUrl}/api/documents/${documentId}/download?base64=${encodeURIComponent(base64Pdf)}`,
        filename: `${document.type}_${document.documentNumber}.pdf`
      });
    } else {
      // Save PDF to file system (development)
      const filename = `${documentId}.pdf`;
      const filepath = join(PDFS_DIR, filename);
      await writeFile(filepath, pdfBuffer);

      // Create download link
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                     request.nextUrl.origin;
      const downloadLink = `${baseUrl}/api/documents/${documentId}/download`;

      return NextResponse.json({
        success: true,
        documentId,
        downloadLink,
        filename: `${document.type}_${document.documentNumber}.pdf`
      });
    }
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF', 
        details: error?.message || 'Unknown error occurred',
        type: error?.name || 'Error',
      },
      { status: 500 }
    );
  }
}

