# Deployment Guide

This guide explains how to deploy the IQR application with separated frontend and backend.

## Architecture

- **Frontend**: Next.js application (deployed on Netlify/Vercel)
- **Backend**: Express.js API server (deployed on Render)

## Backend Deployment (Render)

### Prerequisites

1. Create a Render account at [render.com](https://render.com)
2. Connect your GitHub repository

### Steps

1. **Create a New Web Service**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Configure the Service**
   - **Name**: `iqr-backend` (or your preferred name)
   - **Root Directory**: Leave empty (repository root)
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free tier is fine for testing

3. **Set Environment Variables**
   Add the following in Render's Environment Variables section:
   ```
   EMAILJS_SERVICE_ID=service_87lsqgg
   EMAILJS_TEMPLATE_ID=tamplate_1ybmi2b
   EMAILJS_PUBLIC_KEY=tCdbv6Pt8Pe2w677F
   EMAILJS_PRIVATE_KEY=o5RNvcNkCAHNqI7bDYsDH
   COMPANY_NAME=KETHU GROUPS
   COMPANY_TAGLINE=Second to None – Serving You the Best Way
   COMPANY_ADDRESS=P.O. Box 2069, Area 7, Lilongwe
   COMPANY_PHONE=+265 888 921 085
   COMPANY_EMAIL=kethugroups@hotmail.com
   FROM_EMAIL=kethugroups@hotmail.com
   REPLY_TO_EMAIL=kethugroups@hotmail.com
   PORT=3001
   NODE_ENV=production
   ```

**Important**: The backend is deployed on Render, NOT Netlify. Only the frontend should be deployed on Netlify/Vercel.

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - Note the service URL (e.g., `https://iqr-backend.onrender.com`)

## Frontend Deployment (Netlify/Vercel)

### Prerequisites

1. Create a Netlify or Vercel account
2. Connect your GitHub repository

### Steps

1. **Create a New Site**
   - Go to Netlify/Vercel Dashboard
   - Click "New Site" / "New Project"
   - Connect your repository

2. **Configure Build Settings**
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next` (for Vercel) or `out` (if using static export)
   - **Framework Preset**: Next.js

3. **Set Environment Variables**
   Add the following:
   ```
   NEXT_PUBLIC_BACKEND_API_URL=https://your-backend-url.onrender.com
   ```
   Replace `your-backend-url.onrender.com` with your actual Render backend URL.

4. **Deploy**
   - Click "Deploy Site"
   - Your frontend will build and deploy

## Local Development

### Backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp env.example .env
   ```

4. Fill in your EmailJS credentials in `.env`

5. Start the server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

The backend will run on `http://localhost:3001`

### Frontend

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file:
   ```env
   NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3001
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## EmailJS Setup

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - `to_email`
   - `to_name`
   - `from_name`
   - `from_email`
   - `reply_to`
   - `subject`
   - `message`
   - `document_html`
   - `document_number`
   - `document_type`
   - `total_amount`
   - `document_date`
   - `pdf_download_link`

4. Get your credentials:
   - Service ID
   - Template ID
   - Public Key
   - Private Key (from Account → API Keys)

5. Add these to your backend environment variables on Render

## Testing

1. **Test Backend Locally**:
   ```bash
   curl http://localhost:3001/health
   ```

2. **Test Email Sending**:
   Use the frontend to send a test email

3. **Check Logs**:
   - Render Dashboard → Your Service → Logs
   - Check for any errors

## Troubleshooting

### Backend Issues

- **Port already in use**: Change `PORT` in `.env`
- **EmailJS errors**: Verify all credentials are correct
- **CORS errors**: Backend has CORS enabled, should work

### Frontend Issues

- **Cannot connect to backend**: Check `NEXT_PUBLIC_BACKEND_API_URL` is set correctly
- **Network errors**: Verify backend is running and accessible

### Common Issues

1. **Backend URL not accessible**: 
   - Check Render service is running
   - Verify the URL is correct
   - Check firewall/network settings

2. **Email not sending**:
   - Verify EmailJS credentials
   - Check backend logs for errors
   - Verify email template variables match

3. **CORS errors**:
   - Backend has CORS enabled for all origins
   - If issues persist, check Render logs

## Security Notes

- Never commit `.env` files
- Keep EmailJS private key secure
- Use environment variables for all sensitive data
- Backend API should be accessible only from your frontend domain (consider adding origin restrictions)

