import React from 'react';
import {
  JURISDICTION_OPTIONS,
  LEGAL_BY_JURISDICTION,
} from '../data/capitalData';
import { LegalStatusText, SectionHeader } from './SharedUI';

interface LegalViewProps {
  jurisdiction: string;
  onChangeJurisdiction: (j: string) => void;
}

export function LegalView({
  jurisdiction,
  onChangeJurisdiction,
}: LegalViewProps) {
  const data =
    LEGAL_BY_JURISDICTION[jurisdiction] || LEGAL_BY_JURISDICTION['za-muni'];
  const currentLabel =
    JURISDICTION_OPTIONS.find((j) => j.value === jurisdiction)?.label ||
    jurisdiction;

  return (
    <section aria-labelledby="legal-heading" className="space-y-6">
      <SectionHeader
        title="Legal & fiscal authority check"
        hint="Decision support only — verify every statutory rule with local counsel"
        action={
          <div className="flex items-center gap-2">
            <label
              htmlFor="legal-jurisdiction-select"
              className="text-xs font-medium text-slate-400"
            >
              Jurisdiction:
            </label>
            <select
              id="legal-jurisdiction-select"
              value={jurisdiction}
              onChange={(e) => onChangeJurisdiction(e.target.value)}
              className="rounded-lg border border-white/15 bg-[#0b1424] px-3 py-1.5 text-xs font-medium text-slate-200 focus:border-teal-400/50 focus:outline-none"
            >
              {JURISDICTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <div className="rounded-xl border border-amber-300/25 bg-amber-300/[0.06] p-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Statutory summary · {currentLabel}
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
          {data.summary}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0b1424]">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="w-[24%] px-4 py-3">Authority Question</th>
              <th className="w-[18%] px-4 py-3">Status</th>
              <th className="px-4 py-3">Citation &amp; Note</th>
              <th className="w-[12%] px-4 py-3 text-right">Reviewed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {data.rules.map((r) => (
              <tr key={r.q} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3.5 font-semibold text-slate-100">
                  {r.q}
                </td>
                <td className="px-4 py-3.5">
                  <LegalStatusText status={r.status} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-mono-num text-xs text-slate-400">
                    {r.cite}
                  </div>
                  <p className="mt-1 text-sm text-slate-200">{r.note}</p>
                </td>
                <td className="font-mono-num px-4 py-3.5 text-right text-xs text-slate-400">
                  {r.reviewed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0b1424] p-5">
        <h3 className="text-sm font-semibold text-amber-300">
          What the platform will not do
        </h3>
        <p className="mt-1.5 text-sm text-slate-300">
          Capital Intelligence will not recommend off-balance-sheet structures
          designed to evade statutory borrowing restrictions. Contingent
          liabilities, guarantee caps, and Treasury approval paths are
          explicitly surfaced prior to matching.
        </p>
      </div>
    </section>
  );
}
