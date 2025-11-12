import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Document } from '@/types';
import { generatePDFFromDocument } from '@/lib/server-pdf';

// Ensure PDFs directory exists
const PDFS_DIR = join(process.cwd(), 'public', 'pdfs');

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

    // Save PDF to file system
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
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    );
  }
}

