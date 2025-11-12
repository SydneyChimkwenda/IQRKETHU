# PDFShift.io Integration Setup Guide

This guide explains how to set up PDFShift.io for PDF generation in your invoice/quotation/receipt app.

## Overview

The app now uses PDFShift.io to generate PDFs directly from the browser (frontend-only). This works on Netlify without requiring a backend server.

## Setup Instructions

### 1. Get Your PDFShift API Key

1. Sign up for a free account at [https://pdfshift.io](https://pdfshift.io)
2. Log in to your dashboard
3. Navigate to API Keys section
4. Copy your API key

### 2. Local Development Setup

1. Create a file named `.env.local` in the root directory of your project
2. Add the following line:
   ```
   NEXT_PUBLIC_PDFSHIFT_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with your actual API key
4. **Important**: Restart your development server after adding the variable
   ```bash
   npm run dev
   ```

### 3. Netlify Deployment Setup

1. Go to your [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Navigate to: **Site settings** → **Environment variables**
4. Click **Add variable**
5. Enter:
   - **Key**: `NEXT_PUBLIC_PDFSHIFT_API_KEY`
   - **Value**: Your PDFShift API key
6. Click **Save**
7. **Important**: Redeploy your site for the changes to take effect
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

## Testing

### Test Locally

1. Make sure `.env.local` is set up with your API key
2. Start your dev server: `npm run dev`
3. Open your app in the browser
4. Create or open an invoice/quotation/receipt
5. Click "Send Email" button
6. The PDF should generate automatically before sending the email

### Test on Netlify

1. After setting the environment variable and redeploying:
2. Open your deployed site
3. Try sending an email with a document
4. Check the browser console (F12) for any errors

## Troubleshooting

### Error: "PDFShift API key is not configured"

**Solution**: 
- Check that `NEXT_PUBLIC_PDFSHIFT_API_KEY` is set in `.env.local` (local) or Netlify environment variables (production)
- Make sure the variable name is exactly `NEXT_PUBLIC_PDFSHIFT_API_KEY` (case-sensitive)
- Restart your dev server or redeploy on Netlify

### Error: "PDFShift API error (401)"

**Solution**:
- Verify your API key is correct
- Check that your PDFShift account is active
- Ensure you haven't exceeded your API quota

### Error: "Network error while generating PDF"

**Solution**:
- Check your internet connection
- Verify PDFShift.io is accessible
- Check browser console for CORS errors (shouldn't happen with PDFShift)

### PDF Generation is Slow

**Solution**:
- This is normal - PDF generation takes a few seconds
- The app shows "Generating PDF..." status during this time
- For faster generation, consider upgrading your PDFShift plan

## How It Works

1. When user clicks "Send Email":
   - The app generates HTML from the document
   - Sends HTML to PDFShift.io API
   - Receives PDF as a blob
   - Converts to a downloadable URL
   - Includes the PDF link in the email

2. The PDF is generated in the browser (client-side)
   - No backend server required
   - Works on Netlify Functions
   - Secure (API key is in environment variables)

## Code Location

- **PDF Generation Function**: `lib/pdfshift.ts`
- **Email Integration**: `components/SendEmailModal.tsx`
- **HTML Generation**: `lib/email.ts` (generateEmailHTML function)

## API Usage

PDFShift.io offers a free tier with limited conversions. Check your usage in the PDFShift dashboard.

For production use, consider:
- Monitoring your API usage
- Setting up usage alerts
- Upgrading your plan if needed

## Support

- PDFShift Documentation: [https://pdfshift.io/docs](https://pdfshift.io/docs)
- PDFShift Support: Check their website for support options

