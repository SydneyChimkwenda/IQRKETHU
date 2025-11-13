import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side PDF generation using PDFShift.io API
 * This keeps the API key secure on the server
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { html }: { html: string } = body;

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

    // Get API key from server-side environment variable (no NEXT_PUBLIC_ prefix)
    const apiKey = process.env.PDFSHIFT_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'PDFShift API key is not configured',
          details: 'Please set PDFSHIFT_API_KEY in your server environment variables'
        },
        { status: 500 }
      );
    }

    // Call PDFShift API
    const response = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: html,
        format: 'A4',
        margin: '0mm',
        print_background: true,
        wait_for: 'networkidle0',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: 'Unknown error occurred',
        message: response.statusText 
      }));
      
      return NextResponse.json(
        {
          error: `PDFShift API error (${response.status})`,
          details: errorData.error || errorData.message || 'Failed to generate PDF'
        },
        { status: response.status }
      );
    }

    // Get the PDF as a buffer
    const pdfBuffer = await response.arrayBuffer();
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

    // Return PDF as base64
    return NextResponse.json({
      success: true,
      pdfBase64,
      contentType: 'application/pdf'
    });

  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error?.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

