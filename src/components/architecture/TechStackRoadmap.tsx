import React from 'react';
import { TECH_STACK_SPECIFICATION, ROADMAP_PHASES } from '../../data/srsContent';

export const TechStackRoadmap: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
            ENTERPRISE ARCHITECTURE & ROADMAP
          </span>
          <span className="text-xs text-slate-500 font-mono">Offline-First · Low Latency</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mt-1">
          Recommended Tech Stack & Phased Product Roadmap
        </h2>
        <p className="text-xs text-slate-500 max-w-3xl mt-0.5 leading-relaxed">
          Engineered for the operational realities of Bangladesh: frequent electrical power load-shedding, intermittent broadband connectivity, high counter transaction velocity, and strict compliance with DGDA & NBR tax regulations.
        </p>
      </div>

      {/* Recommended Tech Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Frontend Layer */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              {TECH_STACK_SPECIFICATION.frontend.name}
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Sub-150ms Response</span>
          </div>
          <div className="space-y-2 text-xs">
            {TECH_STACK_SPECIFICATION.frontend.technologies.map((t, i) => (
              <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="font-bold text-slate-900">{t.name}</div>
                <div className="text-slate-600 mt-0.5 leading-relaxed">{t.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Backend & Sync Engine */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              {TECH_STACK_SPECIFICATION.backend.name}
            </h3>
            <span className="text-[11px] font-mono text-slate-400">REST & WebSockets</span>
          </div>
          <div className="space-y-2 text-xs">
            {TECH_STACK_SPECIFICATION.backend.technologies.map((t, i) => (
              <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="font-bold text-slate-900">{t.name}</div>
                <div className="text-slate-600 mt-0.5 leading-relaxed">{t.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Database & Storage */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              {TECH_STACK_SPECIFICATION.database.name}
            </h3>
            <span className="text-[11px] font-mono text-slate-400">PostgreSQL 16 + Trigram</span>
          </div>
          <div className="space-y-2 text-xs">
            {TECH_STACK_SPECIFICATION.database.technologies.map((t, i) => (
              <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="font-bold text-slate-900">{t.name}</div>
                <div className="text-slate-600 mt-0.5 leading-relaxed">{t.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Offline Edge & High Availability */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              {TECH_STACK_SPECIFICATION.offlineEdge.name}
            </h3>
            <span className="text-[11px] font-mono text-amber-700 font-semibold">Load-Shedding Proof</span>
          </div>
          <div className="space-y-2 text-xs">
            {TECH_STACK_SPECIFICATION.offlineEdge.technologies.map((t, i) => (
              <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="font-bold text-slate-900">{t.name}</div>
                <div className="text-slate-600 mt-0.5 leading-relaxed">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hardware Peripherals Integration Protocol */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          Hardware Peripherals & Driver Protocol Integration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block">1. 80mm ESC/POS Thermal Printers</span>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Direct binary command stream over WebUSB or raw TCP socket port 9100 (Epson, Xprinter, Rongta). Zero third-party print dialogs.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block">2. 1D/2D Barcode Scanners (HID)</span>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Standard keyboard emulation with Web Worker buffer listening for 30-50ms barcode bursts followed by Carriage Return (Enter).
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block">3. Cash Drawer RJ11 Kick</span>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Standard ESC/POS pulse command: <code>\x1B\x70\x00\x19\xFA</code> sent alongside receipt print to trigger solenoid drawer release.
            </p>
          </div>
        </div>
      </div>

      {/* 4-Phase Product Roadmap */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">
            Product Feature Roadmap (12-Month Rollout Strategy)
          </h3>
          <p className="text-xs text-slate-500">
            From single-counter pharmacy MVP to enterprise chain ERP and telehealth integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROADMAP_PHASES.map((phase, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 text-sm">{phase.phase}</span>
                <span className="font-mono text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {phase.timeline}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                {phase.focus}
              </p>
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Core Engineering Deliverables:
                </span>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {phase.deliverables.map((d, dIdx) => (
                    <li key={dIdx} className="leading-snug">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
