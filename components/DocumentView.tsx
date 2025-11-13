'use client';

import { Document } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { getModuleName } from '@/lib/module';
import { Phone, Mail, MapPin } from 'lucide-react';

interface DocumentViewProps {
  document: Document;
}

export default function DocumentView({ document }: DocumentViewProps) {
  const companyInfo = storage.getCompanyInfo();
  const documentTitle = document.type === 'invoice' ? 'INVOICE' : 
                        document.type === 'quotation' ? 'QUOTATION' : 
                        'RECEIPT';

  // Dynamic labels based on document type
  const documentTypeLabel = document.type === 'invoice' ? 'Invoice' : 
                            document.type === 'quotation' ? 'Quotation' : 
                            'Receipt';
  const documentNumberLabel = `${documentTypeLabel} no`;
  const documentToLabel = `${documentTypeLabel} to`;

  // Use green (#16a34a) for all document types
  const primaryColor = '#16a34a';
  const tableHeaderBg = 'bg-green-700';
  const rowAltBg = 'bg-green-50';
  const summaryBoxBg = 'bg-green-700';
  const paymentBoxBg = 'bg-green-700';

  // Get module name dynamically
  const kethuConsultName = getModuleName();
  const kethuConsultTagline = 'Second to None – Serving You the Best Way';
  const kethuConsultAddress = 'P.O. Box 2069, Area 7, Lilongwe';
  const kethuConsultPhone = '+265 888 921 085';
  const kethuConsultEmail = 'kethugroups@hotmail.com';

  return (
    <div id="document-view" className="bg-white print:shadow-none" style={{ 
      fontFamily: 'Arial, sans-serif', 
      width: '210mm', 
      minHeight: '297mm',
      height: '297mm',
      margin: '0 auto', 
      padding: '15px 25px', 
      borderTop: `5px solid ${primaryColor}`, 
      borderBottom: `5px solid ${primaryColor}`,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* PAID Stamp for Receipts */}
      {document.type === 'receipt' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-12deg)',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: 0.45
        }}>
          <div style={{
            border: `4px solid #dc2626`,
            borderRadius: '50%',
            width: '140px',
            height: '140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            boxShadow: '0 3px 10px rgba(220, 38, 38, 0.3), inset 0 0 15px rgba(220, 38, 38, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            padding: '8px'
          }}>
            {/* Stamp texture effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 30%, rgba(220, 38, 38, 0.12) 0.5px, transparent 0.5px),
                radial-gradient(circle at 80% 70%, rgba(220, 38, 38, 0.12) 0.5px, transparent 0.5px),
                radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '8px 8px, 10px 10px, 12px 12px',
              opacity: 0.7
            }}></div>
            
            {/* Module Name */}
            <div style={{
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#dc2626',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '4px',
              position: 'relative',
              zIndex: 1,
              textShadow: '0.5px 0.5px 1px rgba(0, 0, 0, 0.1)',
              lineHeight: '1.1'
            }}>
              {kethuConsultName}
            </div>
            
            {/* Decorative line */}
            <div style={{
              width: '70px',
              height: '1.5px',
              backgroundColor: '#dc2626',
              marginBottom: '4px',
              position: 'relative',
              zIndex: 1
            }}></div>
            
            {/* PAID text */}
            <span style={{
              fontSize: '24px',
              fontWeight: '900',
              color: '#dc2626',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              position: 'relative',
              zIndex: 1,
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
              fontFamily: 'Arial, sans-serif',
              lineHeight: '1'
            }}>
              PAID
            </span>
            
            {/* Date line */}
            <div style={{
              fontSize: '8px',
              fontWeight: '600',
              color: '#dc2626',
              letterSpacing: '0.5px',
              marginTop: '4px',
              position: 'relative',
              zIndex: 1,
              textShadow: '0.5px 0.5px 1px rgba(0, 0, 0, 0.1)',
              lineHeight: '1.1'
            }}>
              {new Date(document.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
            </div>
          </div>
        </div>
      )}
      {/* Header Section - Company name left, INVOICE right */}
      <div className="flex justify-between items-start mb-2">
        {/* Left: Company Info with Logo */}
        <div className="flex items-start gap-3">
          {/* Logo */}
          <div>
            <img 
              src="/log.jpg" 
              alt="KETHU CONSULT Logo" 
              className="object-contain"
              style={{ width: '60px', height: '60px', objectFit: 'contain' }}
            />
          </div>
          {/* Company Details */}
          <div>
            <h1 className="text-2xl font-bold mb-0" style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '2px', color: '#008080' }}>
              {kethuConsultName}
            </h1>
            <p className="text-xs text-gray-700 mb-1" style={{ fontSize: '11px', color: '#374151', marginBottom: '4px', fontStyle: 'italic' }}>
              {kethuConsultTagline}
            </p>
            <p className="text-xs text-gray-700" style={{ fontSize: '11px', color: '#374151', marginBottom: '2px', lineHeight: '1.3' }}>
              {kethuConsultAddress}
            </p>
            <p className="text-xs text-gray-700" style={{ fontSize: '11px', color: '#374151', lineHeight: '1.3' }}>
              Tel: {kethuConsultPhone} | Email: {kethuConsultEmail}
            </p>
          </div>
        </div>
        
        {/* Right: Document Title and Details */}
        <div className="text-right">
          <h2 className="text-3xl font-bold mb-1" style={{ fontSize: '32px', fontWeight: 'bold', color: primaryColor, marginBottom: '4px' }}>
            {documentTitle}
          </h2>
          {document.type === 'receipt' && (
            <div className="mb-2" style={{ marginBottom: '6px' }}>
              <span className="inline-block px-4 py-1 rounded text-white font-bold text-sm" style={{ 
                backgroundColor: '#dc2626', 
                padding: '6px 16px', 
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                PAID
              </span>
            </div>
          )}
          <div className="text-xs" style={{ fontSize: '11px', color: '#374151' }}>
            <p className="font-semibold" style={{ fontWeight: '600' }}>{documentNumberLabel} : {document.documentNumber}</p>
            <p style={{ marginTop: '2px' }}>{new Date(document.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Thin Line Separator */}
      <div className="mb-2" style={{ borderBottom: `2px solid ${primaryColor}`, marginBottom: '10px' }}></div>

      {/* Customer To Section */}
      <div className="mb-2" style={{ marginBottom: '10px' }}>
        <h3 className="text-sm font-semibold mb-1" style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
          {documentToLabel} :
        </h3>
        <div className="space-y-0">
          <p className="font-bold" style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '2px' }}>
            {document.customerName}
          </p>
          {document.customerPhone && (
            <p style={{ fontSize: '12px', color: '#4b5563', marginBottom: '1px', lineHeight: '1.3' }}>{document.customerPhone}</p>
          )}
          {document.customerEmail && (
            <p style={{ fontSize: '12px', color: '#4b5563', marginBottom: '1px', lineHeight: '1.3' }}>{document.customerEmail}</p>
          )}
          {document.customerAddress && (
            <p style={{ fontSize: '12px', color: '#4b5563', marginBottom: '1px', lineHeight: '1.3' }}>{document.customerAddress}</p>
          )}
        </div>
      </div>

      {/* Items Table - Flexible to expand */}
      <div className="mb-2" style={{ marginBottom: '10px', flexShrink: 0 }}>
        <table className="w-full border-collapse" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr className={tableHeaderBg} style={{ backgroundColor: primaryColor }}>
              <th className="text-left py-2 px-3 text-sm font-semibold text-white" style={{ padding: '8px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#ffffff', width: document.type === 'receipt' ? '4%' : '5%' }}>
                NO
              </th>
              <th className="text-left py-2 px-3 text-sm font-semibold text-white" style={{ padding: '8px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#ffffff', width: document.type === 'receipt' ? '38%' : '45%' }}>
                DESCRIPTION
              </th>
              <th className="text-center py-2 px-3 text-sm font-semibold text-white" style={{ padding: '8px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#ffffff', width: document.type === 'receipt' ? '10%' : '12%' }}>
                QTY
              </th>
              <th className="text-right py-2 px-3 text-sm font-semibold text-white" style={{ padding: '8px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#ffffff', width: document.type === 'receipt' ? '15%' : '18%' }}>
                PRICE
              </th>
              <th className="text-right py-2 px-3 text-sm font-semibold text-white" style={{ padding: '8px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#ffffff', width: document.type === 'receipt' ? '16%' : '20%' }}>
                TOTAL
              </th>
              {document.type === 'receipt' && (
                <th className="text-right py-2 px-3 text-sm font-semibold text-white" style={{ padding: '8px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#ffffff', width: '17%' }}>
                  BALANCE
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {document.items.map((item, index) => (
              <tr 
                key={item.id || index} 
                style={{ 
                  backgroundColor: index % 2 === 0 ? '#E0F6FF' : '#ffffff'
                }}
              >
                <td style={{ padding: '8px', fontSize: '13px', color: '#374151' }}>{index + 1}</td>
                <td style={{ padding: '8px', fontSize: '13px', color: '#111827', fontWeight: '500', wordWrap: 'break-word' }}>{item.description}</td>
                <td style={{ padding: '8px', textAlign: 'center', fontSize: '13px', color: '#374151' }}>{item.quantity}</td>
                <td style={{ padding: '8px', textAlign: 'right', fontSize: '13px', color: '#374151' }}>{formatCurrency(item.unitPrice)}</td>
                <td style={{ padding: '8px', textAlign: 'right', fontSize: '13px', color: '#111827', fontWeight: '600' }}>{formatCurrency(item.total)}</td>
                {document.type === 'receipt' && (
                  <td style={{ padding: '8px', textAlign: 'right', fontSize: '13px', color: '#16a34a', fontWeight: '600' }}>{formatCurrency(0)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Section - Right Aligned - Close to table */}
      <div className="flex justify-end mb-2" style={{ marginBottom: '8px', flexShrink: 0 }}>
        <div style={{ width: '320px' }}>
          <div className="flex justify-between mb-1" style={{ marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>Sub Total :</span>
            <span style={{ fontSize: '13px', color: '#111827', fontWeight: '600' }}>{formatCurrency(document.subtotal)}</span>
          </div>
          {document.discount > 0 && (
            <div className="flex justify-between mb-1" style={{ marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', color: '#dc2626', fontWeight: '500' }}>Discount ({document.discount}%) :</span>
              <span style={{ fontSize: '13px', color: '#dc2626', fontWeight: '600' }}>-{formatCurrency((document.subtotal * document.discount) / 100)}</span>
            </div>
          )}
          {document.taxRate > 0 && (
            <div className="flex justify-between mb-1" style={{ marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>VAT {document.taxRate}% :</span>
              <span style={{ fontSize: '13px', color: '#111827', fontWeight: '600' }}>{formatCurrency(document.taxAmount)}</span>
            </div>
          )}
          <div className={`${summaryBoxBg} text-white py-2 px-3 mt-1`} style={{ backgroundColor: primaryColor, color: '#ffffff', padding: '10px 12px', marginTop: '6px' }}>
            <div className="flex justify-between">
              <span className="font-bold" style={{ fontSize: '15px', fontWeight: 'bold' }}>GRAND TOTAL :</span>
              <span className="font-bold" style={{ fontSize: '15px', fontWeight: 'bold' }}>{formatCurrency(document.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to push bottom sections down */}
      <div style={{ flex: 1, minHeight: '20px' }}></div>

      {/* Bottom Section - Payment, Terms, Signature - Close to footer */}
      <div style={{ flexShrink: 0 }}>

        {/* Payment Method Section - Left Aligned */}
        <div className={`${paymentBoxBg} text-white p-3 mb-2`} style={{ backgroundColor: primaryColor, color: '#ffffff', padding: '12px', marginBottom: '8px' }}>
          <p className="font-semibold mb-1" style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>PAYMENT METHOD :</p>
          <div className="space-y-0 text-sm" style={{ fontSize: '12px' }}>
            <p style={{ marginBottom: '2px' }}>Bank : {companyInfo.taxId || 'Please contact us for bank details'}</p>
            <p style={{ marginBottom: '0' }}>Mobile Money : {companyInfo.phone || kethuConsultPhone}</p>
          </div>
        </div>

        {/* Thin Line Separator */}
        <div className="mb-2" style={{ borderBottom: '1px solid #d1d5db', marginBottom: '6px' }}></div>

        {/* Thank You Message */}
        <div className="mb-2" style={{ marginBottom: '6px' }}>
          <p className="text-gray-700 font-medium" style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>
            Thank you for business with us!
          </p>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-2" style={{ marginBottom: '6px' }}>
          <p className="text-sm font-semibold text-gray-700 mb-0" style={{ fontSize: '11px', fontWeight: '600', color: '#374151', marginBottom: '3px' }}>
            Term and Conditions :
          </p>
          {document.notes ? (
            <p className="text-sm text-gray-600" style={{ fontSize: '11px', color: '#4b5563', lineHeight: '1.3', whiteSpace: 'pre-line' }}>
              {document.notes}
            </p>
          ) : (
            <p className="text-sm text-gray-600" style={{ fontSize: '11px', color: '#4b5563', lineHeight: '1.3' }}>
              Please send payment within 30 days of receiving this invoice. There will be 10% interest charge per month on late invoice.
            </p>
          )}
        </div>

        {/* Authorized Signature - Right Aligned */}
        <div className="mb-2" style={{ marginBottom: '8px' }}>
          <div className="flex justify-end">
            <div className="text-right" style={{ textAlign: 'right' }}>
              <div className="mb-1" style={{ minHeight: '30px', borderBottom: `1px solid ${primaryColor}`, marginBottom: '3px' }}>
                {/* Signature line */}
              </div>
              <p className="font-semibold text-gray-900" style={{ fontSize: '11px', fontWeight: '600', color: '#111827', marginBottom: '1px' }}>
                {kethuConsultName}
              </p>
              <p className="text-sm text-gray-600" style={{ fontSize: '10px', color: '#4b5563' }}>Administrator</p>
              {/* Thin line below administrator */}
              <div className="mt-1" style={{ borderBottom: `1px solid ${primaryColor}`, marginTop: '3px', width: '180px', marginLeft: 'auto' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Contact Information - Fixed at bottom */}
      <div className="border-t-2 pt-1" style={{ 
        borderTop: `2px solid ${primaryColor}`, 
        paddingTop: '8px',
        marginTop: 'auto'
      }}>
        <div className="text-center mb-1" style={{ marginBottom: '6px' }}>
          <p className="text-sm font-medium" style={{ fontSize: '11px', fontWeight: '500', color: '#374151' }}>
            Be rest assured of the best service possible.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', fontSize: '11px' }}>
          <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: primaryColor }}>
            <Phone className="h-4 w-4" style={{ width: '16px', height: '16px' }} />
            <span style={{ color: '#374151' }}>{kethuConsultPhone}</span>
          </div>
          <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: primaryColor }}>
            <Mail className="h-4 w-4" style={{ width: '16px', height: '16px' }} />
            <span style={{ color: '#374151' }}>{kethuConsultEmail}</span>
          </div>
          <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: primaryColor }}>
            <MapPin className="h-4 w-4" style={{ width: '16px', height: '16px' }} />
            <span style={{ color: '#374151' }}>{kethuConsultAddress}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
