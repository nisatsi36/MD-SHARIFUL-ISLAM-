import { useState } from 'react';
import { Header } from './components/Header';
import { PosTerminal } from './components/pos/PosTerminal';
import { InventoryManagement } from './components/inventory/InventoryManagement';
import { SupplierManagement } from './components/suppliers/SupplierManagement';
import { FinancialReports } from './components/reports/FinancialReports';
import { SrsDocumentation } from './components/srs/SrsDocumentation';
import { DatabaseSchemaViewer } from './components/schema/DatabaseSchemaViewer';
import { TechStackRoadmap } from './components/architecture/TechStackRoadmap';
import { CashierWorkflowSimulator } from './components/workflow/CashierWorkflowSimulator';
import {
  INITIAL_MEDICINES,
  INITIAL_SUPPLIERS,
  INITIAL_INVOICES,
  INITIAL_CUSTOMER_DUES
} from './data/mockPharmacyData';
import {
  Medicine,
  Supplier,
  SalesInvoice,
  CustomerDueRecord,
  BatchItem,
  UserRole
} from './types/pharmacy';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('pos');
  const [userRole, setUserRole] = useState<UserRole>('admin');

  // ERP Core State
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [invoices, setInvoices] = useState<SalesInvoice[]>(INITIAL_INVOICES);
  const [customerDues, setCustomerDues] = useState<CustomerDueRecord[]>(INITIAL_CUSTOMER_DUES);

  // Real-time stock deduction and due recording on sale completion
  const handleCompleteSale = (newInvoice: SalesInvoice) => {
    // 1. Deduct physical batch stock
    setMedicines((prevMedicines) =>
      prevMedicines.map((med) => {
        const itemSold = newInvoice.items.find((item) => item.medicineId === med.id);
        if (!itemSold) return med;

        return {
          ...med,
          batches: med.batches.map((batch) => {
            if (batch.id === itemSold.batchId) {
              const updatedStock = Math.max(0, batch.stockPcs - itemSold.quantity * itemSold.multiplierToPcs);
              return { ...batch, stockPcs: updatedStock };
            }
            return batch;
          })
        };
      })
    );

    // 2. Add Invoice
    setInvoices((prev) => [newInvoice, ...prev]);

    // 3. If partial payment with remaining due, add to customer due ledger
    if (newInvoice.dueAmount > 0) {
      const newDue: CustomerDueRecord = {
        id: `due-${Date.now()}`,
        customerName: newInvoice.customerName || 'Walk-in Patient',
        customerPhone: newInvoice.customerPhone || 'N/A',
        doctorBmdc: newInvoice.doctorBmdc,
        invoiceId: newInvoice.invoiceNumber,
        invoiceDate: newInvoice.date,
        totalBill: newInvoice.netTotal,
        paidAmount: newInvoice.paidAmount,
        dueAmount: newInvoice.dueAmount,
        status: newInvoice.paidAmount > 0 ? 'partially_paid' : 'pending',
        lastPaymentDate: newInvoice.date
      };
      setCustomerDues((prev) => [newDue, ...prev]);
    }
  };

  // Add new batch from supplier intake (GRN)
  const handleAddBatch = (medicineId: string, newBatch: BatchItem) => {
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === medicineId) {
          return {
            ...med,
            batches: [newBatch, ...med.batches]
          };
        }
        return med;
      })
    );
  };

  // Quarantine batch
  const handleQuarantineBatch = (medicineId: string, batchId: string) => {
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === medicineId) {
          return {
            ...med,
            batches: med.batches.map((b) =>
              b.id === batchId ? { ...b, isQuarantined: true } : b
            )
          };
        }
        return med;
      })
    );
  };

  // Settle supplier payable
  const handlePaySupplier = (supplierId: string, amount: number) => {
    setSuppliers((prev) =>
      prev.map((sup) => {
        if (sup.id === supplierId) {
          return {
            ...sup,
            currentBalanceDue: Math.max(0, sup.currentBalanceDue - amount)
          };
        }
        return sup;
      })
    );
  };

  // Settle customer due
  const handleSettleDue = (dueId: string, amount: number) => {
    setCustomerDues((prev) =>
      prev.map((due) => {
        if (due.id === dueId) {
          const newDue = Math.max(0, due.dueAmount - amount);
          return {
            ...due,
            paidAmount: due.paidAmount + amount,
            dueAmount: newDue,
            status: newDue === 0 ? 'cleared' : 'partially_paid',
            lastPaymentDate: new Date().toISOString().split('T')[0]
          };
        }
        return due;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar Navigation & Role Switcher */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'pos' && (
          <PosTerminal
            medicines={medicines}
            onCompleteSale={handleCompleteSale}
            userRole={userRole}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryManagement
            medicines={medicines}
            onAddBatch={handleAddBatch}
            onQuarantineBatch={handleQuarantineBatch}
            userRole={userRole}
          />
        )}

        {activeTab === 'suppliers' && (
          <SupplierManagement
            suppliers={suppliers}
            medicines={medicines}
            onPaySupplier={handlePaySupplier}
            userRole={userRole}
          />
        )}

        {activeTab === 'reports' && (
          <FinancialReports
            invoices={invoices}
            customerDues={customerDues}
            medicines={medicines}
            onSettleDue={handleSettleDue}
            userRole={userRole}
          />
        )}

        {activeTab === 'srs' && <SrsDocumentation />}

        {activeTab === 'schema' && <DatabaseSchemaViewer />}

        {activeTab === 'architecture' && <TechStackRoadmap />}

        {activeTab === 'workflow' && <CashierWorkflowSimulator />}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">PharmaBangla ERP</span>
            <span>·</span>
            <span>Directorate General of Drug Administration (DGDA) & NBR Mushak-6.3 Compliant</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Active Counter: Dhaka-01</span>
            <span>·</span>
            <span>Session: Secure Local / Edge</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
