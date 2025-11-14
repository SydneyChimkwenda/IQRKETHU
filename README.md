# Kethu Groups - Invoice, Quotation & Receipt Manager

A modern Next.js application for managing invoices, quotations, and receipts for Kethu Groups.

## Features

- 📄 **Invoice Management** - Create, view, edit, and delete invoices
- 📋 **Quotation Management** - Create, view, edit, and delete quotations
- 🧾 **Receipt Management** - Create, view, edit, and delete receipts
- 💰 **Financial Tracking** - Dashboard with revenue and document statistics
- 🖨️ **Print Support** - Print-friendly document views
- 📧 **Email Sending** - Send professional invoices, quotations, and receipts via email
- 💾 **Local Storage** - All data is stored locally in your browser
- 🎨 **Professional Templates** - Beautiful, modern document templates with color-coded headers

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating Documents

1. Navigate to the desired document type (Invoices, Quotations, or Receipts)
2. Click "New [Document Type]" button
3. Fill in the form:
   - Document information (number, date, due date for invoices)
   - Customer information
   - Line items (description, quantity, unit price)
   - Tax rate and discount (optional)
   - Notes (optional)
4. Click "Create" to save

### Managing Documents

- **View**: Click the eye icon or document number to view
- **Edit**: Click the edit icon to modify
- **Delete**: Click the trash icon to remove
- **Print**: Use the print button when viewing a document
- **Send Email**: Click the "Send Email" button to email the document to customers

### Dashboard

The dashboard provides:
- Quick statistics (counts and total revenue)
- Quick action buttons to create new documents
- Recent documents list

## Backend API Configuration

The frontend communicates with a backend API deployed on Render for PDF generation and email sending.

### Setting up Backend API URL

1. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_BACKEND_API_URL=https://your-backend-url.onrender.com
```

2. Replace `your-backend-url.onrender.com` with your actual Render backend URL.

3. For local development (if running backend locally):
```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3001
```

4. Restart your development server after creating/updating the `.env.local` file.

**Note**: The `.env.local` file is already in `.gitignore` and will not be committed to version control.

## Email Configuration

The app supports sending documents via email in two ways:

1. **Backend API** (default): The backend handles email sending using EmailJS. If the backend is not available, the app will fall back to opening your default email client with a pre-filled message.

2. **Frontend EmailJS** (new): You can also send emails directly from the frontend using EmailJS. To use this feature, add these environment variables to your `.env.local` file:

```env
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
```

**For Netlify deployment**, add these same environment variables in your Netlify dashboard under Site settings → Environment variables.

**Note**: Your EmailJS template should include a `{documentUrl}` or `{document_url}` variable that will be replaced with the document download link.

See `DEPLOYMENT.md` for backend setup instructions.

## Data Storage

All data is stored locally in your browser's localStorage. This means:
- Data persists between sessions
- Data is specific to your browser
- No server or database required

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── invoices/          # Invoice pages
│   ├── quotations/        # Quotation pages
│   ├── receipts/          # Receipt pages
│   └── page.tsx           # Dashboard
├── components/            # React components
│   ├── DocumentForm.tsx   # Form for creating/editing documents
│   ├── DocumentView.tsx   # Professional document view component
│   ├── SendEmailModal.tsx # Email sending modal
│   └── Navigation.tsx     # Navigation bar
├── lib/                   # Utility functions
│   ├── storage.ts         # LocalStorage management
│   ├── utils.ts           # Helper functions
│   └── email.ts           # Email sending functionality
└── types/                 # TypeScript type definitions
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **date-fns** - Date formatting
- **EmailJS** - Email sending service (optional)

## Build for Production

```bash
npm run build
npm start
```

## License

This project is for Kethu Groups internal use.

