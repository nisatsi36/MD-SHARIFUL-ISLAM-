export interface SrsSection {
  id: string;
  title: string;
  category: string;
  description: string;
  requirements: {
    id: string;
    name: string;
    priority: 'P0 - Critical' | 'P1 - High' | 'P2 - Medium';
    spec: string;
    bangladeshContext: string;
  }[];
}

export const SRS_CORE_MODULES: SrsSection[] = [
  {
    id: 'srs-inventory',
    title: '1. Inventory & Stock Management Specification',
    category: 'Inventory & Supply Chain',
    description: 'Real-time multi-batch, multi-unit inventory engine engineered specifically for retail retail pharmacy nuances in Bangladesh.',
    requirements: [
      {
        id: 'FR-INV-01',
        name: 'Batch-Level Tracking & FEFO Dispensing',
        priority: 'P0 - Critical',
        spec: 'System must maintain distinct batch records per medicine with unique Batch Number, Manufacturing Date, Expiry Date, Purchase Cost Price, and Current Physical Stock. When an item is added to the cart, the system auto-selects the nearest expiring batch (First Expire, First Out - FEFO).',
        bangladeshContext: 'In Bangladesh, pharmaceutical depots deliver different batch lots weekly. Pharmacies face heavy inspection fines from DGDA if expired drugs are found on dispensary shelves.'
      },
      {
        id: 'FR-INV-02',
        name: 'Expiry Date Alert Matrix (30 / 60 / 90 Days)',
        priority: 'P0 - Critical',
        spec: 'Dynamic visual warnings and automated quarantine triggers: Items expiring within 30 days are flagged in Critical Red, within 90 days in Warning Amber, and >90 days in Healthy Green. Allows one-click stock transfer to Quarantine/Return box.',
        bangladeshContext: 'Pharma companies in Bangladesh (Square, Beximco, Incepta) accept near-expiry returns typically within 45 to 60 days before expiration for credit notes.'
      },
      {
        id: 'FR-INV-03',
        name: 'Multi-Level Unit Conversion (Box / Strip / Pcs)',
        priority: 'P0 - Critical',
        spec: 'Strict hierarchical unit multiplier model: 1 Box = N Strips = M Pieces (e.g., Napa 500mg: 1 Box = 10 Strips = 100 Pcs; Sergel 20mg: 1 Box = 4 Strips = 56 Pcs). Real-time inventory deduction always computes in base unit (Pieces) while supporting sales in any unit.',
        bangladeshContext: 'Bangladeshi customers routinely buy 2 or 4 loose tablets, 1 strip, or a full box. The software must calculate fraction prices and deduct inventory accurately without rounding errors.'
      },
      {
        id: 'FR-INV-04',
        name: 'Generic-to-Trade Instant Mapping Search',
        priority: 'P0 - Critical',
        spec: 'Sub-50ms search algorithm indexing both Trade Names (Napa, Ace, Fast) and Generic INN Molecules (Paracetamol). Searching "Paracetamol" immediately lists all available brands in stock with respective manufacturer, dosage form, strength, stock count, and price.',
        bangladeshContext: 'Doctors in Bangladesh frequently write generic prescriptions or alternative brands are requested when prescribed brands are out of stock. Pharmacists require instant generic substitution capability.'
      },
      {
        id: 'FR-INV-05',
        name: 'Rack & Shelf Physical Locator',
        priority: 'P1 - High',
        spec: 'Visual coordinate mapping for every batch (e.g. "Rack A-02 / Shelf 3", "Cold Storage Fridge R-01"). The POS cart and picking ticket immediately display rack coordinates to speed up dispenser retrieval.',
        bangladeshContext: 'Bangladeshi pharmacies stock between 3,000 and 12,000 SKUs in compact shop spaces. Quick locator tags eliminate counter queues during peak evening rush hours (6 PM - 10 PM).'
      }
    ]
  },
  {
    id: 'srs-pos',
    title: '2. POS & Billing Specification',
    category: 'Sales & Billing',
    description: 'High-throughput counter sales interface designed for sub-second keyboard-first operation and Bangladesh payment modalities.',
    requirements: [
      {
        id: 'FR-POS-01',
        name: 'Fast Barcode & Keyboard-First Checkout',
        priority: 'P0 - Critical',
        spec: 'Support for standard 1D/2D USB & Bluetooth barcode scanners (EAN-13, Code 128) with instant autofocus input. Dedicated keyboard shortcuts: F2 (Search Medicine), F4 (Hold Bill), F8 (Checkout), Enter (Add/Confirm), Esc (Clear).',
        bangladeshContext: 'High-traffic retail pharmacies in Dhaka, Chittagong, and district sadars process 500+ bills per counter daily. Mouse reliance is unacceptable for fast cashiers.'
      },
      {
        id: 'FR-POS-02',
        name: 'Flexible Discount Engine (Line-Item & Bill-Level)',
        priority: 'P0 - Critical',
        spec: 'Allows both line-level discount percentage/amount and overall invoice discount (e.g. 5% or 7% standard retail discount, or round-off discount to avoid coin change issues). Role-based maximum discount limits.',
        bangladeshContext: 'Pharmacies in Bangladesh routinely offer 5% to 8% discount to regular patients or chronic disease prescription holders.'
      },
      {
        id: 'FR-POS-03',
        name: 'Partial Payment & Customer Due Ledger',
        priority: 'P0 - Critical',
        spec: 'Capability to accept split payments (e.g., partial Cash + bKash) and record remainder as Customer Due with patient Name, Mobile Number, and optional NID. Real-time customer credit ledger and outstanding balance alerts.',
        bangladeshContext: 'Neighborhood pharmacies ("Para/Mahalla Pharmacy") rely heavily on credit ("Baki") for familiar families. A robust customer ledger prevents bad debt write-offs.'
      },
      {
        id: 'FR-POS-04',
        name: '80mm / 58mm ESC/POS Thermal Printing & Mushak 6.3',
        priority: 'P0 - Critical',
        spec: 'Direct ESC/POS command thermal receipt generation supporting 80mm roll width. Includes Pharmacy Name, DGDA Drug License #, NBR BIN #, Mushak-6.3 compliance lines, itemized batch numbers, expiry dates, BDT currency, and Bengali greeting text.',
        bangladeshContext: 'Complies with National Board of Revenue (NBR) Value Added Tax and Supplementary Duty Act, 2012 for retail sales receipts.'
      },
      {
        id: 'FR-POS-05',
        name: 'Doctor & Patient Prescription Tracking',
        priority: 'P1 - High',
        spec: 'Optional or mandatory entry of Doctor BMDC (Bangladesh Medical & Dental Council) Registration Number, Patient Age, and Gender for antimicrobial and restricted drug sales.',
        bangladeshContext: 'Aligns with DGDA Anti-Microbial Resistance (AMR) surveillance guidelines prohibiting OTC sale of antibiotics without verified doctor prescription.'
      }
    ]
  },
  {
    id: 'srs-supplier',
    title: '3. Supplier & Purchase Management Specification',
    category: 'Procurement & AP',
    description: 'Complete procurement lifecycle from digital Purchase Order (PO) to Goods Received Note (GRN) and Accounts Payable ledger.',
    requirements: [
      {
        id: 'FR-SUP-01',
        name: 'Purchase Order Generation & Reorder Suggestion',
        priority: 'P1 - High',
        spec: 'Automated PO generation grouped by pharmaceutical manufacturer/distributor (Square, Beximco, Incepta, etc.) triggered when batch stock falls below minimum reorder thresholds.',
        bangladeshContext: 'Territory Medical Representatives (MPOs) visit retail pharmacies on designated weekdays to collect orders.'
      },
      {
        id: 'FR-SUP-02',
        name: 'Stock Receiving & Batch Ingestion (GRN)',
        priority: 'P0 - Critical',
        spec: 'Delivery challan intake matching invoice against received physical units, capture of new batch number, manufacturer manufacturing and expiry dates, trade price (TP), and DGDA capped MRP.',
        bangladeshContext: 'Ensures the pharmacy never receives stock expiring in under 12 months unless approved as short-dated stock with special discount.'
      },
      {
        id: 'FR-SUP-03',
        name: 'Supplier Ledger & Due Management',
        priority: 'P0 - Critical',
        spec: 'Double-entry supplier ledger recording Invoice Payable, Debit Notes for returned damaged/expired stock, and payment disbursements (Cheque, Bank Transfer, Cash). Real-time outstanding payable balances.',
        bangladeshContext: 'Pharma distributors in Bangladesh offer 7-day to 30-day credit terms. Late payments freeze order supplies from major pharma houses.'
      }
    ]
  },
  {
    id: 'srs-dgda',
    title: '4. Directorate General of Drug Administration (DGDA) Compliance',
    category: 'Regulatory Compliance',
    description: 'Built-in regulatory firewalls safeguarding the pharmacy license against legal penalties, price gouging, and unauthorized drug sales.',
    requirements: [
      {
        id: 'FR-DGDA-01',
        name: 'DGDA Gazette MRP Price Ceiling Enforcement',
        priority: 'P0 - Critical',
        spec: 'Hard validation barrier: Prevents any sales invoice from pricing an item higher than the official DGDA gazetted Maximum Retail Price (MRP). Salespersons cannot override capped MRP; Admin override logs a regulatory audit event.',
        bangladeshContext: 'DGDA mobile courts regularly inspect pharmacies with magistrate teams. Charging even ৳1 above printed MRP invokes severe fines up to ৳200,000 and temporary store sealing under the Drugs Act 1940 and Mobile Court Act 2009.'
      },
      {
        id: 'FR-DGDA-02',
        name: 'Banned & Recalled Drug Blocking Barrier',
        priority: 'P0 - Critical',
        spec: 'Central regulatory blacklist flag. Any drug revoked or recalled by DGDA (e.g., contaminated syrups or banned fixed-dose combinations) is immediately locked from dispensing, with automated prompt to transfer to quarantine.',
        bangladeshContext: 'Protects public safety and ensures instant compliance whenever DGDA issues emergency gazette notices.'
      },
      {
        id: 'FR-DGDA-03',
        name: 'Schedule G / Controlled Narcotic Prescription Ledger',
        priority: 'P0 - Critical',
        spec: 'Strict audit requirement for psychotropic and narcotic substances (Diazepam, Clonazepam, Pethidine, Morphine). Dispensing requires verified Doctor BMDC number, Patient National ID (NID) or Passport, Patient Mobile, and automatically generates DGDA Form-7 Narcotic Register Report.',
        bangladeshContext: 'Department of Narcotics Control (DNC) and DGDA require retail pharmacies to maintain physical or electronic narcotic registers subject to unannounced audits.'
      },
      {
        id: 'FR-DGDA-04',
        name: 'Standard DGDA Generic Formulary Mapping',
        priority: 'P1 - High',
        spec: 'Database pre-populated with DGDA approved list of over 1,500 active generic substances and 20,000+ trade brands registered with valid DAR (Drug Administration Registration) numbers.',
        bangladeshContext: 'Eliminates manual spelling mistakes and guarantees accurate generic substitution across Bangladeshi pharma manufacturers.'
      }
    ]
  },
  {
    id: 'srs-financials',
    title: '5. Financials, Reports & Tax (NBR Mushak)',
    category: 'Finance & Compliance',
    description: 'Comprehensive financial accounting, profit analytics, inventory loss audit, and tax reporting compliant with Bangladesh fiscal standards.',
    requirements: [
      {
        id: 'FR-FIN-01',
        name: 'Daily Counter Reconciliation & Sales Summary',
        priority: 'P0 - Critical',
        spec: 'Breakdown of Gross Sales, Net Sales, Discounts Given, Cash Collected, Mobile Financial Services (bKash/Nagad/Rocket) Collected, Card Collected, and Customer Credit Added, with shift-end cash drawer reconciliation.',
        bangladeshContext: 'Essential for pharmacy owners to reconcile shift handovers between morning and evening counter staff.'
      },
      {
        id: 'FR-FIN-02',
        name: 'Cost of Goods Sold (COGS) & Profit/Loss Analysis',
        priority: 'P0 - Critical',
        spec: 'Batch-specific COGS calculation (Gross Margin = Net Sales - Batch Purchase Cost). Displays Gross Profit, Operating Expenses, Net Profit, and margin percentage per medicine category.',
        bangladeshContext: 'Retail medicine margins in Bangladesh typically range from 11% to 16% depending on trade terms.'
      },
      {
        id: 'FR-FIN-03',
        name: 'Expired & Damaged Stock Loss Report',
        priority: 'P1 - High',
        spec: 'Itemized write-off journal recording value of expired or damaged batches, categorized into "Eligible for Supplier Return Credit" vs "Total Write-Off Loss".',
        bangladeshContext: 'Vital for calculating accurate net taxable profits and tracking supplier credit claims.'
      },
      {
        id: 'FR-FIN-04',
        name: 'NBR Mushak 6.3 VAT Tax Report',
        priority: 'P1 - High',
        spec: 'VAT report generating monthly retail output VAT (standard 2.4% truncated retail rate or exempt essential drug categories) in accordance with Bangladesh National Board of Revenue (NBR) formats.',
        bangladeshContext: 'Ensures hassle-free submission of monthly VAT returns to the local NBR Circle Office.'
      }
    ]
  },
  {
    id: 'srs-rbac',
    title: '6. Role-Based Access Control (RBAC) & Security',
    category: 'Security & Governance',
    description: 'Granular multi-role security ensuring segregation of duties across Admin, Salesperson, and Accountant.',
    requirements: [
      {
        id: 'FR-SEC-01',
        name: 'Three-Tier Role Separation (Admin, Salesperson, Accountant)',
        priority: 'P0 - Critical',
        spec: 'Strict permission matrix: Salesperson (Cashier/Pharmacist) has POS checkout, customer search, and stock query rights; cannot view purchase cost prices, net profit margins, or delete invoices. Accountant has full access to Supplier Ledgers, Financial Reports, and Expense logging. Admin has unrestricted system control.',
        bangladeshContext: 'Pharmacy owners in Bangladesh usually operate multiple counters or employ non-family sales staff and must safeguard trade cost secrets and avoid inventory manipulation.'
      },
      {
        id: 'FR-SEC-02',
        name: 'Immutable Financial & Compliance Audit Trail',
        priority: 'P0 - Critical',
        spec: 'Cryptographically hashed or append-only audit trail logging every bill cancellation, price override attempt, Schedule G dispensing, and batch stock adjustment with User ID, Timestamp, and IP/Station.',
        bangladeshContext: 'Prevents internal shrinkage, unauthorized stock deletion, and provides proof during DGDA or NBR investigations.'
      }
    ]
  }
];

