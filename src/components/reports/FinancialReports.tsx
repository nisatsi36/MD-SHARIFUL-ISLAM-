import React, { useState } from 'react';
import { SalesInvoice, CustomerDueRecord, Medicine, UserRole } from '../../types/pharmacy';

interface FinancialReportsProps {
  invoices: SalesInvoice[];
  customerDues: CustomerDueRecord[];
  medicines: Medicine[];
  onSettleDue: (dueId: string, amount: number) => void;
  userRole: UserRole;
}

export const FinancialReports: React.FC<FinancialReportsProps> = ({
  invoices,
  customerDues,
  medicines,
  onSettleDue,
  userRole
}) => {
  const [activeReportTab, setActiveReportTab] = useState<'sales' | 'profit' | 'dues' | 'vat' | 'expired'>('sales');
  const [settleAmountInput, setSettleAmountInput] = useState<{ [id: string]: string }>({});

  // Calculations
  const totalGrossSales = invoices.reduce((sum, inv) => sum + inv.subtotal, 0);
  const totalDiscounts = invoices.reduce((sum, inv) => sum + inv.discountAmount, 0);
  const totalVatCollected = invoices.reduce((sum, inv) => sum + inv.vatAmount, 0);
  const totalNetSales = invoices.reduce((sum, inv) => sum + inv.netTotal, 0);
  const totalPaidCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalNewDues = invoices.reduce((sum, inv) => sum + inv.dueAmount, 0);

  // COGS calculation
  const totalCogs = invoices.reduce((sum, inv) => {
    const invCogs = inv.items.reduce(
      (itemSum, item) => itemSum + item.costPricePcs * (item.quantity * item.multiplierToPcs),
      0
    );
    return sum + invCogs;
  }, 0);

  const grossProfit = totalNetSales - totalCogs - totalVatCollected;
  const grossProfitMargin = totalNetSales > 0 ? (grossProfit / totalNetSales) * 100 : 0;

  // Payment Breakdown
  const cashTotal = invoices.filter((i) => i.paymentMethod === 'cash').reduce((s, i) => s + i.paidAmount, 0);
  const bkashTotal = invoices.filter((i) => i.paymentMethod === 'bkash').reduce((s, i) => s + i.paidAmount, 0);
  const nagadTotal = invoices.filter((i) => i.paymentMethod === 'nagad').reduce((s, i) => s + i.paidAmount, 0);
  const cardTotal = invoices.filter((i) => i.paymentMethod === 'card').reduce((s, i) => s + i.paidAmount, 0);

  // Expired / Quarantined items loss calculation
  const expiredItems = medicines.flatMap((m) =>
    m.batches
      .filter((b) => b.isQuarantined || new Date(b.expiryDate).getTime() < new Date().getTime())
      .map((b) => ({
        medicineName: `${m.brandName} ${m.strength}`,
        genericName: m.genericName,
        batchNumber: b.batchNumber,
        expiryDate: b.expiryDate,
        stockPcs: b.stockPcs,
        costPricePcs: b.costPricePcs,
        totalLoss: b.stockPcs * b.costPricePcs,
        rackLocation: b.rackLocation
      }))
  );

  const totalExpiredLoss = expiredItems.reduce((sum, item) => sum + item.totalLoss, 0);
  const totalOutstandingCustomerDue = customerDues.reduce((sum, d) => sum + d.dueAmount, 0);

  const handleSettleDueSubmit = (dueId: string) => {
    const amt = parseFloat(settleAmountInput[dueId]);
    if (!amt || amt <= 0) return;
    onSettleDue(dueId, amt);
    setSettleAmountInput((prev) => ({ ...prev, [dueId]: '' }));
    alert(`Customer due payment of ৳${amt.toFixed(2)} recorded.`);
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setActiveReportTab('sales')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeReportTab === 'sales'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Daily Sales Summary
        </button>
        <button
          onClick={() => setActiveReportTab('profit')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeReportTab === 'profit'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          COGS & Profit / Loss
        </button>
        <button
          onClick={() => setActiveReportTab('dues')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeReportTab === 'dues'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Customer Due Ledger (Baki)
        </button>
        <button
          onClick={() => setActiveReportTab('vat')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeReportTab === 'vat'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          NBR Mushak-6.3 VAT Report
        </button>
        <button
          onClick={() => setActiveReportTab('expired')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeReportTab === 'expired'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Expired Loss Write-Off
        </button>
      </div>

      {/* SALES SUMMARY TAB */}
      {activeReportTab === 'sales' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Net Revenue</span>
              <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">
                ৳{totalNetSales.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {invoices.length} invoices processed
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Cash Collected at Counter</span>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                ৳{cashTotal.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Immediate physical drawer balance
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">MFS (bKash & Nagad)</span>
              <div className="text-2xl font-bold font-mono text-pink-700 mt-1">
                ৳{(bkashTotal + nagadTotal).toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Direct mobile wallet settlement
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Customer Due Added</span>
              <div className="text-2xl font-bold font-mono text-red-600 mt-1">
                ৳{totalNewDues.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Logged to credit ledgers
              </span>
            </div>
          </div>

          {/* Invoices List */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 mb-3">
              Today's Completed Invoices (Mushak-6.3 Verified)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Invoice #</th>
                    <th className="px-3 py-2">Time</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Items</th>
                    <th className="px-3 py-2">Payment</th>
                    <th className="px-3 py-2">Net Bill</th>
                    <th className="px-3 py-2">Paid</th>
                    <th className="px-3 py-2">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-bold text-slate-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-3 py-2.5 text-slate-500">{inv.time}</td>
                      <td className="px-3 py-2.5 font-sans">
                        <div className="font-semibold text-slate-800">{inv.customerName}</div>
                        <div className="text-[10px] text-slate-400">{inv.customerPhone}</div>
                      </td>
                      <td className="px-3 py-2.5 font-sans">
                        {inv.items.map((it) => `${it.brandName} (${it.quantity}${it.unit})`).join(', ')}
                      </td>
                      <td className="px-3 py-2.5 capitalize font-sans">
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-semibold">
                          {inv.paymentMethod}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-bold text-slate-900">
                        ৳{inv.netTotal.toFixed(2)}
                      </td>
                      <td className="px-3 py-2.5 text-emerald-700 font-semibold">
                        ৳{inv.paidAmount.toFixed(2)}
                      </td>
                      <td className="px-3 py-2.5">
                        {inv.dueAmount > 0 ? (
                          <span className="text-red-600 font-bold">
                            ৳{inv.dueAmount.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-slate-400">৳0.00</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PROFIT & LOSS TAB */}
      {activeReportTab === 'profit' && (
        <div className="space-y-4">
          {userRole === 'salesperson' ? (
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 text-center text-xs text-amber-900">
              <strong className="block text-sm font-bold text-amber-800 mb-1">
                Restricted Financial View
              </strong>
              Cost of Goods Sold (COGS) and Net Profit Margins are restricted to Store Owners and Accountants.
              Please switch role in the header to Admin or Accountant.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Cost of Goods Sold (COGS)</span>
                <div className="text-2xl font-bold font-mono text-slate-800 mt-1">
                  ৳{totalCogs.toFixed(2)}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Batch-weighted purchase cost
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Estimated Gross Profit</span>
                <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
                  ৳{grossProfit.toFixed(2)}
                </div>
                <span className="text-[11px] text-emerald-600 mt-1 block font-semibold">
                  Margin: {grossProfitMargin.toFixed(1)}% of net sales
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Total Retail Discounts</span>
                <div className="text-2xl font-bold font-mono text-amber-700 mt-1">
                  ৳{totalDiscounts.toFixed(2)}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Promotional & patient loyalty deductions
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CUSTOMER DUE (BAKI) LEDGER */}
      {activeReportTab === 'dues' && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Customer Due Ledger (বাকির খাতা)
              </h3>
              <p className="text-xs text-slate-500">
                Track neighborhood credit balances, mobile numbers, and partial recoveries.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Total Outstanding Credit</span>
              <span className="text-lg font-mono font-bold text-red-600">
                ৳{totalOutstandingCustomerDue.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Customer Name</th>
                  <th className="px-3 py-2">Mobile #</th>
                  <th className="px-3 py-2">Invoice Reference</th>
                  <th className="px-3 py-2">Total Bill</th>
                  <th className="px-3 py-2">Total Paid</th>
                  <th className="px-3 py-2">Remaining Due</th>
                  <th className="px-3 py-2 text-right">Collect Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {customerDues.map((due) => (
                  <tr key={due.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-bold font-sans text-slate-900">
                      {due.customerName}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{due.customerPhone}</td>
                    <td className="px-3 py-2.5 text-slate-500">{due.invoiceId}</td>
                    <td className="px-3 py-2.5">৳{due.totalBill.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-emerald-700">৳{due.paidAmount.toFixed(2)}</td>
                    <td className="px-3 py-2.5 font-bold text-red-600">
                      ৳{due.dueAmount.toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-sans">
                      {due.dueAmount > 0 ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <input
                            type="number"
                            placeholder="Amount ৳"
                            value={settleAmountInput[due.id] || ''}
                            onChange={(e) =>
                              setSettleAmountInput({ ...settleAmountInput, [due.id]: e.target.value })
                            }
                            className="w-24 px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                          />
                          <button
                            onClick={() => handleSettleDueSubmit(due.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
                          >
                            Receive
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          Fully Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NBR MUSHAK-6.3 VAT REPORT */}
      {activeReportTab === 'vat' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              National Board of Revenue (NBR) Mushak-6.3 Retail Tax Return
            </h3>
            <p className="text-xs text-slate-500">
              Pursuant to the Value Added Tax and Supplementary Duty Act, 2012 (Act No. 47 of 2012).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500">Taxable Retail Turnover</span>
              <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                ৳{(totalNetSales - totalVatCollected).toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500">Truncated Retail VAT Rate</span>
              <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                2.4% (Retail Drug Category)
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500">Total Output VAT Payable to NBR</span>
              <div className="text-lg font-bold font-mono text-emerald-800 mt-0.5">
                ৳{totalVatCollected.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPIRED STOCK LOSS WRITE-OFF */}
      {activeReportTab === 'expired' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                DGDA Expired & Recalled Stock Loss Write-Off Journal
              </h3>
              <p className="text-xs text-slate-500">
                Items segregated in quarantine boxes for supplier replacement or destruction under DGDA observation.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Total Quarantined Loss</span>
              <span className="text-lg font-mono font-bold text-red-600">
                ৳{totalExpiredLoss.toFixed(2)}
              </span>
            </div>
          </div>

          {expiredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No expired or quarantined stock. All inventory is within valid shelf life.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Medicine / Strength</th>
                    <th className="px-3 py-2">Generic INN</th>
                    <th className="px-3 py-2">Batch #</th>
                    <th className="px-3 py-2">Location</th>
                    <th className="px-3 py-2">Expired Date</th>
                    <th className="px-3 py-2">Quantity</th>
                    <th className="px-3 py-2">Unit Cost</th>
                    <th className="px-3 py-2">Total Write-Off Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {expiredItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-red-50/40">
                      <td className="px-3 py-2.5 font-bold font-sans text-slate-900">
                        {item.medicineName}
                      </td>
                      <td className="px-3 py-2.5 font-sans text-slate-600">{item.genericName}</td>
                      <td className="px-3 py-2.5 text-slate-900">{item.batchNumber}</td>
                      <td className="px-3 py-2.5 font-sans text-slate-500">{item.rackLocation}</td>
                      <td className="px-3 py-2.5 text-red-600 font-semibold">{item.expiryDate}</td>
                      <td className="px-3 py-2.5">{item.stockPcs} pcs</td>
                      <td className="px-3 py-2.5">৳{item.costPricePcs.toFixed(2)}</td>
                      <td className="px-3 py-2.5 font-bold text-red-600">
                        ৳{item.totalLoss.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
