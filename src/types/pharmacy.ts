export type UnitType = 'pcs' | 'strip' | 'box';

export type UserRole = 'admin' | 'salesperson' | 'accountant';

export interface MedicineUnitConfig {
  pcsPerStrip: number;
  stripsPerBox: number;
  totalPcsPerBox: number;
  costPricePcs: number;
  mrpPcs: number; // DGDA Capped MRP per piece in BDT
  mrpStrip: number;
  mrpBox: number;
}

export interface BatchItem {
  id: string;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  manufacturingDate: string;
  stockPcs: number;
  costPricePcs: number;
  rackLocation: string; // e.g. "Rack A-02 / Shelf 3"
  isQuarantined?: boolean;
}

export interface Medicine {
  id: string;
  brandName: string; // e.g. Napa, Ace, Sergel
  strength: string; // e.g. 500mg, 20mg, 10mg
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Suspension' | 'Eye Drops';
  genericName: string; // e.g. Paracetamol, Esomeprazole
  manufacturer: string; // e.g. Beximco, Square, Incepta
  barcode: string; // EAN-13
  darNumber: string; // DGDA Drug Administration Registration e.g. "DAR-024-3829-01"
  dgdaMaxMrpPcs: number; // Maximum Retail Price authorized by DGDA in BDT
  isScheduleG: boolean; // Narcotic / Sedative / Habit forming - requires Doctor BMDC & NID
  isBanned: boolean; // DGDA banned or recalled drug
  banReason?: string;
  requiresRefrigeration: boolean; // 2°C - 8°C e.g. Insulin
  unitConfig: MedicineUnitConfig;
  batches: BatchItem[];
  reorderLevelPcs: number;
}

export interface CartItem {
  medicineId: string;
  brandName: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  batchId: string;
  batchNumber: string;
  expiryDate: string;
  rackLocation: string;
  unit: UnitType;
  quantity: number;
  multiplierToPcs: number;
  unitPrice: number;
  mrpPcs: number;
  totalAmount: number;
  costPricePcs: number;
  isScheduleG: boolean;
}

export interface CustomerDueRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  patientNid?: string;
  doctorBmdc?: string;
  invoiceId: string;
  invoiceDate: string;
  totalBill: number;
  paidAmount: number;
  dueAmount: number;
  status: 'pending' | 'partially_paid' | 'cleared';
  lastPaymentDate?: string;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  mushakNumber: string; // NBR Mushak-6.3 format
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  doctorBmdc?: string;
  items: CartItem[];
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  vatRate: number; // usually 2.4% retail or 0%
  vatAmount: number;
  netTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: 'cash' | 'bkash' | 'nagad' | 'card' | 'due' | 'mixed';
  servedBy: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  dgdaDistributorLicense: string;
  currentBalanceDue: number; // BDT ৳
}

export interface PurchaseOrderItem {
  medicineId: string;
  brandName: string;
  genericName: string;
  batchNumber: string;
  expiryDate: string;
  boxQuantity: number;
  costPriceBox: number;
  totalCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  receivedDate?: string;
  status: 'draft' | 'ordered' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  challanNumber?: string;
}

export interface DgdaRegulationNotice {
  genericName: string;
  gazetteNumber: string;
  effectiveDate: string;
  fixedMaxMrpPcs: number;
  category: 'Essential Drug' | 'Schedule G Narcotic' | 'Banned Drug' | 'Antibiotic Protocol';
  warningMessage: string;
}