export const DATABASE_ENTITIES = [
  {
    name: 'dgda_generics',
    description: 'Master directory of DGDA registered generic active pharmaceutical ingredients (APIs).',
    columns: [
      { name: 'id', type: 'UUID PRIMARY KEY', description: 'Unique identifier' },
      { name: 'generic_name', type: 'VARCHAR(255) UNIQUE', description: 'INN Generic name (e.g. Paracetamol, Esomeprazole)' },
      { name: 'therapeutic_class', type: 'VARCHAR(150)', description: 'e.g. Analgesic, PPI, Antibiotic' },
      { name: 'is_controlled_schedule_g', type: 'BOOLEAN DEFAULT FALSE', description: 'DGDA Schedule G Narcotic flag' },
      { name: 'is_banned', type: 'BOOLEAN DEFAULT FALSE', description: 'DGDA Prohibition/Revocation flag' },
      { name: 'gazette_ref', type: 'VARCHAR(100)', description: 'DGDA Gazette Reference Number' },
      { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', description: 'Record creation timestamp' }
    ]
  },
  {
    name: 'medicines',
    description: 'Commercial brand medicines manufactured by licensed pharmaceutical companies.',
    columns: [
      { name: 'id', type: 'UUID PRIMARY KEY', description: 'Unique identifier' },
      { name: 'generic_id', type: 'UUID REFERENCES dgda_generics(id)', description: 'Foreign key to generic master' },
      { name: 'brand_name', type: 'VARCHAR(200) NOT NULL', description: 'Trade brand name (e.g. Napa, Ace, Sergel)' },
      { name: 'strength', type: 'VARCHAR(80) NOT NULL', description: 'e.g. 500mg, 20mg, 100 IU/ml' },
      { name: 'dosage_form', type: 'VARCHAR(50) NOT NULL', description: 'Tablet, Capsule, Syrup, Injection, etc.' },
      { name: 'manufacturer', type: 'VARCHAR(200) NOT NULL', description: 'Square, Beximco, Incepta, Renata, etc.' },
      { name: 'barcode', type: 'VARCHAR(50) UNIQUE', description: 'EAN-13 or Code 128 barcode' },
      { name: 'dar_number', type: 'VARCHAR(100) UNIQUE', description: 'DGDA Drug Administration Registration #' },
      { name: 'dgda_max_mrp_pcs', type: 'NUMERIC(10,2) NOT NULL', description: 'DGDA Gazetted Price Ceiling in BDT' },
      { name: 'requires_cold_chain', type: 'BOOLEAN DEFAULT FALSE', description: 'Refrigerated 2-8°C flag (Insulin, Vaccines)' },
      { name: 'reorder_level_pcs', type: 'INTEGER DEFAULT 100', description: 'Safety stock alert threshold' }
    ]
  },
  {
    name: 'medicine_unit_configs',
    description: 'Unit hierarchy configuration for Strip/Box/Pieces conversion.',
    columns: [
      { name: 'medicine_id', type: 'UUID PRIMARY KEY REFERENCES medicines(id)', description: 'Foreign key to medicine' },
      { name: 'pcs_per_strip', type: 'INTEGER NOT NULL DEFAULT 10', description: 'Number of pieces per strip' },
      { name: 'strips_per_box', type: 'INTEGER NOT NULL DEFAULT 10', description: 'Number of strips per box' },
      { name: 'total_pcs_per_box', type: 'INTEGER NOT NULL GENERATED ALWAYS AS (pcs_per_strip * strips_per_box) STORED', description: 'Total pieces in box' },
      { name: 'cost_price_pcs', type: 'NUMERIC(10,4) NOT NULL', description: 'Base trade purchase cost per piece' },
      { name: 'mrp_pcs', type: 'NUMERIC(10,2) NOT NULL', description: 'MRP per individual piece' },
      { name: 'mrp_strip', type: 'NUMERIC(10,2) NOT NULL', description: 'Calculated or packaged strip price' },
      { name: 'mrp_box', type: 'NUMERIC(10,2) NOT NULL', description: 'Total box retail price' }
    ]
  },
  {
    name: 'batches',
    description: 'Granular physical batches with expiry dates, rack locations, and available stock.',
    columns: [
      { name: 'id', type: 'UUID PRIMARY KEY', description: 'Unique batch ID' },
      { name: 'medicine_id', type: 'UUID REFERENCES medicines(id) ON DELETE CASCADE', description: 'Medicine foreign key' },
      { name: 'batch_number', type: 'VARCHAR(100) NOT NULL', description: 'Manufacturer batch code' },
      { name: 'manufacturing_date', type: 'DATE NOT NULL', description: 'Production date' },
      { name: 'expiry_date', type: 'DATE NOT NULL', description: 'Expiration date (FEFO sort key)' },
      { name: 'stock_pcs', type: 'INTEGER NOT NULL DEFAULT 0 CHECK (stock_pcs >= 0)', description: 'Current available balance in Pieces' },
      { name: 'cost_price_pcs', type: 'NUMERIC(10,4) NOT NULL', description: 'Specific purchase cost for this batch' },
      { name: 'rack_location', type: 'VARCHAR(100) NOT NULL', description: 'Physical location e.g. Rack A-01 / Shelf 2' },
      { name: 'is_quarantined', type: 'BOOLEAN DEFAULT FALSE', description: 'Quarantine state if expired or recalled' }
    ]
  },
  {
    name: 'sales_invoices',
    description: 'Header record for POS counter transactions with NBR Mushak 6.3 compliance.',
    columns: [
      { name: 'id', type: 'UUID PRIMARY KEY', description: 'Invoice ID' },
      { name: 'invoice_number', type: 'VARCHAR(50) UNIQUE NOT NULL', description: 'Sequential bill number' },
      { name: 'mushak_number', type: 'VARCHAR(60) NOT NULL', description: 'NBR Mushak 6.3 formatted tax string' },
      { name: 'invoice_timestamp', type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()', description: 'Transaction date and time' },
      { name: 'customer_name', type: 'VARCHAR(150)', description: 'Customer or Patient name' },
      { name: 'customer_phone', type: 'VARCHAR(30)', description: 'Customer mobile number' },
      { name: 'doctor_bmdc', type: 'VARCHAR(50)', description: 'Prescribing Doctor BMDC registration #' },
      { name: 'patient_nid', type: 'VARCHAR(50)', description: 'National ID for Schedule G drugs' },
      { name: 'subtotal_bdt', type: 'NUMERIC(12,2) NOT NULL', description: 'Subtotal before discount' },
      { name: 'discount_amount_bdt', type: 'NUMERIC(12,2) DEFAULT 0', description: 'Total discount granted' },
      { name: 'vat_amount_bdt', type: 'NUMERIC(12,2) DEFAULT 0', description: 'VAT (Mushak) collected' },
      { name: 'net_total_bdt', type: 'NUMERIC(12,2) NOT NULL', description: 'Final payable amount' },
      { name: 'paid_amount_bdt', type: 'NUMERIC(12,2) NOT NULL', description: 'Amount collected at POS' },
      { name: 'due_amount_bdt', type: 'NUMERIC(12,2) DEFAULT 0', description: 'Remaining balance added to customer ledger' },
      { name: 'payment_method', type: 'VARCHAR(30) NOT NULL', description: 'cash, bkash, nagad, card, due' },
      { name: 'served_by_user_id', type: 'UUID REFERENCES users(id)', description: 'Pharmacist/Cashier who processed the bill' }
    ]
  },
  {
    name: 'sales_invoice_items',
    description: 'Line item records with batch and unit breakdown.',
    columns: [
      { name: 'id', type: 'UUID PRIMARY KEY', description: 'Line item ID' },
      { name: 'invoice_id', type: 'UUID REFERENCES sales_invoices(id) ON DELETE CASCADE', description: 'Invoice reference' },
      { name: 'medicine_id', type: 'UUID REFERENCES medicines(id)', description: 'Medicine reference' },
      { name: 'batch_id', type: 'UUID REFERENCES batches(id)', description: 'Batch reference' },
      { name: 'dispensed_unit', type: 'VARCHAR(20) NOT NULL', description: 'pcs, strip, box' },
      { name: 'unit_quantity', type: 'NUMERIC(10,2) NOT NULL', description: 'Quantity in dispensed unit' },
      { name: 'multiplier_to_pcs', type: 'INTEGER NOT NULL', description: 'Unit multiplier' },
      { name: 'total_pcs_deducted', type: 'INTEGER NOT NULL', description: 'Exact inventory deduction in Pieces' },
      { name: 'unit_price_bdt', type: 'NUMERIC(10,2) NOT NULL', description: 'Price per dispensed unit' },
      { name: 'cost_price_pcs_bdt', type: 'NUMERIC(10,4) NOT NULL', description: 'Historical cost price for COGS calculation' },
      { name: 'line_total_bdt', type: 'NUMERIC(12,2) NOT NULL', description: 'Total charge for this line' }
    ]
  }
];

export const POSTGRESQL_DDL_SCRIPT = `-- ======================================================================
-- PHARMABANGLA: DGDA COMPLIANT PHARMACY POS & ERP SCHEMA (POSTGRESQL 16)
-- Target Jurisdiction: Bangladesh (DGDA Drug Act, NBR Mushak 6.3 VAT)
-- ======================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For ultra-fast fuzzy generic/trade search

-- 1. Directorate General of Drug Administration (DGDA) Generics Directory
CREATE TABLE dgda_generics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    generic_name VARCHAR(255) NOT NULL UNIQUE,
    therapeutic_class VARCHAR(150),
    is_controlled_schedule_g BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    gazette_ref VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for instant generic autocomplete
CREATE INDEX idx_generics_trgm ON dgda_generics USING GIN (generic_name gin_trgm_ops);

-- 2. Commercial Medicines (Trade Brands)
CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    generic_id UUID NOT NULL REFERENCES dgda_generics(id) ON UPDATE CASCADE,
    brand_name VARCHAR(200) NOT NULL,
    strength VARCHAR(80) NOT NULL,
    dosage_form VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(200) NOT NULL,
    barcode VARCHAR(50) UNIQUE,
    dar_number VARCHAR(100) UNIQUE NOT NULL, -- DGDA Registration #
    dgda_max_mrp_pcs NUMERIC(10,2) NOT NULL CHECK (dgda_max_mrp_pcs >= 0),
    requires_cold_chain BOOLEAN DEFAULT FALSE,
    reorder_level_pcs INT DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_medicines_brand_trgm ON medicines USING GIN (brand_name gin_trgm_ops);
CREATE INDEX idx_medicines_barcode ON medicines(barcode);

-- 3. Unit Conversion Multipliers (Box / Strip / Pcs)
CREATE TABLE medicine_unit_configs (
    medicine_id UUID PRIMARY KEY REFERENCES medicines(id) ON DELETE CASCADE,
    pcs_per_strip INT NOT NULL DEFAULT 10 CHECK (pcs_per_strip > 0),
    strips_per_box INT NOT NULL DEFAULT 10 CHECK (strips_per_box > 0),
    total_pcs_per_box INT GENERATED ALWAYS AS (pcs_per_strip * strips_per_box) STORED,
    cost_price_pcs NUMERIC(10,4) NOT NULL CHECK (cost_price_pcs >= 0),
    mrp_pcs NUMERIC(10,2) NOT NULL CHECK (mrp_pcs >= 0),
    mrp_strip NUMERIC(10,2) NOT NULL CHECK (mrp_strip >= 0),
    mrp_box NUMERIC(10,2) NOT NULL CHECK (mrp_box >= 0)
);

-- 4. Batches & FEFO Inventory Engine
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    batch_number VARCHAR(100) NOT NULL,
    manufacturing_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    stock_pcs INT NOT NULL DEFAULT 0 CHECK (stock_pcs >= 0),
    cost_price_pcs NUMERIC(10,4) NOT NULL,
    rack_location VARCHAR(100) NOT NULL,
    is_quarantined BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_med_batch UNIQUE (medicine_id, batch_number)
);

CREATE INDEX idx_batches_fefo ON batches(medicine_id, expiry_date ASC) WHERE stock_pcs > 0 AND is_quarantined = FALSE;

-- 5. Sales Invoices (NBR Mushak 6.3 Compliant)
CREATE TABLE sales_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    mushak_number VARCHAR(60) NOT NULL,
    invoice_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    customer_name VARCHAR(150),
    customer_phone VARCHAR(30),
    doctor_bmdc VARCHAR(50),
    patient_nid VARCHAR(50),
    subtotal_bdt NUMERIC(12,2) NOT NULL,
    discount_amount_bdt NUMERIC(12,2) DEFAULT 0,
    vat_amount_bdt NUMERIC(12,2) DEFAULT 0,
    net_total_bdt NUMERIC(12,2) NOT NULL,
    paid_amount_bdt NUMERIC(12,2) NOT NULL,
    due_amount_bdt NUMERIC(12,2) DEFAULT 0,
    payment_method VARCHAR(30) NOT NULL, -- cash, bkash, nagad, card, due
    served_by_user_id UUID,
    CONSTRAINT chk_mrp_integrity CHECK (net_total_bdt >= 0)
);

-- 6. Sales Line Items
CREATE TABLE sales_invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES sales_invoices(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES medicines(id),
    batch_id UUID NOT NULL REFERENCES batches(id),
    dispensed_unit VARCHAR(20) NOT NULL, -- 'pcs', 'strip', 'box'
    unit_quantity NUMERIC(10,2) NOT NULL CHECK (unit_quantity > 0),
    multiplier_to_pcs INT NOT NULL,
    total_pcs_deducted INT NOT NULL CHECK (total_pcs_deducted > 0),
    unit_price_bdt NUMERIC(10,2) NOT NULL,
    cost_price_pcs_bdt NUMERIC(10,4) NOT NULL,
    line_total_bdt NUMERIC(12,2) NOT NULL
);

-- 7. DGDA Regulatory Enforcement Trigger (MRP Cap Guard)
CREATE OR REPLACE FUNCTION verify_dgda_mrp_cap()
RETURNS TRIGGER AS $$
DECLARE
    v_max_mrp NUMERIC(10,2);
    v_effective_pcs_price NUMERIC(10,2);
BEGIN
    SELECT dgda_max_mrp_pcs INTO v_max_mrp FROM medicines WHERE id = NEW.medicine_id;
    v_effective_pcs_price := NEW.line_total_bdt / NEW.total_pcs_deducted;
    
    IF v_effective_pcs_price > v_max_mrp THEN
        RAISE EXCEPTION 'DGDA Regulatory Violation: Dispensed unit price exceeds gazetted MRP ceiling of ৳% per piece.', v_max_mrp;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_dgda_mrp
BEFORE INSERT ON sales_invoice_items
FOR EACH ROW EXECUTE FUNCTION verify_dgda_mrp_cap();
`;

export const TECH_STACK_SPECIFICATION = {
  frontend: {
    name: 'Frontend POS Client',
    technologies: [
      { name: 'React 19 + TypeScript', role: 'Component lifecycle, high-speed rendering, strict type-safety across pharmaceutical models.' },
      { name: 'Vite 8 Bundler', role: 'Sub-second HMR and optimized production compilation.' },
      { name: 'Tailwind CSS 4', role: 'High-density, low-latency clinical styling with zero-pill visual discipline.' },
      { name: 'WebUSB & Web Serial APIs', role: 'Direct hardware communication to 80mm ESC/POS thermal printers & cash drawers without third-party print spoolers.' },
      { name: 'Web Workers (Scanner Buffer)', role: 'Background buffer processing raw HID barcode scanner inputs (30-50ms keystroke bursts) without UI thread freeze.' }
    ]
  },
  backend: {
    name: 'Backend API & Sync Engine',
    technologies: [
      { name: 'Node.js / NestJS or Go Fiber', role: 'Stateless microservices processing counter sales, inventory allocation, and supplier ledgering.' },
      { name: 'Redis Cache (In-Memory)', role: 'Under 10ms caching of 25,000+ DGDA medicines & real-time stock levels for counter instant search.' },
      { name: 'BullMQ / RabbitMQ', role: 'Asynchronous event bus for SMS customer credit reminders, daily NBR VAT ledger rolls, and DGDA audit logs.' },
      { name: 'bKash & Nagad Payment Webhooks', role: 'Direct MFS QR code generation and instant payment reconciliation at checkout counter.' }
    ]
  },
  database: {
    name: 'Database & Storage',
    technologies: [
      { name: 'PostgreSQL 16 Relational DB', role: 'ACID transactional integrity for financial ledgers, inventory deductions, and NBR tax records.' },
      { name: 'pg_trgm Extension', role: 'Trigram indexing delivering fuzzy matching for generic and brand searches (handles common Bengali-English transliteration typos).' },
      { name: 'TimescaleDB / Partitioned Tables', role: 'Time-series partitioning for millions of historical counter receipts and compliance audit trails.' }
    ]
  },
  offlineEdge: {
    name: 'Zero-Downtime Offline Edge Architecture',
    technologies: [
      { name: 'PWA Service Worker + IndexedDB', role: 'Guarantees uninterrupted checkout during Bangladesh power load-shedding and fiber internet outages. Caches local catalogue and queues offline bills.' },
      { name: 'CRDT / Conflict-Free Sync Engine', role: 'Background reconciliation syncing queued offline sales once broadband or 4G modem connection restores.' }
    ]
  }
};

export const CASHIER_WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Customer Prescription Triage & Search',
    description: 'Pharmacist greets customer. Types brand name (e.g. Napa) or INN generic molecule (e.g. Paracetamol) using F2 shortcut or scans manufacturer barcode with hand-held scanner.',
    actor: 'Cashier / Registered Pharmacist',
    systemAction: 'Filters DGDA database with sub-50ms response, showing strengths, forms, brand alternatives, and real-time shelf stock.'
  },
  {
    step: 2,
    title: 'Batch Selection & Automated FEFO Routing',
    description: 'System automatically highlights the nearest expiring batch (First Expire, First Out) and displays its physical location (e.g., "Rack A-01 / Shelf 2").',
    actor: 'System Automation',
    systemAction: 'Applies FEFO priority while flagging near-expiry amber warning if within 90 days. Blocks expired or recalled lots.'
  },
  {
    step: 3,
    title: 'Unit Conversion (Box / Strip / Pcs)',
    description: 'Pharmacist selects required quantity in customer unit: Pcs (loose), Strip, or Full Box. System computes exact multiplier and real-time deduction.',
    actor: 'Cashier',
    systemAction: 'Calculates price = unit_price * quantity. Enforces DGDA capped maximum price.'
  },
  {
    step: 4,
    title: 'DGDA Regulatory Guard & Controlled Drug Check',
    description: 'If medicine is Schedule G (Narcotic/Psychotropic like Sedil), system pops mandatory modal requiring Doctor BMDC # and Patient NID/Phone.',
    actor: 'Regulatory Compliance Layer',
    systemAction: 'Logs entry into DGDA Schedule G Narcotics Register. If drug is revoked/banned, checkout is locked.'
  },
  {
    step: 5,
    title: 'Discount & Payment Method Allocation',
    description: 'Cashier applies 5%-8% standard patient discount if applicable. Customer selects payment: Cash, bKash, Nagad, Card, or Due (Credit).',
    actor: 'Cashier & Customer',
    systemAction: 'Calculates NBR Mushak VAT, Net Total, Change Return, or records outstanding balance in Customer Due Ledger.'
  },
  {
    step: 6,
    title: 'Instant 80mm ESC/POS Thermal Receipt & Cash Kick',
    description: 'Press F8 or click Complete Sale. 80mm thermal receipt prints instantly with Mushak-6.3 headers, batch expiry dates, and cash drawer RJ11 kicks open.',
    actor: 'Hardware Automation',
    systemAction: 'Deducts physical batch stock in DB, writes audit ledger, updates daily sales totals.'
  }
];

