import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Use /tmp in Netlify or public/pdfs in development
const isNetlify = 
  process.env.NETLIFY === 'true' || 
  process.env.NETLIFY_DEV === 'true' ||
  (process.env.NODE_ENV === 'production' && process.env.VERCEL !== 'true');
const PDFS_DIR = isNetlify 
  ? join('/tmp', 'pdfs')
  : join(process.cwd(), 'public', 'pdfs');

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // In production, check for base64 parameter (from generation)
    const { searchParams } = new URL(request.url);
    const base64Pdf = searchParams.get('base64');
    
    if (base64Pdf) {
      // Return PDF from base64
      const pdfBuffer = Buffer.from(base64Pdf, 'base64');
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${documentId}.pdf"`,
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // In development, try to read from file system
    const filepath = join(PDFS_DIR, `${documentId}.pdf`);

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Read PDF file
    const pdfBuffer = await readFile(filepath);

    // Return PDF with appropriate headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${documentId}.pdf"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Error serving PDF:', error);
    return NextResponse.json(
      { error: 'Failed to serve PDF', details: error.message },
      { status: 500 }
    );
  }
}


