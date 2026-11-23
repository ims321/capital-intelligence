import React, { useState } from 'react';
import { SCENARIOS } from '../data/capitalData';
import { computeScenario, fmtM } from '../utils/finance';
import { EvidenceText, SectionHeader } from './SharedUI';

export function ScenariosView() {
  const [fxShock, setFxShock] = useState(15);
  const [rateBps, setRateBps] = useState(100);

  const rows = SCENARIOS.map((sc) => ({
    sc,
    base: computeScenario(sc, 0, 0),
    stressed: computeScenario(sc, fxShock, rateBps),
  }));

  const cheapestId = rows.reduce(
    (min, r) => (r.stressed.total < min.stressed.total ? r : min),
    rows[0]
  ).sc.id;

  const maxTotal = Math.max(...rows.map((r) => r.stressed.total), 1);

  const pct = (a: number, b: number) => (b ? ((a - b) / b) * 100 : 0);

  return (
    <section aria-labelledby="scenarios-heading" className="space-y-6">
      <SectionHeader
        title="Financing strategy comparison"
        hint="Whole-of-life cost stress testing · Illustrative ZAR 420m Water Treatment benchmark"
      />

      {/* Benchmark Parameters Strip */}
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-[#0b1424] p-5 sm:grid-cols-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Project capex
          </div>
          <div className="font-mono-num mt-1 text-xl font-bold text-slate-100">
            R420.0m
          </div>
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Revenue currency
          </div>
          <div className="font-mono-num mt-1 text-xl font-bold text-slate-100">
            ZAR
          </div>
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Current stage
          </div>
          <div className="mt-1 text-xl font-bold text-teal-300">Feasibility</div>
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Modelling mode
          </div>
          <div className="mt-1 text-xl font-bold text-slate-200">
            Illustrative
          </div>
        </div>
      </div>

      {/* Stress Sliders */}
      <div className="rounded-xl border border-white/10 bg-[#0b1424] p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="fx-slider"
                className="text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                FX depreciation shock
              </label>
              <span className="font-mono-num text-base font-bold text-teal-300">
                +{fxShock}%
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Depreciation of local currency applied to USD/hard-currency tranches.
            </p>
            <input
              id="fx-slider"
              type="range"
              min={0}
              max={50}
              step={1}
              value={fxShock}
              onChange={(e) => setFxShock(Number(e.target.value))}
              className="mt-3 w-full text-teal-400"
            />
            <div className="mt-1.5 flex justify-between font-mono-num text-[11px] text-slate-500">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="rate-slider"
                className="text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Interest-rate stress
              </label>
              <span className="font-mono-num text-base font-bold text-amber-300">
                +{rateBps} bps
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Reference rate rise applied to the floating share of each debt component.
            </p>
            <input
              id="rate-slider"
              type="range"
              min={0}
              max={400}
              step={25}
              value={rateBps}
              onChange={(e) => setRateBps(Number(e.target.value))}
              className="mt-3 w-full text-amber-300"
            />
            <div className="mt-1.5 flex justify-between font-mono-num text-[11px] text-slate-500">
              <span>0 bps</span>
              <span>+200 bps</span>
              <span>+400 bps</span>
            </div>
          </div>
        </div>

        {/* Visual Comparison Bar Chart */}
        <div className="mt-6 border-t border-white/8 pt-5">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Stressed whole-of-life debt service comparison
          </div>
          <div className="space-y-2.5">
            {rows.map(({ sc, base, stressed }) => {
              const basePct = (base.total / maxTotal) * 100;
              const stressExtraPct = Math.max(
                0,
                ((stressed.total - base.total) / maxTotal) * 100
              );
              return (
                <div key={sc.id} className="grid items-center gap-3 sm:grid-cols-12">
                  <div className="text-xs font-medium text-slate-300 sm:col-span-4">
                    Scenario {sc.id} · {sc.name}
                  </div>
                  <div className="sm:col-span-6">
                    <div className="flex h-3 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        style={{ width: `${basePct}%` }}
                        className={
                          sc.id === cheapestId ? 'bg-teal-400' : 'bg-sky-400/80'
                        }
                      />
                      <div
                        style={{ width: `${stressExtraPct}%` }}
                        className="bg-rose-400/80"
                      />
                    </div>
                  </div>
                  <div className="font-mono-num text-right text-xs font-semibold text-slate-100 sm:col-span-2">
                    R{fmtM(stressed.total)}m
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4 Scenario Cards */}
      <div className="grid gap-5 lg:grid-cols-2">
        {rows.map(({ sc, base, stressed }) => {
          const dA = stressed.annual - base.annual;
          const dT = stressed.total - base.total;
          const fxShare = stressed.debt
            ? (stressed.fxExposed / stressed.debt) * 100
            : 0;
          const isCheapest = sc.id === cheapestId;

          return (
            <article
              key={sc.id}
              className={`rounded-xl border p-6 ${
                sc.recommended
                  ? 'border-teal-400/40 bg-[#0c192b]'
                  : 'border-white/10 bg-[#0b1424]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Scenario {sc.id}
                  {sc.recommended && (
                    <span className="ml-2 text-teal-300">· Analytical recommendation</span>
                  )}
                </div>
                {isCheapest && (
                  <span className="text-xs font-semibold text-emerald-300">
                    Lowest total cost
                  </span>
                )}
              </div>

              <h3 className="mt-1.5 text-lg font-semibold text-slate-100">
                {sc.name}
              </h3>
              <p className="mt-1 text-sm text-slate-400">{sc.desc}</p>

              <div className="mt-5 grid grid-cols-2 gap-4 border-y border-white/8 py-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Annual service (post-grace)
                  </div>
                  <div
                    className={`font-mono-num mt-1 text-lg font-bold ${
                      dA > 500 ? 'text-rose-300' : 'text-slate-100'
                    }`}
                  >
                    R{fmtM(stressed.annual)}m
                  </div>
                  <div className="font-mono-num text-[11px] text-slate-400">
                    Base R{fmtM(base.annual)}m · {dA > 500 ? '+' : ''}
                    {pct(stressed.annual, base.annual).toFixed(1)}%
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Total debt service
                  </div>
                  <div
                    className={`font-mono-num mt-1 text-lg font-bold ${
                      dT > 500 ? 'text-rose-300' : 'text-slate-100'
                    }`}
                  >
                    R{fmtM(stressed.total)}m
                  </div>
                  <div className="font-mono-num text-[11px] text-slate-400">
                    Base R{fmtM(base.total)}m · {dT > 500 ? '+' : ''}
                    {pct(stressed.total, base.total).toFixed(1)}%
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Debt outstanding (stressed)
                  </div>
                  <div className="font-mono-num mt-1 text-base font-semibold text-slate-100">
                    R{fmtM(stressed.debt)}m
                  </div>
                  <div className="font-mono-num text-[11px] text-slate-400">
                    Base R{fmtM(base.debt)}m
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Life-of-loan interest
                  </div>
                  <div className="font-mono-num mt-1 text-base font-semibold text-slate-100">
                    R{fmtM(stressed.interest)}m
                  </div>
                  <div className="font-mono-num text-[11px] text-slate-400">
                    Base R{fmtM(base.interest)}m
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    FX-exposed debt
                  </div>
                  <div className="font-mono-num mt-1 text-base font-semibold text-slate-100">
                    R{fmtM(stressed.fxExposed)}m ({fxShare.toFixed(0)}%)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {stressed.fxExposed > 0
                      ? 'Scales with depreciation'
                      : 'All ZAR — no FX pass-through'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Grant element &amp; close
                  </div>
                  <div className="font-mono-num mt-1 text-base font-semibold text-teal-300">
                    R{fmtM(stressed.grant)}m
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Est. close: {sc.time}
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-slate-300">
                <strong className="text-slate-100">Legal:</strong> {sc.legal}
              </p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                <EvidenceText level="inferred" />
                <span>·</span>
                <span>
                  Stress: +{fxShock}% FX, +{rateBps} bps · arrangement fees excluded
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
