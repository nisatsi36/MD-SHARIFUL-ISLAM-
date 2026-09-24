import React from 'react';
import { SalesInvoice } from '../../types/pharmacy';

interface ThermalReceiptModalProps {
  invoice: SalesInvoice | null;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Modal Toolbar */}
        <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-800">
              80mm Thermal Receipt Preview (Mushak-6.3)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print ESC/POS
            </button>
            <button
              onClick={onClose}
              className="px-2 py-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded text-xs transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Thermal Slip Viewport (80mm representation) */}
        <div className="p-6 bg-slate-50 flex justify-center max-h-[75vh] overflow-y-auto">
          <div
            id="thermal-receipt-print-area"
            className="w-[78mm] bg-white p-4 shadow-sm border border-slate-300 font-mono text-[11px] leading-tight text-slate-900"
          >
            {/* Header */}
            <div className="text-center pb-2 border-b border-dashed border-slate-400">
              <h2 className="text-sm font-bold tracking-tight">AL-MADINA PHARMA & SURGICAL</h2>
              <p className="text-[10px] text-slate-600">House 12, Green Road, Dhanmondi, Dhaka-1205</p>
              <p className="text-[10px] text-slate-600">Mobile: +880 1711-554433, Tel: 02-9661234</p>
              <div className="mt-1 pt-1 border-t border-dotted border-slate-300 text-[10px]">
                <p><strong>DGDA Drug Lic:</strong> DGDA/DL/DHK-48201</p>
                <p><strong>NBR BIN:</strong> 002938174-0101</p>
                <p className="font-bold uppercase tracking-wider text-[11px] mt-0.5">
                  MUSHAK-6.3 (Retail Cash Memo)
                </p>
              </div>
            </div>

            {/* Meta info */}
            <div className="py-2 border-b border-dashed border-slate-400 text-[10px] space-y-0.5">
              <div className="flex justify-between">
                <span>Invoice: {invoice.invoiceNumber}</span>
                <span>{invoice.date} {invoice.time}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer: {invoice.customerName || 'Walk-in Patient'}</span>
                <span>Ph: {invoice.customerPhone || 'N/A'}</span>
              </div>
              {invoice.doctorBmdc && (
                <div className="flex justify-between text-slate-700">
                  <span>Dr. BMDC Reg: {invoice.doctorBmdc}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Served by: {invoice.servedBy}</span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="py-2 border-b border-dashed border-slate-400">
              <div className="flex justify-between font-bold pb-1 text-[10px] border-b border-slate-300">
                <span className="w-1/2">Item / Batch / Exp</span>
                <span className="w-1/6 text-right">Qty</span>
                <span className="w-1/6 text-right">Rate</span>
                <span className="w-1/6 text-right">BDT</span>
              </div>
              <div className="divide-y divide-dotted divide-slate-200 mt-1">
                {invoice.items.map((item, idx) => (
                  <div key={idx} className="py-1 text-[10px]">
                    <div className="font-semibold text-slate-900">
                      {item.brandName} {item.strength}
                    </div>
                    <div className="text-[9px] text-slate-500 flex justify-between">
                      <span>B:{item.batchNumber} | E:{item.expiryDate}</span>
                      <span>Loc:{item.rackLocation.split('/')[0]}</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-slate-600 capitalize">
                        {item.genericName}
                      </span>
                      <span className="text-right">
                        {item.quantity} {item.unit}
                      </span>
                      <span className="text-right tabular-nums">
                        ৳{item.unitPrice.toFixed(2)}
                      </span>
                      <span className="text-right font-medium tabular-nums">
                        ৳{item.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="py-2 border-b border-dashed border-slate-400 text-[10px] space-y-1">
              <div className="flex justify-between">
                <span>Subtotal ({invoice.items.length} items):</span>
                <span className="tabular-nums">৳{invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({invoice.discountValue}{invoice.discountType === 'percentage' ? '%' : ' Tk'}):</span>
                  <span className="tabular-nums">-৳{invoice.discountAmount.toFixed(2)}</span>
                </div>
              )}
              {invoice.vatAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>VAT ({invoice.vatRate}% Mushak Included):</span>
                  <span className="tabular-nums">৳{invoice.vatAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-300">
                <span>NET TOTAL PAYABLE:</span>
                <span className="tabular-nums">৳{invoice.netTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="capitalize">Paid via {invoice.paymentMethod}:</span>
                <span className="tabular-nums font-semibold">৳{invoice.paidAmount.toFixed(2)}</span>
              </div>
              {invoice.dueAmount > 0 ? (
                <div className="flex justify-between font-bold text-red-600 pt-0.5">
                  <span>OUTSTANDING BALANCE DUE:</span>
                  <span className="tabular-nums">৳{invoice.dueAmount.toFixed(2)}</span>
                </div>
              ) : (
                <div className="flex justify-between text-slate-600">
                  <span>Change Returned:</span>
                  <span className="tabular-nums">৳{(invoice.paidAmount - invoice.netTotal > 0 ? invoice.paidAmount - invoice.netTotal : 0).toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* DGDA Regulatory Notice & Footer */}
            <div className="pt-2 text-center text-[9px] text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">
                ঔষধের সঠিক তাপমাত্রা নিশ্চিত করুন | বিক্রিত ঔষধ ফেরত যোগ্য নহে
              </p>
              <p>Store below 30°C in a dry place. Keep away from children.</p>
              <div className="flex justify-center py-1">
                <div className="w-16 h-16 border border-slate-400 flex items-center justify-center text-[8px] text-slate-400 bg-slate-50">
                  [NBR QR CODE]
                </div>
              </div>
              <p className="text-[8px] text-slate-400">
                Software: PharmaBangla DGDA Edition | Helpline: 16263
              </p>
              <p className="font-bold text-[10px]">*** THANK YOU - GET WELL SOON ***</p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-4 py-3 bg-slate-100 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            Close Preview
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-xs transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Receipt (F8)
          </button>
        </div>
      </div>
    </div>
  );
};
