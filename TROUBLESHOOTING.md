# Troubleshooting Guide

## Issue 1: "PDF Generation Error: The provided API Key was not found"

### Problem
When trying to send an email, you get: `PDF Generation Error: Failed to generate PDF: The provided API Key was not found.`

### Root Cause
This is a **backend configuration issue** on Render. The EmailJS Private Key is missing or incorrect.

### Solution

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your backend service** (e.g., `iqr-backend-dt8n`)
3. **Go to Environment tab**
4. **Check/Update EmailJS_PRIVATE_KEY**:
   - The value should be: `o5RNvcNkCAHNqI7bDYsDH`
   - If it's missing or different, update it
5. **Verify all EmailJS variables are set**:
   ```
   EMAILJS_SERVICE_ID=service_87lsqgg
   EMAILJS_TEMPLATE_ID=template_1ybmi2b
   EMAILJS_PUBLIC_KEY=tCdbv6Pt8Pe2w677F
   EMAILJS_PRIVATE_KEY=o5RNvcNkCAHNqI7bDYsDH
   ```
6. **Restart the backend service**:
   - Click "Manual Deploy" → "Clear build cache & deploy"
   - Or wait for auto-deploy

### Verify Fix
After updating, wait 1-2 minutes for the service to restart, then try sending an email again.

---

## Issue 2: Netlify Build Failing

### Problem
Netlify deployment fails but local build succeeds.

### Common Causes & Solutions

#### 1. Missing Environment Variables
**Check**: Netlify Dashboard → Site settings → Environment variables

**Required variable**:
```
NEXT_PUBLIC_BACKEND_API_URL=https://iqr-backend-dt8n.onrender.com
```

**How to add**:
1. Go to Netlify Dashboard
2. Site settings → Environment variables
3. Click "Add variable"
4. Key: `NEXT_PUBLIC_BACKEND_API_URL`
5. Value: `https://iqr-backend-dt8n.onrender.com`
6. Click "Save"
7. Trigger a new deploy

#### 2. Node Version Mismatch
**Check**: `netlify.toml` has `NODE_VERSION = "22"`

**Verify in Netlify**:
1. Site settings → Build & deploy → Environment
2. Ensure Node version is 22 or matches your local version

#### 3. Build Timeout
**Check**: Netlify free tier has 15-minute build timeout

**Solution**: 
- Check build logs for timeout errors
- Optimize build if needed
- Consider upgrading Netlify plan

#### 4. Missing Dependencies
**Check**: Build logs for "module not found" errors

**Solution**: 
- Ensure `package.json` has all dependencies
- Run `npm ci` locally to verify
- Check that `package-lock.json` is committed

#### 5. TypeScript/Build Errors
**Check**: Build logs for specific error messages

**Solution**:
- Fix errors locally first (`npm run build`)
- Ensure all TypeScript errors are resolved
- Check for missing type definitions

### How to Get Build Logs

1. Go to Netlify Dashboard
2. Click on your site
3. Go to **Deploys** tab
4. Click on the failed deploy
5. Click **View build log**
6. Look for error messages (usually in red)

### Quick Fix Checklist

- [ ] `NEXT_PUBLIC_BACKEND_API_URL` is set in Netlify environment variables
- [ ] Node version matches (22)
- [ ] `package.json` and `package-lock.json` are committed
- [ ] Local build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] `netlify.toml` is correct

---

## Issue 3: Backend Not Responding

### Symptoms
- Timeout errors
- 503 Service Unavailable
- Connection refused

### Causes

#### Render Free Tier Sleep
Render free tier services spin down after 15 minutes of inactivity.

**Solution**: 
- First request will take 30-60 seconds to wake up
- This is normal behavior
- Consider upgrading to paid plan for always-on service

#### Backend Crashed
**Check**: Render Dashboard → Logs

**Solution**:
- Review error logs
- Fix the issue
- Restart the service

---

## Testing Backend Connection

### Test PDF Generation
```bash
curl -X POST https://iqr-backend-dt8n.onrender.com/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{
    "document": {
      "type": "invoice",
      "documentNumber": "TEST-001",
      "date": "2024-01-01",
      "customerName": "Test Customer",
      "items": [{"description": "Test", "quantity": 1, "unitPrice": 100, "total": 100}],
      "subtotal": 100,
      "taxRate": 0,
      "taxAmount": 0,
      "discount": 0,
      "total": 100
    },
    "moduleName": "KETHU GROUPS"
  }'
```

### Test Email Sending
```bash
curl -X POST https://iqr-backend-dt8n.onrender.com/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "document": {
      "type": "invoice",
      "documentNumber": "TEST-001",
      "date": "2024-01-01",
      "customerName": "Test Customer",
      "items": [],
      "subtotal": 0,
      "taxRate": 0,
      "taxAmount": 0,
      "discount": 0,
      "total": 0
    },
    "recipientEmail": "test@example.com",
    "recipientName": "Test",
    "moduleName": "KETHU GROUPS"
  }'
```

---

## Still Having Issues?

1. **Check Render Logs**: Render Dashboard → Your Service → Logs
2. **Check Netlify Logs**: Netlify Dashboard → Deploys → Build Log
3. **Check Browser Console**: Open DevTools → Console tab
4. **Check Network Tab**: Open DevTools → Network tab → Look for failed requests

