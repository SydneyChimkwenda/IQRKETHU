# PDF Generation Troubleshooting Guide

## Common Issues and Solutions

### 1. Check Netlify Function Logs

The most important step is to check the function logs in your Netlify dashboard:

1. Go to **Netlify Dashboard** → Your Site → **Functions**
2. Click on the function that failed (likely `/api/documents`)
3. Check the **Logs** tab for detailed error messages

The improved error handling will now show:
- Environment detection details
- Chromium executable path
- Specific error messages

### 2. Verify Chromium Installation

Check that `@sparticuz/chromium` is properly installed:

```bash
npm list @sparticuz/chromium
```

If it's not installed, run:
```bash
npm install @sparticuz/chromium
```

### 3. Check Function Configuration

Ensure your Netlify function has:
- **Timeout**: 60 seconds (Pro) or 26 seconds (Free tier)
- **Memory**: 3008MB (required for Chromium)

To configure:
1. Netlify Dashboard → Site settings → Functions
2. Set timeout and memory as above

### 4. Common Error Messages

#### "Chromium executable path not found"
- **Cause**: `@sparticuz/chromium` not installed or not bundled correctly
- **Solution**: 
  - Verify package is in `package.json` dependencies
  - Check that `npm install` completed successfully
  - Ensure the package is not in `devDependencies`

#### "PDF generation timed out"
- **Cause**: Function timeout too short or document too complex
- **Solution**:
  - Increase function timeout to 60 seconds (Pro plan)
  - Simplify the HTML template if possible
  - Check function logs for actual execution time

#### "Insufficient memory"
- **Cause**: Function memory allocation too low
- **Solution**:
  - Increase memory to 3008MB in Netlify dashboard
  - This is the maximum and required for Chromium

#### "Failed to configure Chromium for serverless"
- **Cause**: Chromium binary not accessible or corrupted
- **Solution**:
  - Reinstall `@sparticuz/chromium`: `npm uninstall @sparticuz/chromium && npm install @sparticuz/chromium`
  - Check Netlify build logs for installation errors
  - Verify the package version is compatible (^131.0.0)

### 5. Environment Detection

The code now logs environment detection. Check logs for:
```
PDF Generation Environment: {
  isNetlify: true/false,
  isProduction: true/false,
  isVercel: true/false,
  useServerlessChromium: true/false
}
```

If `useServerlessChromium` is `false` when it should be `true`, check:
- `process.env.NETLIFY` is set to 'true'
- `process.env.NODE_ENV` is 'production'

### 6. Test Locally with Netlify Dev

Test the function locally using Netlify Dev:

```bash
npm install -g netlify-cli
netlify dev
```

This will simulate the Netlify environment and help catch issues early.

### 7. Verify Build Process

Check that the build completes successfully:
- Look for any errors during `npm install`
- Verify `@sparticuz/chromium` is installed during build
- Check for any warnings about missing dependencies

### 8. Alternative: Use Client-Side PDF Generation

If server-side PDF generation continues to fail, you can use the existing client-side option:

The app already has `lib/pdf.ts` which uses `jsPDF` and `html2canvas` for client-side PDF generation. This works in the browser and doesn't require server resources.

To use it, call `downloadDocumentAsPDF()` instead of `generatePDFLink()`.

### 9. Check Function Size Limits

Netlify Functions have size limits:
- Function code + dependencies must be under 50MB (uncompressed)
- Chromium binary is large, but should fit within limits

If you hit size limits:
- Consider using a lighter PDF library
- Or use an external PDF generation service

### 10. Get Detailed Error Information

The improved error handling now provides:
- Detailed error messages
- Stack traces
- Environment information
- Chromium configuration status

Check the function logs for these details to pinpoint the exact issue.

## Still Having Issues?

If PDF generation still fails after trying these solutions:

1. **Share the exact error message** from Netlify function logs
2. **Check the environment detection logs** - what values are shown?
3. **Verify the Chromium executable path** - is it being found?
4. **Check function execution time** - is it timing out?
5. **Verify memory usage** - is it hitting memory limits?

The detailed logging should help identify the specific issue.

