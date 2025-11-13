# Backend API Setup Guide

## Quick Setup

Since your backend is already deployed on Render, you just need to configure the frontend to connect to it.

### Step 1: Get Your Render Backend URL

1. Go to your Render Dashboard: https://dashboard.render.com
2. Find your backend service
3. Copy the service URL (e.g., `https://iqr-backend.onrender.com`)

### Step 2: Create Environment File

Create a `.env.local` file in the root directory of this project with the following content:

```env
NEXT_PUBLIC_BACKEND_API_URL=https://your-backend-url.onrender.com
```

**Replace `your-backend-url.onrender.com` with your actual Render backend URL.**

### Step 3: Restart Development Server

If your development server is running, restart it:

```bash
# Stop the server (Ctrl+C), then:
npm run dev
```

### Step 4: Verify Connection

The frontend will now communicate with your Render backend for:
- PDF generation (`/api/pdf/generate`)
- Email sending (`/api/email/send`)

## For Production Deployment

When deploying the frontend (Netlify/Vercel), make sure to add the environment variable in your hosting platform's dashboard:

- **Variable Name**: `NEXT_PUBLIC_BACKEND_API_URL`
- **Value**: Your Render backend URL (e.g., `https://iqr-backend.onrender.com`)

## Troubleshooting

### Frontend can't connect to backend

1. **Check the URL**: Make sure the Render backend URL is correct and includes `https://`
2. **Check Render Status**: Verify your backend service is running on Render
3. **Check CORS**: Ensure your backend has CORS enabled (should be configured already)
4. **Check Network**: Open browser DevTools → Network tab to see the actual requests

### Common Issues

- **404 errors**: Backend URL might be incorrect
- **CORS errors**: Backend needs to allow requests from your frontend domain
- **Timeout errors**: Render free tier services may spin down after inactivity

## Local Development

If you want to test with a local backend:

```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3001
```

Make sure your local backend is running on port 3001.

