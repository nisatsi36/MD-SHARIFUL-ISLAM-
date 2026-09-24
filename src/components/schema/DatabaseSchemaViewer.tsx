import React, { useState } from 'react';
import { DATABASE_ENTITIES, POSTGRESQL_DDL_SCRIPT } from '../../data/srsContent';

export const DatabaseSchemaViewer: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState(DATABASE_ENTITIES[0].name);
  const [copied, setCopied] = useState(false);

  const activeEntity = DATABASE_ENTITIES.find((e) => e.name === selectedEntity) || DATABASE_ENTITIES[0];

  const handleCopyDdl = () => {
    navigator.clipboard.writeText(POSTGRESQL_DDL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Overview */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
              POSTGRESQL 16 ENTERPRISE SCHEMA
            </span>
            <span className="text-xs text-slate-500 font-mono">ACID Compliant · pg_trgm Enabled</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Database Schema & Key Entities
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Normalized relational data model engineered for high-frequency counter transactions, FEFO batch allocation, multi-tier unit conversions, and DGDA regulatory auditing.
          </p>
        </div>
        <button
          onClick={handleCopyDdl}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
        >
          {copied ? '✓ Copied SQL to Clipboard' : '📋 Copy Full PostgreSQL DDL Script'}
        </button>
      </div>

      {/* Relational Entity Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Entity List */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
            Core Database Entities ({DATABASE_ENTITIES.length})
          </h3>
          <div className="space-y-1.5">
            {DATABASE_ENTITIES.map((ent) => (
              <button
                key={ent.name}
                onClick={() => setSelectedEntity(ent.name)}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                  selectedEntity === ent.name
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-mono font-bold text-slate-900">{ent.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {ent.description}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  {ent.columns.length} columns defined
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Entity Details Table */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-slate-900">
                  {activeEntity.name}
                </span>
                <span className="text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded font-semibold">
                  Primary Table
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{activeEntity.description}</p>
            </div>
          </div>

          {/* Columns Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Column Name</th>
                  <th className="px-3 py-2">Data Type & Constraints</th>
                  <th className="px-3 py-2">Description / Business Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {activeEntity.columns.map((col, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-bold text-slate-900">
                      {col.name}
                    </td>
                    <td className="px-3 py-2.5 text-blue-700">
                      {col.type}
                    </td>
                    <td className="px-3 py-2.5 font-sans text-slate-600">
                      {col.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Entity Relational Cardinality Notes */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
            <strong className="block text-slate-800 mb-1">Architecture Note:</strong>
            {activeEntity.name === 'medicines' && (
              <p>Each commercial brand medicine belongs to one DGDA Generic INN (1:N) and can have multiple physical batches arriving over time (1:N).</p>
            )}
            {activeEntity.name === 'medicine_unit_configs' && (
              <p>Stored generated column calculates <code>total_pcs_per_box = pcs_per_strip * strips_per_box</code> to guarantee mathematical invariant consistency.</p>
            )}
            {activeEntity.name === 'batches' && (
              <p>Indexed via compound partial index <code>(medicine_id, expiry_date ASC) WHERE stock_pcs &gt; 0</code> for zero-latency FEFO queueing.</p>
            )}
            {activeEntity.name === 'sales_invoices' && (
              <p>Maintains NBR Mushak-6.3 sequence numbers and records customer credit balances for the neighborhood due ledger.</p>
            )}
            {activeEntity.name === 'sales_invoice_items' && (
              <p>Secured with PostgreSQL trigger function <code>verify_dgda_mrp_cap()</code> preventing price-gouging above DGDA gazette ceilings.</p>
            )}
            {activeEntity.name === 'dgda_generics' && (
              <p>Equipped with GIN trigram index (<code>pg_trgm</code>) enabling sub-50ms fuzzy matching across phonetic spelling variations.</p>
            )}
          </div>
        </div>
      </div>

      {/* SQL DDL Code Viewer */}
      <div className="bg-slate-950 text-slate-200 rounded-xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono text-slate-400 ml-2">
              pharmabangla_dgda_schema.sql
            </span>
          </div>
          <button
            onClick={handleCopyDdl}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded transition-colors font-mono"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
        <pre className="text-xs font-mono text-emerald-400 overflow-x-auto max-h-96 leading-relaxed">
          {POSTGRESQL_DDL_SCRIPT}
        </pre>
      </div>
    </div>
  );
};
