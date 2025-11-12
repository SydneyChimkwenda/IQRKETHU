# Netlify Deployment Guide - PDF Generation

This guide explains how PDF generation is configured to work on Netlify's serverless platform.

## Configuration Overview

### 1. Netlify Configuration (`netlify.toml`)

The `netlify.toml` file configures:
- **Next.js Plugin**: Automatically converts Next.js API routes to Netlify Functions
- **Function Settings**:
  - Node bundler: esbuild (for faster builds)
  - Included files: lib/** and types/** for PDF generation

**Important**: Timeout and memory settings need to be configured in the Netlify Dashboard:
1. Go to Netlify Dashboard → Site settings → Functions
2. Set timeout to 60 seconds (or 26s for free tier)
3. Set memory to 3008MB (required for Chromium/Puppeteer)

Alternatively, you can configure these via Netlify's API or CLI.

### 2. PDF Generation Setup

#### Dependencies
- **`puppeteer-core`**: Lightweight Puppeteer without bundled Chromium
- **`@sparticuz/chromium`**: Serverless-optimized Chromium binary for AWS Lambda/Netlify
- **`puppeteer`** (dev): Full Puppeteer for local development

#### How It Works

1. **Environment Detection**: The code automatically detects Netlify environment using:
   - `process.env.NETLIFY === 'true'`
   - `process.env.NETLIFY_DEV === 'true'`
   - Production mode detection

2. **Chromium Configuration**: 
   - In Netlify: Uses `@sparticuz/chromium` (serverless-optimized)
   - In Development: Uses system Chrome or full Puppeteer

3. **PDF Storage**:
   - **Netlify**: Returns PDF as base64 (since filesystem is read-only)
   - **Development**: Saves to `public/pdfs/` directory

### 3. API Endpoints

#### POST `/api/documents`
Generates a PDF and returns:
- `documentId`: Unique identifier
- `downloadLink`: URL to download the PDF
- `pdfBase64`: Base64 encoded PDF (Netlify only)
- `filename`: Suggested filename

#### GET `/api/documents/[id]/download`
Serves the PDF file for download.

## Deployment Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Build Locally** (optional, to test):
   ```bash
   npm run build
   ```

3. **Deploy to Netlify**:
   - Push your code to GitHub/GitLab/Bitbucket
   - Connect your repository to Netlify
   - Netlify will automatically:
     - Install dependencies
     - Run `npm run build`
     - Deploy using the `netlify.toml` configuration

4. **Verify Deployment**:
   - Check Netlify Function logs for any errors
   - Test PDF generation through your app
   - Monitor function execution time and memory usage

## Troubleshooting

### PDF Generation Fails

1. **Check Function Logs**: 
   - Go to Netlify Dashboard → Functions → View logs
   - Look for Chromium/Puppeteer errors

2. **Timeout Issues**:
   - If PDFs are large/complex, they might exceed the 26s free tier limit
   - Consider upgrading to Pro plan (60s timeout)
   - Or optimize the HTML template to render faster

3. **Memory Issues**:
   - Ensure memory is set to 3008MB in `netlify.toml`
   - Check function logs for "out of memory" errors

4. **Chromium Not Found**:
   - Verify `@sparticuz/chromium` is in dependencies
   - Check that environment detection is working correctly

### Build Errors

1. **Module Resolution**:
   - Ensure all dependencies are in `package.json`
   - Run `npm install` locally to verify

2. **TypeScript Errors**:
   - Run `npm run build` locally to catch errors early
   - Check `tsconfig.json` configuration

## Performance Optimization

The PDF generation is optimized for Netlify:
- Uses `waitUntil: 'load'` instead of `networkidle0` (faster)
- Sets viewport size for consistent rendering
- Uses optimized Chromium flags
- Returns base64 directly (no file I/O in serverless)

## Environment Variables

No additional environment variables are required for PDF generation. The code automatically detects the Netlify environment.

Optional:
- `NEXT_PUBLIC_BASE_URL`: Base URL for generating download links (defaults to request origin)

## Notes

- PDFs in Netlify are returned as base64 in the response (not stored on filesystem)
- The download link includes the base64 data as a URL parameter
- For production, consider implementing a proper storage solution (S3, etc.) if you need persistent PDF storage