export const ROADMAP_PHASES = [
  {
    phase: 'Phase 1: Single-Store Core POS & DGDA Engine',
    timeline: 'Months 1 - 3',
    focus: 'Fast counter sales, inventory batch tracking, DGDA price caps, 80mm thermal receipt, and offline local cache.',
    deliverables: [
      'Core POS with F2/F8 keyboard navigation & barcode scanning',
      'Batch management with FEFO auto-selection and 30/60/90 day alerts',
      'Strip/Box/Pcs hierarchical unit conversion engine',
      'DGDA gazette MRP price capping and Schedule G narcotic prompt',
      'Supplier purchase orders, receiving (GRN), and payable ledger',
      'NBR Mushak-6.3 VAT receipt formatting'
    ]
  },
  {
    phase: 'Phase 2: Multi-Branch Chain ERP & Central Warehouse',
    timeline: 'Months 4 - 6',
    focus: 'Centralized stock distribution, inter-branch transfers (IBT), unified supplier credit terms, and consolidated financial auditing.',
    deliverables: [
      'Multi-outlet inventory visibility and central warehouse dispatch',
      'Inter-branch stock requisitions and transit tracking',
      'Consolidated supplier negotiations and bulk volume rebates',
      'Centralized customer credit ledger across all pharmacy branches',
      'Automated nightly cloud backup and role-based branch manager permissions'
    ]
  },
  {
    phase: 'Phase 3: e-Prescription & Digital Health Ecosystem',
    timeline: 'Months 7 - 9',
    focus: 'Direct integration with hospital EMRs, doctor digital prescriptions, and instant MFS (bKash/Nagad) merchant API integration.',
    deliverables: [
      'Doctor e-prescription QR code scanning (auto-loads cart in 1 scan)',
      'Direct BMDC doctor database verification API',
      'Dynamic bKash/Nagad customer-facing dynamic QR terminal',
      'Automated SMS invoice & dosage reminder dispatch to patient mobile',
      'Drug-Drug Interaction (DDI) clinical alert warning engine'
    ]
  },
  {
    phase: 'Phase 4: AI Demand Forecasting & Smart DGDA Auto-Sync',
    timeline: 'Months 10 - 12',
    focus: 'Machine learning seasonal disease prediction (e.g. Dengue, Seasonal Flu) and automated DGDA price gazette sync.',
    deliverables: [
      'Seasonal epidemic demand forecasting (Paracetamol, IV Saline, Antihistamines)',
      'Automated stock reorder suggestions based on daily lead times and sales velocity',
      'Automated web scraping/API sync with DGDA gazette price updates',
      'Near-expiry automated markdown and supplier return batch generation'
    ]
  }
];
