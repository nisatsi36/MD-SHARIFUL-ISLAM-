import React, { useState } from 'react';
import { CASHIER_WORKFLOW_STEPS } from '../../data/srsContent';

export const CashierWorkflowSimulator: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  const currentStepData = CASHIER_WORKFLOW_STEPS.find((s) => s.step === activeStep) || CASHIER_WORKFLOW_STEPS[0];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-semibold">
            ERGONOMIC COUNTER BLUEPRINT
          </span>
          <span className="text-xs text-slate-500 font-mono">F2 / F8 Keyboard-First</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mt-1">
          UI/UX Workflow for the Cashier / Pharmacist
        </h2>
        <p className="text-xs text-slate-500 max-w-3xl mt-0.5 leading-relaxed">
          Designed for high-pressure Bangladeshi counter environments: peak evening footfall (6 PM - 10 PM), frequent generic substitutions, loose tablet dispensing, and rapid thermal receipt generation.
        </p>
      </div>

      {/* Step Sequence Stepper */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {CASHIER_WORKFLOW_STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-3 rounded-lg border text-left transition-all ${
                activeStep === s.step
                  ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600'
                  : activeStep > s.step
                  ? 'border-slate-200 bg-slate-50 text-slate-700'
                  : 'border-slate-100 bg-white text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold">Step {s.step}</span>
                {activeStep > s.step && <span className="text-emerald-600 text-xs">✓</span>}
              </div>
              <div className="font-bold text-slate-900 text-xs mt-1 line-clamp-1">
                {s.title.split('&')[0]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Step Deep-Dive Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
              Stage {currentStepData.step} of {CASHIER_WORKFLOW_STEPS.length}
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {currentStepData.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded text-xs font-semibold text-slate-700 transition-colors"
            >
              ← Previous Step
            </button>
            <button
              onClick={() => setActiveStep((prev) => Math.min(CASHIER_WORKFLOW_STEPS.length, prev + 1))}
              disabled={activeStep === CASHIER_WORKFLOW_STEPS.length}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded text-xs font-bold transition-colors"
            >
              Next Step →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block text-xs">
              Actor & Physical Action:
            </span>
            <div className="text-slate-600 font-medium">Actor: {currentStepData.actor}</div>
            <p className="text-slate-700 leading-relaxed">{currentStepData.description}</p>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-950 block text-xs">
              System Automation & DGDA Safeguards:
            </span>
            <p className="text-emerald-900 leading-relaxed">{currentStepData.systemAction}</p>
          </div>
        </div>

        {/* Visual Mock of POS Screen at this Step */}
        <div className="mt-4 p-4 bg-slate-900 text-white rounded-xl font-mono text-xs space-y-2 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
            <span>POS COUNTER STATION #1 (DHAKA BRANCH)</span>
            <span className="text-emerald-400 font-bold">READY · ACTIVE SHIFT</span>
          </div>

          {activeStep === 1 && (
            <div className="py-2 text-slate-300">
              <span className="text-emerald-400">&gt; SEARCH INPUT [F2]:</span> &quot;Paracetamol&quot;
              <div className="pl-4 pt-1 text-slate-400 space-y-0.5">
                <div>[1] Napa 500mg Tab (Beximco) · Stock: 510 pcs · MRP: ৳1.20 · Loc: Rack A-01/S-1</div>
                <div>[2] Ace 500mg Tab (Square) · Stock: 620 pcs · MRP: ৳1.20 · Loc: Rack A-01/S-3</div>
                <div>[3] Fast 500mg Tab (ACI) · Stock: 140 pcs · MRP: ৳1.20 · Loc: Rack A-02/S-2</div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="py-2 text-slate-300">
              <span className="text-emerald-400">&gt; FEFO BATCH ALLOCATOR:</span> Napa 500mg selected
              <div className="pl-4 pt-1 space-y-0.5">
                <div className="text-amber-400">⚡ AUTO-SELECTED: Batch BX-NP2309 (Exp: 2026-10-15) · Stock: 60 pcs</div>
                <div className="text-slate-500">· Subsequent Batch: BX-NP2401 (Exp: 2027-04-30) · Stock: 450 pcs</div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="py-2 text-slate-300">
              <span className="text-emerald-400">&gt; UNIT CONVERSION MATRIX:</span>
              <div className="pl-4 pt-1 space-y-0.5 text-slate-300">
                <div>Selected: 2 Strips (= 20 Pcs)</div>
                <div>Calculation: 20 pcs x ৳1.20 = ৳24.00 (DGDA Cap Verified: ৳1.20 &lt;= ৳1.20)</div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="py-2 text-slate-300">
              <span className="text-amber-400">&gt; DGDA REGULATORY GUARD:</span>
              <div className="pl-4 pt-1 space-y-0.5 text-slate-300">
                <div>✓ Gazette Price Ceiling Verified: No overcharge</div>
                <div>✓ Schedule G Narcotic Check: Sedil requires BMDC # (A-49281) &amp; NID logged</div>
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div className="py-2 text-slate-300">
              <span className="text-emerald-400">&gt; PAYMENT &amp; DUE LEDGER:</span>
              <div className="pl-4 pt-1 space-y-0.5 text-slate-300">
                <div>Subtotal: ৳500.00 | Discount (5%): -৳25.00 | VAT (2.4%): ৳11.40 | Net: ৳486.00</div>
                <div>Paid: ৳300.00 via bKash | Balance Due: ৳186.00 (Customer: Haji Rafiq 01712-XXXXXX)</div>
              </div>
            </div>
          )}

          {activeStep === 6 && (
            <div className="py-2 text-slate-300">
              <span className="text-emerald-400">&gt; HARDWARE ESC/POS DISPATCH [F8]:</span>
              <div className="pl-4 pt-1 space-y-0.5 text-slate-300">
                <div>✓ 80mm ESC/POS Binary stream sent to Thermal Printer</div>
                <div>✓ Cash Drawer Solenoid RJ11 Kick: Pulse 50ms triggered</div>
                <div>✓ Physical Batch stock deducted in DB: New balance 40 pcs</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ergonomic Counter Design Principles */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          Core Ergonomic Principles for Bangladesh Retail Pharmacy Counters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block">1. Zero-Touch Mouse Capability</span>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Every operation from search to receipt print can be driven completely with F2, F4, F8, Tab, and Enter keys, allowing pharmacists to keep hands on the counter.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block">2. High-Contrast Data Density</span>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Clear typographic contrast (Plus Jakarta Sans + JetBrains Mono) with large tabular numerals readable under low-light or backup IPS battery counter conditions.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block">3. Regulatory Safeguards</span>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Impossible for accidental human error to charge above DGDA capped prices or dispense banned medication, safeguarding the pharmacy owner from mobile court penalties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
