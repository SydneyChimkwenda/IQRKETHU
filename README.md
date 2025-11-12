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

## Email Configuration (Optional)

The app supports sending documents via email using EmailJS. If EmailJS is not configured, the app will fall back to opening your default email client with a pre-filled message.

### Setting up EmailJS

1. Sign up for a free account at [EmailJS](https://www.emailjs.com/)
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template with the following variables:
   - `to_email` - Recipient email
   - `to_name` - Recipient name
   - `from_name` - Your company name
   - `from_email` - Your email
   - `subject` - Email subject
   - `message` - Email message
   - `document_html` - HTML content of the document
   - `document_number` - Document number
   - `document_type` - Invoice/Quotation/Receipt
   - `total_amount` - Total amount
   - `document_date` - Document date

4. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

5. Restart your development server

**Note**: Without EmailJS configuration, the app will use `mailto:` links as a fallback, which opens your default email client.

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

