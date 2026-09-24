import React, { useState, useEffect, useRef } from 'react';
import { Medicine, CartItem, SalesInvoice, UnitType, UserRole } from '../../types/pharmacy';
import { ThermalReceiptModal } from './ThermalReceiptModal';

interface PosTerminalProps {
  medicines: Medicine[];
  onCompleteSale: (invoice: SalesInvoice) => void;
  userRole: UserRole;
}

export const PosTerminal: React.FC<PosTerminalProps> = ({
  medicines,
  onCompleteSale,
  userRole
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitType>('strip');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');

  // Discount & Payment
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(5); // default 5% retail discount
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bkash' | 'nagad' | 'card' | 'due'>('cash');
  const [paidAmountInput, setPaidAmountInput] = useState<string>('');

  // Customer / Patient Info & Schedule G
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [doctorBmdc, setDoctorBmdc] = useState('');
  const [patientNid, setPatientNid] = useState('');

  // Modals & Alerts
  const [showScheduleGModal, setShowScheduleGModal] = useState(false);
  const [bannedDrugAlert, setBannedDrugAlert] = useState<string | null>(null);
  const [mrpViolationAlert, setMrpViolationAlert] = useState<string | null>(null);
  const [completedInvoice, setCompletedInvoice] = useState<SalesInvoice | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: F2 (search), F8 (checkout), F4 (hold/clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        setCart([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter medicines by brand, generic, or barcode
  const filteredMedicines = searchTerm.trim()
    ? medicines.filter(
        (m) =>
          m.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.barcode.includes(searchTerm) ||
          m.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // When medicine is selected, initialize FEFO batch & default unit
  const handleSelectMedicine = (med: Medicine) => {
    if (med.isBanned) {
      setBannedDrugAlert(med.banReason || 'This medicine has been banned/recalled by DGDA Bangladesh.');
      return;
    }
    setBannedDrugAlert(null);

    // Pick earliest expiring non-quarantined batch with stock
    const availableBatches = med.batches
      .filter((b) => !b.isQuarantined && b.stockPcs > 0)
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

    const initialBatch = availableBatches[0] || med.batches[0];

    setSelectedMedicine(med);
    setSelectedBatchId(initialBatch?.id || '');
    setSelectedUnit('strip');
    setQuantity(1);
    setSearchTerm('');
  };

  // Compute unit multiplier and unit price
  const getUnitMultiplierAndPrice = (med: Medicine, unit: UnitType) => {
    if (unit === 'pcs') {
      return { multiplier: 1, price: med.unitConfig.mrpPcs };
    }
    if (unit === 'strip') {
      return { multiplier: med.unitConfig.pcsPerStrip, price: med.unitConfig.mrpStrip };
    }
    // box
    return { multiplier: med.unitConfig.totalPcsPerBox, price: med.unitConfig.mrpBox };
  };

  // Add item to cart with DGDA checks
  const handleAddToCart = () => {
    if (!selectedMedicine) return;

    const batch = selectedMedicine.batches.find((b) => b.id === selectedBatchId);
    if (!batch) {
      alert('Please select a valid batch.');
      return;
    }

    // Check expiry
    const isExpired = new Date(batch.expiryDate).getTime() < new Date().getTime();
    if (isExpired) {
      alert(`DGDA Alert: Batch ${batch.batchNumber} expired on ${batch.expiryDate}. Dispensing expired medication is strictly prohibited.`);
      return;
    }

    const { multiplier, price } = getUnitMultiplierAndPrice(selectedMedicine, selectedUnit);
    const requiredPcs = quantity * multiplier;

    if (requiredPcs > batch.stockPcs) {
      alert(`Insufficient stock! Selected batch has ${batch.stockPcs} pcs available (${(batch.stockPcs / multiplier).toFixed(1)} ${selectedUnit}).`);
      return;
    }

    // Check DGDA MRP ceiling
    const effectivePcsPrice = price / multiplier;
    if (effectivePcsPrice > selectedMedicine.dgdaMaxMrpPcs + 0.01) {
      setMrpViolationAlert(
        `DGDA Price Violation: Calculated piece price ৳${effectivePcsPrice.toFixed(2)} exceeds DGDA Capped MRP of ৳${selectedMedicine.dgdaMaxMrpPcs.toFixed(2)}.`
      );
      return;
    }
    setMrpViolationAlert(null);

    // Schedule G Narcotic Check
    if (selectedMedicine.isScheduleG && (!doctorBmdc || !customerPhone)) {
      setShowScheduleGModal(true);
      return;
    }

    const newItem: CartItem = {
      medicineId: selectedMedicine.id,
      brandName: selectedMedicine.brandName,
      genericName: selectedMedicine.genericName,
      strength: selectedMedicine.strength,
      dosageForm: selectedMedicine.dosageForm,
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      expiryDate: batch.expiryDate,
      rackLocation: batch.rackLocation,
      unit: selectedUnit,
      quantity,
      multiplierToPcs: multiplier,
      unitPrice: price,
      mrpPcs: selectedMedicine.unitConfig.mrpPcs,
      totalAmount: price * quantity,
      costPricePcs: batch.costPricePcs,
      isScheduleG: selectedMedicine.isScheduleG
    };

    setCart((prev) => [...prev, newItem]);
    setSelectedMedicine(null);
    setQuantity(1);
    searchInputRef.current?.focus();
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Totals
  const subtotal = cart.reduce((acc, item) => acc + item.totalAmount, 0);
  const discountAmount =
    discountType === 'percentage'
      ? (subtotal * discountValue) / 100
      : Math.min(discountValue, subtotal);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  // Bangladesh standard retail truncated VAT rate 2.4% or 0%
  const vatRate = 2.4;
  const vatAmount = (taxableAmount * vatRate) / 100;
  const netTotal = Math.round(taxableAmount + vatAmount);

  const effectivePaid =
    paidAmountInput !== '' ? parseFloat(paidAmountInput) || 0 : paymentMethod === 'due' ? 0 : netTotal;
  const dueAmount = Math.max(0, netTotal - effectivePaid);
  const changeAmount = Math.max(0, effectivePaid - netTotal);

  // Complete checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty. Scan or search medicines to proceed.');
      return;
    }

    if (userRole === 'accountant') {
      alert('Permission Denied: Accountants cannot dispense counter sales. Please switch to Salesperson or Admin.');
      return;
    }

    // Schedule G validation
    const hasScheduleG = cart.some((i) => i.isScheduleG);
    if (hasScheduleG && (!doctorBmdc || !customerPhone)) {
      setShowScheduleGModal(true);
      return;
    }

    // If due exists, customer phone & name are mandatory
    if (dueAmount > 0 && (!customerName || !customerPhone)) {
      alert('Customer Name and Mobile Phone are required when recording partial payment or Customer Due.');
      return;
    }

    const now = new Date();
    const invoiceNumber = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      Math.floor(1000 + Math.random() * 9000)
    )}`;
    const mushakNumber = `MUSHAK-6.3/${now.getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`;

    const newInvoice: SalesInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      mushakNumber,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      customerName: customerName || 'Walk-in Patient',
      customerPhone: customerPhone || 'N/A',
      doctorBmdc: doctorBmdc || undefined,
      items: [...cart],
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      vatRate,
      vatAmount,
      netTotal,
      paidAmount: effectivePaid,
      dueAmount,
      paymentMethod,
      servedBy: userRole === 'admin' ? 'Store Manager (Admin)' : 'Md. Ashraful (Pharmacist #C-1849)'
    };

    onCompleteSale(newInvoice);
    setCompletedInvoice(newInvoice);

    // Reset Form
    setCart([]);
    setPaidAmountInput('');
    setCustomerName('');
    setCustomerPhone('');
    setDoctorBmdc('');
    setPatientNid('');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Keyboard Shortcuts & Clinical Notice */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800">Hotkeys:</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono">F2</kbd> Search Medicine</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono">F4</kbd> Clear Cart</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono">Enter</kbd> Add / Select</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>DGDA Gazette Price Guard: Active</span>
          <span className="text-slate-400">·</span>
          <span>Mushak 6.3 Engine: Ready</span>
        </div>
      </div>

      {/* Main Grid: Left Search & Medicine Selection, Right Cart & Checkout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (7 cols): Medicine Lookup & Dispensing Form */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search Box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Rapid Medicine Search (Trade Name, Generic Molecule, or Barcode)
            </label>
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type 'Napa', 'Paracetamol', 'Sergel', 'Ace', or scan barcode..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {filteredMedicines.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-72 overflow-y-auto divide-y divide-slate-100">
                {filteredMedicines.map((med) => {
                  const totalStock = med.batches.reduce((sum, b) => sum + (b.isQuarantined ? 0 : b.stockPcs), 0);
                  return (
                    <button
                      key={med.id}
                      onClick={() => handleSelectMedicine(med)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-emerald-50 flex items-center justify-between text-xs transition-colors ${
                        med.isBanned ? 'bg-red-50 hover:bg-red-100' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{med.brandName}</span>
                          <span className="text-slate-600 font-medium">{med.strength}</span>
                          <span className="text-[11px] text-slate-500">({med.dosageForm})</span>
                          {med.isScheduleG && (
                            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-semibold">
                              Schedule G Narcotic
                            </span>
                          )}
                          {med.isBanned && (
                            <span className="text-[10px] bg-red-700 text-white px-1.5 py-0.2 rounded font-bold">
                              DGDA BANNED
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>Generic: <strong>{med.genericName}</strong></span>
                          <span>·</span>
                          <span>{med.manufacturer}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-800">
                          ৳{med.unitConfig.mrpPcs.toFixed(2)} / pc
                        </div>
                        <div className={`text-[11px] font-mono ${totalStock <= med.reorderLevelPcs ? 'text-amber-600 font-semibold' : 'text-slate-500'}`}>
                          Stock: {totalStock} pcs
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Banned Drug Notice if hit */}
          {bannedDrugAlert && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-xs text-red-900 flex items-start gap-2">
              <span className="text-base">🚫</span>
              <div>
                <strong className="block text-red-800">DGDA PROHIBITION & RECALL NOTICE</strong>
                <p>{bannedDrugAlert}</p>
                <p className="mt-1 text-[11px] text-red-700">Dispensing this item is locked by DGDA compliance rule.</p>
              </div>
            </div>
          )}

          {/* Medicine Configurator: Unit & Batch & Add to Cart */}
          {selectedMedicine && !selectedMedicine.isBanned && (
            <div className="bg-white p-4 rounded-xl border border-emerald-300 shadow-sm space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedMedicine.brandName} {selectedMedicine.strength}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      ({selectedMedicine.dosageForm})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Generic: <strong className="text-emerald-800">{selectedMedicine.genericName}</strong> · {selectedMedicine.manufacturer}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    DAR Reg: {selectedMedicine.darNumber} · DGDA Max MRP: ৳{selectedMedicine.dgdaMaxMrpPcs.toFixed(2)}/pc
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMedicine(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕ Cancel
                </button>
              </div>

              {/* Unit Conversion Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Dispensing Unit (Strip / Box / Loose Pcs)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUnit('pcs')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      selectedUnit === 'pcs'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">1 Piece (Loose)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      ৳{selectedMedicine.unitConfig.mrpPcs.toFixed(2)}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUnit('strip')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      selectedUnit === 'strip'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">
                      1 Strip ({selectedMedicine.unitConfig.pcsPerStrip} pcs)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      ৳{selectedMedicine.unitConfig.mrpStrip.toFixed(2)}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUnit('box')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      selectedUnit === 'box'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">
                      1 Box ({selectedMedicine.unitConfig.totalPcsPerBox} pcs)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      ৳{selectedMedicine.unitConfig.mrpBox.toFixed(2)}
                    </div>
                  </button>
                </div>
              </div>

              {/* Batch & FEFO Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Physical Batch & Location (FEFO Auto-Sorted)
                  </label>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    ✓ FEFO Algorithm: Nearest Expiry Prioritized
                  </span>
                </div>
                <div className="space-y-1.5">
                  {selectedMedicine.batches.map((batch) => {
                    const expiryDate = new Date(batch.expiryDate);
                    const now = new Date();
                    const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
                    const isNearExpiry = diffDays < 90 && diffDays > 0;
                    const isExpired = diffDays <= 0;

                    return (
                      <label
                        key={batch.id}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                          selectedBatchId === batch.id
                            ? 'border-emerald-600 bg-emerald-50/70 font-semibold'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        } ${isExpired ? 'opacity-60 bg-red-50 border-red-200' : ''}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="batchSelect"
                            value={batch.id}
                            checked={selectedBatchId === batch.id}
                            onChange={() => setSelectedBatchId(batch.id)}
                            disabled={isExpired || batch.stockPcs === 0}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="font-mono font-bold text-slate-900">
                              Batch: {batch.batchNumber}
                            </span>
                            <span className="text-slate-500 ml-2">
                              Exp: <strong>{batch.expiryDate}</strong>
                            </span>
                            {isNearExpiry && (
                              <span className="ml-2 text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
                                Near Expiry ({diffDays}d)
                              </span>
                            )}
                            {isExpired && (
                              <span className="ml-2 text-[10px] text-red-700 bg-red-100 px-1.5 py-0.2 rounded font-bold">
                                EXPIRED - DO NOT SELL
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-600 text-[11px] font-mono mr-3">
                            Loc: {batch.rackLocation}
                          </span>
                          <span className="font-mono text-emerald-800 font-semibold">
                            {batch.stockPcs} pcs available
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & Add Action */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-32">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity ({selectedUnit})
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-center font-mono font-bold"
                  />
                </div>
                <div className="flex-1 pt-5">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>+ Add to Cart</span>
                    <span className="font-mono font-normal">
                      (Total: ৳{(getUnitMultiplierAndPrice(selectedMedicine, selectedUnit).price * quantity).toFixed(2)})
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Generic Substitution Matrix */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>Quick Generic Substitution Finder (DGDA INN Database)</span>
              <span className="text-[11px] text-slate-500 font-normal">
                Click molecule to view trade brands
              </span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['Paracetamol', 'Esomeprazole', 'Omeprazole', 'Montelukast', 'Azithromycin', 'Diazepam'].map(
                (gen) => (
                  <button
                    key={gen}
                    onClick={() => setSearchTerm(gen)}
                    className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 rounded-md transition-colors"
                  >
                    {gen}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Current Cart & Payment Checkout */}
        <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Current Sales Cart</h3>
                <span className="text-xs text-slate-500">({cart.length} items)</span>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-xs text-red-600 hover:underline"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Cart is empty. Search medicine or scan barcode to add items.
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-start justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {item.brandName} {item.strength}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.quantity} {item.unit} @ ৳{item.unitPrice.toFixed(2)} · B:{item.batchNumber}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Loc: {item.rackLocation} · Exp: {item.expiryDate}
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-900">
                        ৳{item.totalAmount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-red-600 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Patient & Doctor BMDC Form */}
            <div className="border-t border-slate-200 pt-3 mt-3 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Customer / Patient Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rafiqul Islam"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Customer Mobile # (for Credit/SMS)
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="01712-XXXXXX"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Doctor BMDC Reg # (Rx)
                  </label>
                  <input
                    type="text"
                    value={doctorBmdc}
                    onChange={(e) => setDoctorBmdc(e.target.value)}
                    placeholder="e.g. A-49281"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Patient NID (Schedule G Narcotic)
                  </label>
                  <input
                    type="text"
                    value={patientNid}
                    onChange={(e) => setPatientNid(e.target.value)}
                    placeholder="National ID #"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Checkout & Financial Summary */}
          <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
            {/* Discount Control */}
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Discount:</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-0.5 border border-slate-300 rounded text-right font-mono"
                />
                <button
                  type="button"
                  onClick={() => setDiscountType(discountType === 'percentage' ? 'fixed' : 'percentage')}
                  className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-[11px] font-semibold text-slate-700"
                >
                  {discountType === 'percentage' ? '%' : '৳'}
                </button>
              </div>
            </div>

            {/* Financial Rows */}
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono">৳{subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount Applied:</span>
                <span className="font-mono">-৳{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>NBR Retail VAT (2.4% Included):</span>
              <span className="font-mono">৳{vatAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-1.5">
              <span>Net Total Payable:</span>
              <span className="font-mono text-emerald-800">৳{netTotal.toFixed(2)}</span>
            </div>

            {/* Payment Mode Selector */}
            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Payment Channel
              </label>
              <div className="grid grid-cols-5 gap-1 text-[11px]">
                {(['cash', 'bkash', 'nagad', 'card', 'due'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-1.5 rounded text-center capitalize font-semibold transition-all ${
                      paymentMethod === method
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Paid & Due Input */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">
                  Amount Received (৳)
                </label>
                <input
                  type="number"
                  placeholder={netTotal.toString()}
                  value={paidAmountInput}
                  onChange={(e) => setPaidAmountInput(e.target.value)}
                  className="w-full px-2.5 py-1 border border-slate-300 rounded font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">
                  {dueAmount > 0 ? 'Customer Due (৳)' : 'Change Return (৳)'}
                </label>
                <div
                  className={`w-full px-2.5 py-1 rounded font-mono font-bold text-sm ${
                    dueAmount > 0
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  ৳{dueAmount > 0 ? dueAmount.toFixed(2) : changeAmount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Complete Sale & Print 80mm Slip</span>
              <kbd className="px-1.5 py-0.5 bg-emerald-700 text-white rounded text-[10px] font-mono">
                F8
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Schedule G Narcotics Mandatory Form Modal */}
      {showScheduleGModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-red-300">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm border-b border-red-100 pb-2">
              <span className="text-xl">⚠️</span>
              <span>DGDA Schedule G Controlled Narcotic Protocol</span>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Under Bangladesh Narcotics Control Act & DGDA regulations, psychotropic/sedative medicines
              (e.g., Diazepam, Sedil) cannot be sold over the counter.
            </p>
            <div className="space-y-3 mt-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Doctor BMDC Registration Number *
                </label>
                <input
                  type="text"
                  value={doctorBmdc}
                  onChange={(e) => setDoctorBmdc(e.target.value)}
                  placeholder="e.g. A-48201 (from prescription)"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Patient National ID (NID) or Passport *
                </label>
                <input
                  type="text"
                  value={patientNid}
                  onChange={(e) => setPatientNid(e.target.value)}
                  placeholder="e.g. 19822691234567890"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Patient Contact Phone Number *
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="01712-XXXXXX"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowScheduleGModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!doctorBmdc || !customerPhone) {
                    alert('Doctor BMDC and Patient Phone are required.');
                    return;
                  }
                  setShowScheduleGModal(false);
                  handleAddToCart();
                }}
                className="px-4 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Confirm & Log to Narcotic Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thermal Receipt Preview Modal */}
      {completedInvoice && (
        <ThermalReceiptModal
          invoice={completedInvoice}
          onClose={() => setCompletedInvoice(null)}
        />
      )}
    </div>
  );
};
