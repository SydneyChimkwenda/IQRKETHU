import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import SplashScreenWrapper from "@/components/SplashScreenWrapper";

export const metadata: Metadata = {
  title: "Kethu Groups - Invoice, Quotation & Receipt Manager",
  description: "Manage invoices, quotations, and receipts for Kethu Groups",
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

