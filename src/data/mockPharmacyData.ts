import { Medicine, Supplier, SalesInvoice, CustomerDueRecord, DgdaRegulationNotice } from '../types/pharmacy';

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-01',
    brandName: 'Napa',
    strength: '500mg',
    dosageForm: 'Tablet',
    genericName: 'Paracetamol',
    manufacturer: 'Beximco Pharmaceuticals Ltd.',
    barcode: '8941100201014',
    darNumber: 'DAR-024-0012-04',
    dgdaMaxMrpPcs: 1.20,
    isScheduleG: false,
    isBanned: false,
    requiresRefrigeration: false,
    reorderLevelPcs: 200,
    unitConfig: {
      pcsPerStrip: 10,
      stripsPerBox: 10,
      totalPcsPerBox: 100,
      costPricePcs: 0.88,
      mrpPcs: 1.20,
      mrpStrip: 12.00,
      mrpBox: 120.00
    },
    batches: [
      {
        id: 'b-napa-01',
        batchNumber: 'BX-NP2401',
        manufacturingDate: '2024-03-10',
        expiryDate: '2027-04-30',
        stockPcs: 450,
        costPricePcs: 0.88,
        rackLocation: 'Rack A-01 / Shelf 1'
      },
      {
        id: 'b-napa-02',
        batchNumber: 'BX-NP2309',
        manufacturingDate: '2023-09-01',
        expiryDate: '2026-10-15', // Near expiry (<30 days from current mock date)
        stockPcs: 60,
        costPricePcs: 0.85,
        rackLocation: 'Rack A-01 / Shelf 2'
      }
    ]
  },
  {
    id: 'med-02',
    brandName: 'Ace',
    strength: '500mg',
    dosageForm: 'Tablet',
    genericName: 'Paracetamol',
    manufacturer: 'Square Pharmaceuticals PLC',
    barcode: '8941100301021',
    darNumber: 'DAR-001-0045-02',
    dgdaMaxMrpPcs: 1.20,
    isScheduleG: false,
    isBanned: false,
    requiresRefrigeration: false,
    reorderLevelPcs: 300,
    unitConfig: {
      pcsPerStrip: 10,
      stripsPerBox: 10,
      totalPcsPerBox: 100,
      costPricePcs: 0.86,
      mrpPcs: 1.20,
      mrpStrip: 12.00,
      mrpBox: 120.00
    },
    batches: [
      {
        id: 'b-ace-01',
        batchNumber: 'SQ-AC2410',
        manufacturingDate: '2024-05-12',
        expiryDate: '2027-08-31',
        stockPcs: 620,
        costPricePcs: 0.86,
        rackLocation: 'Rack A-01 / Shelf 3'
      }
    ]
  },
  {
    id: 'med-03',
    brandName: 'Napa Extra',
    strength: '500mg + 65mg',
    dosageForm: 'Tablet',
    genericName: 'Paracetamol + Caffeine',
    manufacturer: 'Beximco Pharmaceuticals Ltd.',
    barcode: '8941100201083',
    darNumber: 'DAR-024-0018-05',
    dgdaMaxMrpPcs: 2.50,
    isScheduleG: false,
    isBanned: false,
    requiresRefrigeration: false,
    reorderLevelPcs: 150,
    unitConfig: {
      pcsPerStrip: 10,
      stripsPerBox: 10,
      totalPcsPerBox: 100,
      costPricePcs: 1.85,
      mrpPcs: 2.50,
      mrpStrip: 25.00,
      mrpBox: 250.00
    },
    batches: [
      {
        id: 'b-nx-01',
        batchNumber: 'BX-NX2404',
        manufacturingDate: '2024-02-15',
        expiryDate: '2027-02-28',
        stockPcs: 320,
        costPricePcs: 1.85,
        rackLocation: 'Rack A-02 / Shelf 1'
      }
    ]
  },
  {
    id: 'med-04',
    brandName: 'Sergel',
    strength: '20mg',
    dosageForm: 'Capsule',
    genericName: 'Esomeprazole',
    manufacturer: 'Incepta Pharmaceuticals Ltd.',
    barcode: '8941100502012',
    darNumber: 'DAR-012-0089-01',
    dgdaMaxMrpPcs: 7.00,
    isScheduleG: false,
    isBanned: false,
    requiresRefrigeration: false,
    reorderLevelPcs: 100,
    unitConfig: {
      pcsPerStrip: 14,
      stripsPerBox: 4,
      totalPcsPerBox: 56,
      costPricePcs: 5.20,
      mrpPcs: 7.00,
      mrpStrip: 98.00,
      mrpBox: 392.00
    },
    batches: [
      {
        id: 'b-ser-01',
        batchNumber: 'IN-SR2402',
        manufacturingDate: '2024-04-01',
        expiryDate: '2026-12-31',
        stockPcs: 224,
        costPricePcs: 5.20,
        rackLocation: 'Rack B-03 / Shelf 1'
      }
    ]
  },
  {
    id: 'med-05',
    brandName: 'Seclo',
    strength: '20mg',
    dosageForm: 'Capsule',
    genericName: 'Omeprazole',
    manufacturer: 'Square Pharmaceuticals PLC',
    barcode: '8941100302059',
    darNumber: 'DAR-001-0012-06',
    dgdaMaxMrpPcs: 5.00,
    isScheduleG: false,
    isBanned: false,
    requiresRefrigeration: false,
    reorderLevelPcs: 120,
    unitConfig: {
      pcsPerStrip: 10,
      stripsPerBox: 10,
      totalPcsPerBox: 100,
      costPricePcs: 3.75,
      mrpPcs: 5.00,
      mrpStrip: 50.00,
      mrpBox: 500.00
    },
    batches: [
      {
        id: 'b-sec-01',
        batchNumber: 'SQ-SC2411',
        manufacturingDate: '2024-03-20',
        expiryDate: '2027-05-31',
        stockPcs: 410,
        costPricePcs: 3.75,
        rackLocation: 'Rack B-03 / Shelf 2'
      }
    ]
  },
  {
    id: 'med-06',
    brandName: 'Monas',
    strength: '10mg',
    dosageForm: 'Tablet',
    genericName: 'Montelukast',
    manufacturer: 'Incepta Pharmaceuticals Ltd.',
    barcode: '8941100508090',
    darNumber: 'DAR-012-0312-02',
    dgdaMaxMrpPcs: 16.00,
    isScheduleG: false,
    isBanned: false,
    requiresRefrigeration: false,
    reorderLevelPcs: 60,
    unitConfig: {
      pcsPerStrip: 10,
      stripsPerBox: 3,
      totalPcsPerBox: 30,
      costPricePcs: 12.30,
      mrpPcs: 16.00,
      mrpStrip: 160.00,
      mrpBox: 480.00
    },
    batches: [
      {
        id: 'b-mon-01',
        batchNumber: 'IN-MN2408',
        manufacturingDate: '2024-06-15',
        expiryDate: '2027-09-30',
        stockPcs: 150,
        costPricePcs: 12.30,
        rackLocation: 'Rack C-01 / Shelf 2'
      }
    ]
  },
  {
    id: 'med-07',
    brandName: 'Zimax',
    strength: '500mg',
    dosageForm: 'Tablet',
    genericName: 'Azithromycin',
    manufacturer: 'Square Pharmaceuticals PLC',
    barcode: '8941100309010',
    darNumber: 'DAR-001-0419-01',
    dgdaMaxMrpPcs: 35.00,
    isScheduleG: false,
    isBanned: false,
    requiresRefrigeration: false,
    reorderLevelPcs: 30,
    unitConfig: {
      pcsPerStrip: 3,
      stripsPerBox: 5,
      totalPcsPerBox: 15,
      costPricePcs: 27.50,
      mrpPcs: 35.00,
      mrpStrip: 105.00,
      mrpBox: 525.00
    },
    batches: [
      {
        id: 'b-zim-01',
        batchNumber: 'SQ-ZM2405',
        manufacturingDate: '2024-04-10',
        expiryDate: '2027-03-31',
        stockPcs: 45,
        costPricePcs: 27.50,
        rackLocation: 'Rack C-02 / Shelf 1'
      }
    ]
  },
  {
    id: 'med-08',
    brandName: 'Sedil (Diazepam)',
    strength: '5mg',
    dosageForm: 'Tablet',
    genericName: 'Diazepam',
    manufacturer: 'Square Pharmaceuticals PLC',
    barcode: '8941100305555',
    darNumber: 'DAR-001-0008-01',
    dgdaMaxMrpPcs: 2.20,
    isScheduleG: true, // Controlled Narcotic
    isBanned: false,
    requiresRefrigeration: false,
    reorderLevelPcs: 50,
    unitConfig: {
      pcsPerStrip: 10,
      stripsPerBox: 10,
      totalPcsPerBox: 100,
      costPricePcs: 1.50,
      mrpPcs: 2.20,
      mrpStrip: 22.00,
      mrpBox: 220.00
    },
    batches: [
      {
        id: 'b-sed-01',
        batchNumber: 'SQ-SD2312',
        manufacturingDate: '2023-12-01',
        expiryDate: '2027-01-31',
        stockPcs: 180,
        costPricePcs: 1.50,
        rackLocation: 'Locker D-Narcotic (Locked)'
      }
    ]
  },
  {
    id: 'med-09',
    brandName: 'Insulatard Penfill',
    strength: '100 IU/ml (3ml)',
    dosageForm: 'Injection',
    genericName: 'Human Insulin (NPH)',
    manufacturer: 'Novo Nordisk / Transcom Distribution',
    barcode: '8941100901238',
    darNumber: 'DAR-999-0012-09',
    dgdaMaxMrpPcs: 480.00,
    isScheduleG: false,
    isBanned: false,
    requiresRefrigeration: true, // 2°C - 8°C Cold Storage
    reorderLevelPcs: 10,
    unitConfig: {
      pcsPerStrip: 1,
      stripsPerBox: 5,
      totalPcsPerBox: 5,
      costPricePcs: 410.00,
      mrpPcs: 480.00,
      mrpStrip: 480.00,
      mrpBox: 2400.00
    },
    batches: [
      {
        id: 'b-ins-01',
        batchNumber: 'NV-IN2401',
        manufacturingDate: '2024-01-20',
        expiryDate: '2026-11-30',
        stockPcs: 18,
        costPricePcs: 410.00,
        rackLocation: 'Fridge R-01 (2°C - 8°C)'
      }
    ]
  },
  {
    id: 'med-10',
    brandName: 'Dextropropoxyphene Compound (Recalled)',
    strength: '65mg',
    dosageForm: 'Capsule',
    genericName: 'Dextropropoxyphene + Paracetamol',
    manufacturer: 'Global Labs Ltd.',
    barcode: '8949999999999',
    darNumber: 'DAR-BANNED-001',
    dgdaMaxMrpPcs: 5.00,
    isScheduleG: true,
    isBanned: true, // DGDA Banned
    banReason: 'DGDA Notification 2022/41B: Cardiotoxicity and fatal arrhythmia hazard. Registration revoked.',
    requiresRefrigeration: false,
    reorderLevelPcs: 0,
    unitConfig: {
      pcsPerStrip: 10,
      stripsPerBox: 5,
      totalPcsPerBox: 50,
      costPricePcs: 3.00,
      mrpPcs: 5.00,
      mrpStrip: 50.00,
      mrpBox: 250.00
    },
    batches: [
      {
        id: 'b-ban-01',
        batchNumber: 'GL-BAN2022',
        manufacturingDate: '2022-01-01',
        expiryDate: '2024-01-01', // Expired & Banned
        stockPcs: 30,
        costPricePcs: 3.00,
        rackLocation: 'Quarantine Box Q-9',
        isQuarantined: true
      }
    ]
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-01',
    name: 'Square Pharmaceuticals PLC',
    contactPerson: 'Kazi Mofizul Islam (Territory Officer)',
    phone: '+880 1711-234567',
    email: 'distribution.dhk@squaregroup.com',
    address: 'Square Centre, 48 Mohakhali C/A, Dhaka-1212',
    dgdaDistributorLicense: 'DGDA/DIST/DHK-0014',
    currentBalanceDue: 18500.00
  },
  {
    id: 'sup-02',
    name: 'Beximco Pharmaceuticals Ltd.',
    contactPerson: 'Sabbir Ahmed (Sales Executive)',
    phone: '+880 1819-876543',
    email: 'dhaka.depot@bpl.net',
    address: '19 Dhanmondi R/A, Road #7, Dhaka-1205',
    dgdaDistributorLicense: 'DGDA/DIST/DHK-0029',
    currentBalanceDue: 12400.00
  },
  {
    id: 'sup-03',
    name: 'Incepta Pharmaceuticals Ltd.',
    contactPerson: 'Tanvir Hossain',
    phone: '+880 1912-345678',
    email: 'depot.tejgaon@inceptapharma.com',
    address: '40 Shahid Tajuddin Ahmed Sarani, Tejgaon I/A, Dhaka-1208',
    dgdaDistributorLicense: 'DGDA/DIST/DHK-0052',
    currentBalanceDue: 8200.00
  },
  {
    id: 'sup-04',
    name: 'Renata Limited',
    contactPerson: 'Enamul Haque',
    phone: '+880 1611-998877',
    email: 'sales.dhaka@renata-ltd.com',
    address: 'Plot #1, Milk Vita Road, Section-7, Mirpur, Dhaka-1216',
    dgdaDistributorLicense: 'DGDA/DIST/DHK-0038',
    currentBalanceDue: 4500.00
  }
];

