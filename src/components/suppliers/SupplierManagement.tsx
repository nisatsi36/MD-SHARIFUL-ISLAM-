import React, { useState } from 'react';
import { Supplier, Medicine, UserRole } from '../../types/pharmacy';

interface SupplierManagementProps {
  suppliers: Supplier[];
  medicines: Medicine[];
  onPaySupplier: (supplierId: string, amount: number) => void;
  userRole: UserRole;
}

export const SupplierManagement: React.FC<SupplierManagementProps> = ({
  suppliers,
  medicines,
  onPaySupplier,
  userRole
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>(suppliers[0]);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [showPoModal, setShowPoModal] = useState(false);
  const [poNotes, setPoNotes] = useState('');
  const [poSubmitted, setPoSubmitted] = useState(false);

  const handleMakePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) return;

    onPaySupplier(selectedSupplier.id, amount);
    setPaymentAmount('');
    alert(`Payment of ৳${amount.toFixed(2)} recorded for ${selectedSupplier.name}. Supplier ledger updated.`);
  };

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    setPoSubmitted(true);
    setTimeout(() => {
      setPoSubmitted(false);
      setShowPoModal(false);
      alert(`Digital Purchase Order PO-${Date.now().toString().slice(-6)} created for ${selectedSupplier.name}. Ready for Territory Officer dispatch.`);
    }, 600);
  };

  const totalPayableDue = suppliers.reduce((sum, s) => sum + s.currentBalanceDue, 0);

  return (
    <div className="space-y-4">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Supplier Accounts Payable</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            ৳{totalPayableDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            4 active pharmaceutical depots in Dhaka
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Credit Term Compliance</div>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
            100% On-Time
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Standard 15-day to 30-day payment cycle
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">DGDA Distributor Verification</div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            4 / 4 Verified
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            ✓ All suppliers hold valid DGDA wholesale licenses
          </div>
        </div>
      </div>

      {/* Main Grid: Suppliers List on Left, Active Supplier Ledger & PO on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Suppliers List */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
            Pharmaceutical Distributors
          </h3>
          <div className="space-y-2">
            {suppliers.map((sup) => (
              <button
                key={sup.id}
                onClick={() => setSelectedSupplier(sup)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedSupplier.id === sup.id
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="font-bold text-sm text-slate-900">{sup.name}</div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Balance Due</span>
                    <span className="font-mono font-bold text-xs text-red-600">
                      ৳{sup.currentBalanceDue.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Contact: {sup.contactPerson} ({sup.phone})
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Lic: {sup.dgdaDistributorLicense}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Supplier Detail & Ledger */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">{selectedSupplier.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedSupplier.address} · DGDA Lic: {selectedSupplier.dgdaDistributorLicense}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPoModal(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                + New Purchase Order (PO)
              </button>
            </div>
          </div>

          {/* Supplier Payable Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500">Current Outstanding Payable</div>
              <div className="text-2xl font-bold font-mono text-red-600 mt-0.5">
                ৳{selectedSupplier.currentBalanceDue.toFixed(2)}
              </div>
            </div>

            {userRole !== 'salesperson' ? (
              <form onSubmit={handleMakePayment} className="flex items-center gap-2">
                <div>
                  <input
                    type="number"
                    step="100"
                    min="1"
                    placeholder="Payment Amount (৳)"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold w-44"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!paymentAmount || selectedSupplier.currentBalanceDue <= 0}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  Record Payment Voucher
                </button>
              </form>
            ) : (
              <span className="text-xs text-slate-400 italic">
                (Payment recording restricted to Admin & Accountant)
              </span>
            )}
          </div>

          {/* Recent Delivery Challans & Invoices Mock Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-2">
              Recent Invoices & Delivery Challans
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Challan / Inv #</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Items Received</th>
                    <th className="px-3 py-2">Total Amount</th>
                    <th className="px-3 py-2">Paid</th>
                    <th className="px-3 py-2">Balance</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-bold text-slate-900">CHL-2026-9481</td>
                    <td className="px-3 py-2 text-slate-600">2026-09-18</td>
                    <td className="px-3 py-2 font-sans">Napa 500mg, Napa Extra (25 Boxes)</td>
                    <td className="px-3 py-2">৳15,400.00</td>
                    <td className="px-3 py-2 text-emerald-700">৳10,000.00</td>
                    <td className="px-3 py-2 text-red-600 font-semibold">৳5,400.00</td>
                    <td className="px-3 py-2 font-sans">
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                        Partial
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-bold text-slate-900">CHL-2026-8920</td>
                    <td className="px-3 py-2 text-slate-600">2026-09-04</td>
                    <td className="px-3 py-2 font-sans">Ace 500mg, Ace Plus (30 Boxes)</td>
                    <td className="px-3 py-2">৳18,200.00</td>
                    <td className="px-3 py-2 text-emerald-700">৳18,200.00</td>
                    <td className="px-3 py-2 text-slate-400">৳0.00</td>
                    <td className="px-3 py-2 font-sans">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                        Cleared
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* PO Creation Modal */}
      {showPoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Generate Purchase Order (PO)
                </h3>
                <p className="text-xs text-slate-500">To: {selectedSupplier.name}</p>
              </div>
              <button
                onClick={() => setShowPoModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePo} className="space-y-3 mt-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reorder Item Suggestions (Based on Low-Stock Thresholds)
                </label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  {medicines.slice(0, 3).map((m) => (
                    <div key={m.id} className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">
                        {m.brandName} {m.strength} ({m.dosageForm})
                      </span>
                      <span className="text-slate-500 font-mono">
                        Recommended: 10 Boxes
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Delivery Notes / Urgent Requests
                </label>
                <textarea
                  rows={2}
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  placeholder="e.g. Please deliver by tomorrow morning before 11:00 AM."
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPoModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={poSubmitted}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-xs"
                >
                  {poSubmitted ? 'Generating...' : 'Confirm & Issue Digital PO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
