import React, { useState } from 'react';
import { SRS_CORE_MODULES, SrsSection } from '../../data/srsContent';

export const SrsDocumentation: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedSection, setExpandedSection] = useState<string>(SRS_CORE_MODULES[0].id);

  const categories = ['all', ...Array.from(new Set(SRS_CORE_MODULES.map((m) => m.category)))];

  const filteredModules = SRS_CORE_MODULES.filter((module) => {
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    const matchesSearch =
      module.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      module.requirements.some(
        (r) =>
          r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          r.spec.toLowerCase().includes(searchFilter.toLowerCase()) ||
          r.bangladeshContext.toLowerCase().includes(searchFilter.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const handleExportMarkdown = () => {
    let md = `# PharmaBangla: System Requirement Specification (SRS)\n`;
    md += `## Tailored for Pharmacy Management & POS in Bangladesh\n`;
    md += `*Directorate General of Drug Administration (DGDA) & NBR Mushak-6.3 Compliant*\n\n`;
    md += `Date: September 2026 | Document Version: 2.4-Production\n\n`;

    SRS_CORE_MODULES.forEach((mod) => {
      md += `### ${mod.title}\n`;
      md += `**Category:** ${mod.category}\n\n`;
      md += `${mod.description}\n\n`;

      mod.requirements.forEach((req) => {
        md += `#### [${req.id}] ${req.name} (${req.priority})\n`;
        md += `- **Functional Specification:** ${req.spec}\n`;
        md += `- **Bangladesh Regulatory & Market Context:** ${req.bangladeshContext}\n\n`;
      });
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PharmaBangla_SRS_Specification_v2.4.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Document Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-500/30 font-semibold">
                SYSTEM REQUIREMENT SPECIFICATION (SRS)
              </span>
              <span className="text-xs text-slate-400">DGDA & NBR Ready</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-2 text-white">
              Pharmacy Management & POS Software SRS: Bangladesh Market
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Standardized engineering blueprint covering DGDA MRP price capping, trade-to-generic mapping (e.g. Paracetamol → Napa/Ace), multi-tier unit conversions (Strip/Box/Pcs), 80mm ESC/POS thermal printing, and NBR Mushak-6.3 VAT compliance.
            </p>
          </div>
          <button
            onClick={handleExportMarkdown}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export SRS (.md)
          </button>
        </div>

        {/* Executive Metadata Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Jurisdiction & Regulators</span>
            <span className="font-semibold text-slate-200">DGDA, NBR, BMDC, DNC</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Target Deployment</span>
            <span className="font-semibold text-slate-200">Retail & Chain Pharmacies</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Primary Currency</span>
            <span className="font-semibold text-slate-200">BDT (৳ Bangladesh Taka)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Counter Scan Latency</span>
            <span className="font-semibold text-emerald-400 font-mono">&lt; 150 milliseconds</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search requirements, specifications, or DGDA regulations..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Module Requirements Cards */}
      <div className="space-y-4">
        {filteredModules.map((module) => {
          const isExpanded = expandedSection === module.id;
          return (
            <div
              key={module.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* Module Header Accordion Trigger */}
              <button
                type="button"
                onClick={() => setExpandedSection(isExpanded ? '' : module.id)}
                className="w-full text-left p-4 hover:bg-slate-50 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      {module.category}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {module.requirements.length} Requirements
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {module.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{module.description}</p>
                </div>
                <span className="text-slate-400 text-sm ml-4 font-bold">
                  {isExpanded ? '▲' : '▼'}
                </span>
              </button>

              {/* Requirement Items */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4">
                  {module.requirements.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                            {req.id}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">{req.name}</span>
                        </div>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                            req.priority.startsWith('P0')
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {req.priority}
                        </span>
                      </div>

                      {/* Technical Spec */}
                      <div>
                        <strong className="text-slate-700 block text-[11px] mb-0.5">
                          Engineering & Functional Specification:
                        </strong>
                        <p className="text-slate-700 leading-relaxed">{req.spec}</p>
                      </div>

                      {/* Bangladesh Context Box */}
                      <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-950">
                        <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-900 mb-0.5">
                          <span>🇧🇩 Bangladesh Market & Regulatory Grounding:</span>
                        </div>
                        <p className="leading-relaxed text-[11px]">{req.bangladeshContext}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
