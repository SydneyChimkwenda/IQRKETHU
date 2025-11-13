import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Document } from '@/types';

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

    // This endpoint is deprecated - PDF generation is now handled by the backend on Render
    // Redirect to use backend API instead
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001';
    
    return NextResponse.json(
      { 
        error: 'This endpoint is deprecated. Please use the backend API for PDF generation.',
        backendUrl: `${backendUrl}/api/pdf/generate`,
        message: 'PDF generation is now handled by the backend service on Render.'
      },
      { status: 410 } // 410 Gone - indicates the resource is no longer available
    );

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