export const INITIAL_CUSTOMER_DUES: CustomerDueRecord[] = [
  {
    id: 'due-01',
    customerName: 'Haji Mohammad Rafiqul Islam',
    customerPhone: '01712-445566',
    patientNid: '19842691234567890',
    doctorBmdc: 'A-49281',
    invoiceId: 'INV-202609-001',
    invoiceDate: '2026-09-21',
    totalBill: 1450.00,
    paidAmount: 1000.00,
    dueAmount: 450.00,
    status: 'partially_paid',
    lastPaymentDate: '2026-09-21'
  },
  {
    id: 'due-02',
    customerName: 'Karim Mollah',
    customerPhone: '01918-776655',
    invoiceId: 'INV-202609-002',
    invoiceDate: '2026-09-22',
    totalBill: 620.00,
    paidAmount: 200.00,
    dueAmount: 420.00,
    status: 'partially_paid',
    lastPaymentDate: '2026-09-22'
  }
];

export const INITIAL_INVOICES: SalesInvoice[] = [
  {
    id: 'inv-01',
    invoiceNumber: 'INV-202609-001',
    mushakNumber: 'MUSHAK-6.3/2026/0891',
    date: '2026-09-21',
    time: '14:25',
    customerName: 'Haji Mohammad Rafiqul Islam',
    customerPhone: '01712-445566',
    doctorBmdc: 'A-49281',
    items: [
      {
        medicineId: 'med-04',
        brandName: 'Sergel',
        genericName: 'Esomeprazole',
        strength: '20mg',
        dosageForm: 'Capsule',
        batchId: 'b-ser-01',
        batchNumber: 'IN-SR2402',
        expiryDate: '2026-12-31',
        rackLocation: 'Rack B-03 / Shelf 1',
        unit: 'strip',
        quantity: 2,
        multiplierToPcs: 14,
        unitPrice: 98.00,
        mrpPcs: 7.00,
        totalAmount: 196.00,
        costPricePcs: 5.20,
        isScheduleG: false
      },
      {
        medicineId: 'med-06',
        brandName: 'Monas',
        genericName: 'Montelukast',
        strength: '10mg',
        dosageForm: 'Tablet',
        batchId: 'b-mon-01',
        batchNumber: 'IN-MN2408',
        expiryDate: '2027-09-30',
        rackLocation: 'Rack C-01 / Shelf 2',
        unit: 'strip',
        quantity: 3,
        multiplierToPcs: 10,
        unitPrice: 160.00,
        mrpPcs: 16.00,
        totalAmount: 480.00,
        costPricePcs: 12.30,
        isScheduleG: false
      }
    ],
    subtotal: 676.00,
    discountType: 'percentage',
    discountValue: 5,
    discountAmount: 33.80,
    vatRate: 2.4,
    vatAmount: 15.41,
    netTotal: 657.61,
    paidAmount: 657.61,
    dueAmount: 0.00,
    paymentMethod: 'bkash',
    servedBy: 'Tanvir (Reg Pharmacist #C-1294)'
  }
];

