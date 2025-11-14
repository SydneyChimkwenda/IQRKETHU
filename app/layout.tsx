import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import SplashScreenWrapper from "@/components/SplashScreenWrapper";

export const metadata: Metadata = {
  title: "Kethu Groups - Invoice, Quotation & Receipt Manager",
  description: "Manage invoices, quotations, and receipts for Kethu Groups",
  icons: {
    icon: '/favicon-16x16.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SplashScreenWrapper>
          <AuthGuard>{children}</AuthGuard>
        </SplashScreenWrapper>
      </body>
    </html>
  );
}

