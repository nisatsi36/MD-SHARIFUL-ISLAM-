import React, { useState } from 'react';
import { Medicine, BatchItem, UserRole } from '../../types/pharmacy';

interface InventoryManagementProps {
  medicines: Medicine[];
  onAddBatch: (medicineId: string, newBatch: BatchItem) => void;
  onQuarantineBatch: (medicineId: string, batchId: string) => void;
  userRole: UserRole;
}

export const InventoryManagement: React.FC<InventoryManagementProps> = ({
  medicines,
  onAddBatch,
  onQuarantineBatch,
  userRole
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'near_expiry' | 'expired' | 'cold_chain' | 'low_stock'>('all');
  const [selectedMedicineForBatch, setSelectedMedicineForBatch] = useState<Medicine | null>(null);

  // New Batch Form State
  const [newBatchNumber, setNewBatchNumber] = useState('');
  const [newManufacturingDate, setNewManufacturingDate] = useState('2024-06-01');
  const [newExpiryDate, setNewExpiryDate] = useState('2027-06-30');
  const [newStockBoxes, setNewStockBoxes] = useState<number>(5);
  const [newCostPricePcs, setNewCostPricePcs] = useState<number>(0.90);
  const [newRackLocation, setNewRackLocation] = useState('Rack A-02 / Shelf 1');

  // Filter logic
  const now = new Date();

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.batches.some((b) => b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === 'cold_chain') {
      return med.requiresRefrigeration;
    }

    const totalStock = med.batches.reduce((sum, b) => sum + (b.isQuarantined ? 0 : b.stockPcs), 0);
    if (filterStatus === 'low_stock') {
      return totalStock <= med.reorderLevelPcs;
    }

    if (filterStatus === 'near_expiry') {
      return med.batches.some((b) => {
        const diffDays = Math.ceil((new Date(b.expiryDate).getTime() - now.getTime()) / (1000 * 3600 * 24));
        return diffDays > 0 && diffDays <= 90 && !b.isQuarantined;
      });
    }

    if (filterStatus === 'expired') {
      return med.batches.some((b) => {
        const diffDays = Math.ceil((new Date(b.expiryDate).getTime() - now.getTime()) / (1000 * 3600 * 24));
        return diffDays <= 0 || b.isQuarantined;
      });
    }

    return true;
  });

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicineForBatch || !newBatchNumber) return;

    const totalPcs = newStockBoxes * selectedMedicineForBatch.unitConfig.totalPcsPerBox;

    const newBatch: BatchItem = {
      id: `b-${Date.now()}`,
      batchNumber: newBatchNumber.toUpperCase(),
      manufacturingDate: newManufacturingDate,
      expiryDate: newExpiryDate,
      stockPcs: totalPcs,
      costPricePcs: newCostPricePcs,
      rackLocation: newRackLocation,
      isQuarantined: false
    };

    onAddBatch(selectedMedicineForBatch.id, newBatch);
    setSelectedMedicineForBatch(null);
    setNewBatchNumber('');
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[280px]">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Brand, Generic (e.g. Paracetamol), Batch #, or Manufacturer..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 font-semibold rounded-md transition-all ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Stock
          </button>
          <button
            onClick={() => setFilterStatus('near_expiry')}
            className={`px-3 py-1 font-semibold rounded-md transition-all ${
              filterStatus === 'near_expiry'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Near Expiry (&lt;90d)
          </button>
          <button
            onClick={() => setFilterStatus('expired')}
            className={`px-3 py-1 font-semibold rounded-md transition-all ${
              filterStatus === 'expired'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expired / Quarantined
          </button>
          <button
            onClick={() => setFilterStatus('cold_chain')}
            className={`px-3 py-1 font-semibold rounded-md transition-all ${
              filterStatus === 'cold_chain'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cold Chain (2-8°C)
          </button>
          <button
            onClick={() => setFilterStatus('low_stock')}
            className={`px-3 py-1 font-semibold rounded-md transition-all ${
              filterStatus === 'low_stock'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Low Stock Alerts
          </button>
        </div>
      </div>

      {/* Inventory & Batch Cards */}
      <div className="space-y-3">
        {filteredMedicines.map((med) => {
          const totalPcs = med.batches.reduce((sum, b) => sum + (b.isQuarantined ? 0 : b.stockPcs), 0);
          const totalStrips = Math.floor(totalPcs / med.unitConfig.pcsPerStrip);
          const totalBoxes = (totalPcs / med.unitConfig.totalPcsPerBox).toFixed(1);
          const isLowStock = totalPcs <= med.reorderLevelPcs;

          return (
            <div
              key={med.id}
              className={`bg-white rounded-xl border ${
                med.isBanned
                  ? 'border-red-300 bg-red-50/20'
                  : isLowStock
                  ? 'border-amber-300'
                  : 'border-slate-200'
              } p-4 shadow-xs`}
            >
              {/* Medicine Header */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {med.brandName} {med.strength}
                    </h3>
                    <span className="text-xs text-slate-600 font-medium">({med.dosageForm})</span>
                    {med.requiresRefrigeration && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                        ❄ Cold Chain (2°C - 8°C)
                      </span>
                    )}
                    {med.isScheduleG && (
                      <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-semibold">
                        Schedule G Narcotic
                      </span>
                    )}
                    {med.isBanned && (
                      <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded font-bold">
                        DGDA BANNED / RECALLED
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                    <span>Generic: <strong className="text-emerald-800">{med.genericName}</strong></span>
                    <span>·</span>
                    <span>Mfg: {med.manufacturer}</span>
                    <span>·</span>
                    <span>DAR: {med.darNumber}</span>
                    <span>·</span>
                    <span>Barcode: {med.barcode}</span>
                  </div>
                </div>

                {/* Stock & Unit Breakdown */}
                <div className="flex items-center gap-4 text-right">
                  <div className="text-xs">
                    <div className="text-slate-500 text-[11px]">Total Available Stock</div>
                    <div className="font-mono font-bold text-sm text-slate-900">
                      {totalPcs} Pcs <span className="text-slate-400 font-normal">|</span> {totalStrips} Strips <span className="text-slate-400 font-normal">|</span> {totalBoxes} Boxes
                    </div>
                    {isLowStock && (
                      <span className="text-[10px] text-amber-700 font-semibold">
                        ⚠️ Reorder Level ({med.reorderLevelPcs} pcs) reached
                      </span>
                    )}
                  </div>
                  {userRole !== 'salesperson' && (
                    <button
                      onClick={() => setSelectedMedicineForBatch(med)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      + Receive Batch
                    </button>
                  )}
                </div>
              </div>

              {/* Unit Conversion Blueprint Strip */}
              <div className="py-2.5 bg-slate-50 rounded-lg px-3 mt-3 flex flex-wrap items-center justify-between text-xs text-slate-600 border border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-slate-800">Unit Blueprint:</span>
                  <span>1 Box = <strong>{med.unitConfig.stripsPerBox}</strong> Strips = <strong>{med.unitConfig.totalPcsPerBox}</strong> Pcs</span>
                  <span>·</span>
                  <span>1 Strip = <strong>{med.unitConfig.pcsPerStrip}</strong> Pcs</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span>MRP: ৳{med.unitConfig.mrpPcs.toFixed(2)}/pc</span>
                  <span>৳{med.unitConfig.mrpStrip.toFixed(2)}/strip</span>
                  <span>৳{med.unitConfig.mrpBox.toFixed(2)}/box</span>
                  {userRole !== 'salesperson' && (
                    <span className="text-emerald-700 font-semibold">
                      (Cost: ৳{med.unitConfig.costPricePcs.toFixed(2)}/pc)
                    </span>
                  )}
                </div>
              </div>

              {/* Batches Table */}
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">Batch Number</th>
                      <th className="px-3 py-2">Physical Location</th>
                      <th className="px-3 py-2">Mfg Date</th>
                      <th className="px-3 py-2">Expiry Date (FEFO)</th>
                      <th className="px-3 py-2">Stock Balance</th>
                      {userRole !== 'salesperson' && <th className="px-3 py-2">Purchase Cost</th>}
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {med.batches.map((batch) => {
                      const expiryDate = new Date(batch.expiryDate);
                      const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
                      const isNearExpiry = diffDays > 0 && diffDays <= 90;
                      const isExpired = diffDays <= 0;

                      return (
                        <tr
                          key={batch.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            batch.isQuarantined
                              ? 'bg-red-50/50'
                              : isExpired
                              ? 'bg-red-50/30'
                              : isNearExpiry
                              ? 'bg-amber-50/30'
                              : ''
                          }`}
                        >
                          <td className="px-3 py-2.5 font-mono font-bold text-slate-900">
                            {batch.batchNumber}
                          </td>
                          <td className="px-3 py-2.5 text-slate-600 font-medium">
                            📍 {batch.rackLocation}
                          </td>
                          <td className="px-3 py-2.5 text-slate-500 font-mono">
                            {batch.manufacturingDate}
                          </td>
                          <td className="px-3 py-2.5 font-mono font-semibold">
                            <span
                              className={
                                isExpired
                                  ? 'text-red-600'
                                  : isNearExpiry
                                  ? 'text-amber-600'
                                  : 'text-slate-800'
                              }
                            >
                              {batch.expiryDate}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-mono font-bold text-slate-900">
                            {batch.stockPcs} pcs
                            <span className="text-slate-400 font-normal ml-1">
                              ({(batch.stockPcs / med.unitConfig.pcsPerStrip).toFixed(0)} strips)
                            </span>
                          </td>
                          {userRole !== 'salesperson' && (
                            <td className="px-3 py-2.5 font-mono text-slate-600">
                              ৳{batch.costPricePcs.toFixed(2)} / pc
                            </td>
                          )}
                          <td className="px-3 py-2.5">
                            {batch.isQuarantined ? (
                              <span className="text-[10px] text-red-700 bg-red-100 px-2 py-0.5 rounded font-bold">
                                Quarantined
                              </span>
                            ) : isExpired ? (
                              <span className="text-[10px] text-red-700 bg-red-100 px-2 py-0.5 rounded font-bold">
                                Expired ({Math.abs(diffDays)}d ago)
                              </span>
                            ) : isNearExpiry ? (
                              <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-semibold">
                                Near Expiry ({diffDays}d left)
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-medium">
                                Healthy Stock
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            {!batch.isQuarantined && (isNearExpiry || isExpired) && (
                              <button
                                onClick={() => onQuarantineBatch(med.id, batch.id)}
                                className="px-2 py-1 text-[11px] font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded transition-colors"
                                title="Move to quarantine box for DGDA inspection or supplier return credit"
                              >
                                Quarantine
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Batch Modal */}
      {selectedMedicineForBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Stock Receiving & Batch Ingestion (GRN)
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedMedicineForBatch.brandName} {selectedMedicineForBatch.strength} ({selectedMedicineForBatch.genericName})
                </p>
              </div>
              <button
                onClick={() => setSelectedMedicineForBatch(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3 mt-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Batch Number (from Box) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBatchNumber}
                    onChange={(e) => setNewBatchNumber(e.target.value)}
                    placeholder="e.g. SQ-2409"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Rack / Shelf Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRackLocation}
                    onChange={(e) => setNewRackLocation(e.target.value)}
                    placeholder="e.g. Rack B-02 / Shelf 1"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Manufacturing Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newManufacturingDate}
                    onChange={(e) => setNewManufacturingDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Expiry Date (DGDA FEFO) *
                  </label>
                  <input
                    type="date"
                    required
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Received Quantity (Boxes) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newStockBoxes}
                    onChange={(e) => setNewStockBoxes(parseInt(e.target.value) || 1)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    = {newStockBoxes * selectedMedicineForBatch.unitConfig.totalPcsPerBox} Pcs total
                  </span>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Trade Cost Price per Pc (৳) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={0.01}
                    required
                    value={newCostPricePcs}
                    onChange={(e) => setNewCostPricePcs(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    DGDA Capped MRP: ৳{selectedMedicineForBatch.dgdaMaxMrpPcs.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedMedicineForBatch(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold shadow-xs"
                >
                  Save & Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
