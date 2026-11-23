import React, { useMemo, useState } from 'react';
import {
  FLOW_DRIVERS,
  FLOW_INSTRUMENTS,
  TRANSACTIONS,
} from '../data/capitalData';
import type { TabId } from '../types/capital';
import { SectionHeader } from './SharedUI';

export function FlowsView({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTxns = useMemo(
    () =>
      TRANSACTIONS.filter(
        (t) => statusFilter === 'all' || t.status === statusFilter
      ),
    [statusFilter]
  );

  const statusTone: Record<string, string> = {
    Closed: 'text-teal-300',
    Implementation: 'text-sky-300',
    Preparation: 'text-amber-300',
  };

  return (
    <section aria-labelledby="flows-heading" className="space-y-8">
      <SectionHeader
        title="Capital flows & transaction intelligence"
        hint="Illustrative structural patterns — not current committed availability"
        action={
          <button
            type="button"
            onClick={() => onNavigate('map')}
            className="rounded-lg bg-teal-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-300 whitespace-nowrap shrink-0"
          >
            Open interactive Flows Map
          </button>
        }
      />

      <div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.05] px-4 py-3 text-xs text-slate-300">
        <strong className="text-amber-300">Note:</strong> Real-time cross-border
        transaction volumes require licensed data feeds. Figures below are
        synthesised for product evaluation.
      </div>

      {/* Headline Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-[#0b1424] p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Indicative annual flow to SSA
          </div>
          <div className="font-mono-num mt-2 text-3xl font-bold text-slate-100">
            ~$48bn
          </div>
          <p className="mt-1 text-xs text-slate-400">
            All sources · multi-year aggregate concept
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0b1424] p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Preparation vs construction
          </div>
          <div className="font-mono-num mt-2 text-3xl font-bold text-amber-300">
            ~8% / 92%
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Upstream preparation remains structurally under-funded
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0b1424] p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Blended structures
          </div>
          <div className="font-mono-num mt-2 text-3xl font-bold text-teal-300">
            ~34%
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Of closed deals used a concessional or grant layer
          </p>
        </div>
      </div>

      {/* Flows by Instrument */}
      <div>
        <h3 className="font-display mb-4 text-xl font-medium text-slate-100">
          Flows by instrument
        </h3>
        <div className="space-y-4 rounded-xl border border-white/10 bg-[#0b1424] p-6">
          {FLOW_INSTRUMENTS.map((f) => (
            <div key={f.name}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-slate-200">{f.name}</span>
                <strong className="font-mono-num text-slate-100">{f.pct}%</strong>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  style={{ width: `${f.pct}%`, backgroundColor: f.color }}
                  className="h-full rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Structural Drivers */}
      <div>
        <h3 className="font-display mb-4 text-xl font-medium text-slate-100">
          Why capital goes where it goes
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FLOW_DRIVERS.map((d) => (
            <div
              key={d.title}
              className="rounded-xl border border-white/10 bg-[#0b1424] p-5"
            >
              <h4 className="text-sm font-semibold text-slate-100">{d.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                {d.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Transactions */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-medium text-slate-100">
            Sample transactions
          </h3>
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#0b1424] p-1">
            {['all', 'Closed', 'Implementation', 'Preparation'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  statusFilter === st
                    ? 'bg-teal-400/20 text-teal-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0b1424]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Providers</th>
                <th className="px-4 py-3">Structure</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {filteredTxns.map((t) => (
                <tr key={t.project} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-semibold text-slate-100">
                    {t.project}
                  </td>
                  <td className="px-4 py-3 text-slate-200">{t.country}</td>
                  <td className="px-4 py-3 text-xs text-slate-300">
                    {t.providers}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300">
                    {t.structure}
                  </td>
                  <td className="font-mono-num px-4 py-3 font-semibold text-slate-100">
                    {t.amount}
                  </td>
                  <td className="font-mono-num px-4 py-3 text-slate-400">
                    {t.year}
                  </td>
                  <td
                    className={`px-4 py-3 text-right text-xs font-semibold ${
                      statusTone[t.status] || 'text-slate-300'
                    }`}
                  >
                    {t.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
