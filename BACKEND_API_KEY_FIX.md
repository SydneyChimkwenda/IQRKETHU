# Backend API Key Error Fix

## Error Message
```
PDF Generation Error: Failed to generate PDF: The provided API Key was not found.
```

## Root Cause
This error is coming from your **Render backend**, not the frontend. The backend is trying to use EmailJS but the EmailJS Private Key is missing or incorrect in your Render environment variables.

## Solution

### Step 1: Check Render Backend Environment Variables

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service (`iqr-backend-dt8n`)
3. Go to **Environment** tab
4. Verify these EmailJS environment variables are set:

```
EMAILJS_SERVICE_ID=service_87lsqgg
EMAILJS_TEMPLATE_ID=template_1ybmi2b
EMAILJS_PUBLIC_KEY=tCdbv6Pt8Pe2w677F
EMAILJS_PRIVATE_KEY=o5RNvcNkCAHNqI7bDYsDH
```

### Step 2: Verify EmailJS Private Key

The **EMAILJS_PRIVATE_KEY** is the most critical one. To get it:

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com)
2. Navigate to **Account** → **API Keys**
3. Copy the **Private Key** (not the Public Key)
4. Update it in Render's environment variables

### Step 3: Restart Backend Service

After updating environment variables:
1. In Render Dashboard, click **Manual Deploy** → **Clear build cache & deploy**
2. Or wait for auto-deploy (if connected to Git)

### Step 4: Test the Backend

Test the backend directly:
```bash
curl -X POST https://iqr-backend-dt8n.onrender.com/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{"document":{"type":"invoice","documentNumber":"TEST-001","date":"2024-01-01","customerName":"Test","items":[],"subtotal":0,"taxRate":0,"taxAmount":0,"discount":0,"total":0},"moduleName":"KETHU GROUPS"}'
```

## Why This Happens

The error occurs because:
1. Frontend calls backend at `/api/pdf/generate`
2. Backend generates PDF successfully
3. But if backend also tries to send email (or validate EmailJS config), it fails
4. The error message gets returned to frontend

**Note**: PDF generation itself doesn't need EmailJS, but the backend might be checking EmailJS configuration during startup or the error might be from a different endpoint.

## Additional Checks

### Check Backend Logs on Render
1. Go to Render Dashboard → Your Service → **Logs**
2. Look for errors related to:
   - "API Key was not found"
   - "EmailJS"
   - "authentication"

### Verify Backend Code
The backend should handle missing EmailJS gracefully. If PDF generation fails due to EmailJS, the backend code might need to be updated to:
- Only use EmailJS for `/api/email/send` endpoint
- Not require EmailJS for `/api/pdf/generate` endpoint

## For Netlify Build Issues

If Netlify build is still failing, check:
1. **Netlify Build Logs**: Go to Netlify Dashboard → Deploys → Click on failed deploy → View build log
2. **Environment Variables**: Ensure `NEXT_PUBLIC_BACKEND_API_URL` is set in Netlify
3. **Node Version**: Netlify should use Node 22 (set in netlify.toml)