export const DGDA_REGULATION_NOTICES: DgdaRegulationNotice[] = [
  {
    genericName: 'Paracetamol',
    gazetteNumber: 'DGDA/Admin/Gazette-117/2022',
    effectiveDate: '2022-07-01',
    fixedMaxMrpPcs: 1.20,
    category: 'Essential Drug',
    warningMessage: 'Mandatory DGDA Maximum Retail Price: 500mg Tablet must not be billed higher than ৳1.20 per piece (৳12.00 per 10-tab strip).'
  },
  {
    genericName: 'Diazepam',
    gazetteNumber: 'DGDA/Narcotics-ScheduleG/Act-2018',
    effectiveDate: '2018-12-15',
    fixedMaxMrpPcs: 2.20,
    category: 'Schedule G Narcotic',
    warningMessage: 'Schedule G Controlled Substance: Dispensing strictly requires BMDC registered Doctor prescription, Patient NID & phone, and manual narcotic register entry.'
  },
  {
    genericName: 'Dextropropoxyphene + Paracetamol',
    gazetteNumber: 'DGDA/Notification/Recall-41B',
    effectiveDate: '2022-03-10',
    fixedMaxMrpPcs: 0,
    category: 'Banned Drug',
    warningMessage: 'PROHIBITED IN BANGLADESH: All stock must be immediately moved to the quarantine area and reported to DGDA local inspector.'
  }
];
