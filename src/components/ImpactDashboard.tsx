import React, { useMemo, useState } from 'react';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Project } from '../types/capital';
import { fmtM } from '../utils/finance';
import { computeProjectImpact, type AnnualImpactPoint } from '../utils/impact';
import { EvidenceText } from './SharedUI';

interface ImpactDashboardProps {
  project: Project;
}

interface CustomTooltipPayloadItem {
  payload?: AnnualImpactPoint;
}

function JobsTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: CustomTooltipPayloadItem[];
}) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;

  return (
    <div className="rounded-lg border border-white/15 bg-[#07101d]/95 px-3.5 py-2.5 text-xs text-slate-200 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-1.5">
        <span className="font-semibold text-slate-100">
          Year {row.year} · {row.phase}
        </span>
        <span className="font-mono-num font-bold text-teal-300">
          {row.totalJobs.toLocaleString()} jobs
        </span>
      </div>
      <div className="mt-1.5 space-y-1 font-mono-num">
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Direct</span>
          <span className="text-teal-300">{row.directJobs.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Indirect supply chain</span>
          <span className="text-sky-300">{row.indirectJobs.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Induced catalytic</span>
          <span className="text-amber-300">{row.inducedJobs.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function GdpTooltip({
  active,
  payload,
  ccyPrefix,
}: {
  active?: boolean;
  payload?: CustomTooltipPayloadItem[];
  ccyPrefix: string;
}) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;

  return (
    <div className="rounded-lg border border-white/15 bg-[#07101d]/95 px-3.5 py-2.5 text-xs text-slate-200 shadow-xl backdrop-blur-md">
      <div className="border-b border-white/10 pb-1.5 font-semibold text-slate-100">
        Year {row.year} · {row.phase}
      </div>
      <div className="mt-1.5 space-y-1 font-mono-num">
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Cumulative GDP</span>
          <span className="font-semibold text-teal-300">
            {ccyPrefix}
            {row.cumulativeGdpM.toFixed(1)}m
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Annual GDP value</span>
          <span className="text-amber-300">
            {ccyPrefix}
            {row.annualGdpM.toFixed(1)}m
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Fiscal / tariff return</span>
          <span className="text-violet-300">
            {ccyPrefix}
            {row.fiscalReturnM.toFixed(1)}m
          </span>
        </div>
      </div>
    </div>
  );
}

export function ImpactDashboard({ project }: ImpactDashboardProps) {
  const [horizonYears, setHorizonYears] = useState<5 | 10>(10);
  const [showMethodology, setShowMethodology] = useState(false);

  const projection = useMemo(
    () => computeProjectImpact(project, horizonYears),
    [project, horizonYears]
  );

  const ccyPrefix =
    project.currency === 'ZAR'
      ? 'R'
      : project.currency === 'USD'
        ? '$'
        : `${project.currency} `;

  return (
    <section
      aria-labelledby="impact-dashboard-heading"
      data-testid="impact-dashboard"
      className="rounded-xl border border-white/10 bg-[#0b1424] p-6"
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
            <span>{projection.profile.label}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">
              {ccyPrefix}
              {fmtM(project.capex)}m capex basis
            </span>
            <span aria-hidden="true">·</span>
            <EvidenceText level="inferred" />
          </div>
          <h3
            id="impact-dashboard-heading"
            className="font-display mt-1 text-2xl font-medium tracking-tight text-slate-100"
          >
            Socioeconomic impact projections
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Projection horizon"
            className="flex items-center rounded-lg border border-white/10 bg-[#07101d] p-0.5"
          >
            {([5, 10] as const).map((yr) => {
              const active = horizonYears === yr;
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setHorizonYears(yr)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-teal-400/20 text-teal-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {yr}-Year
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-expanded={showMethodology}
            onClick={() => setShowMethodology((v) => !v)}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/5 whitespace-nowrap shrink-0"
          >
            {showMethodology ? 'Hide methodology' : 'Methodology'}
          </button>
        </div>
      </div>

      {/* Empty / zero-capex guard */}
      {project.capex <= 0 ? (
        <div className="mt-6 border-t border-white/10 pt-6 text-sm text-slate-400">
          Add a positive capex estimate in the project profile to model long-term employment and GDP projections.
        </div>
      ) : (
        <>
          {/* 4-Column Summary Strip */}
          <div className="mt-5 grid grid-cols-2 gap-5 border-y border-white/10 py-5 lg:grid-cols-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {horizonYears}-Year job-years
              </div>
              <div className="font-mono-num mt-1 text-2xl font-bold text-teal-300 tabular-nums">
                {projection.totalJobYears.toLocaleString()}
              </div>
              <div className="mt-1 font-mono-num text-xs text-slate-400">
                Peak {projection.peakAnnualJobs.toLocaleString()} · Ops{' '}
                {projection.permanentOpsJobs.toLocaleString()}/yr
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Cumulative GDP impact
              </div>
              <div className="font-mono-num mt-1 text-2xl font-bold text-amber-300 tabular-nums">
                {ccyPrefix}
                {projection.cumulativeGdpM.toLocaleString('en-US', {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
                m
              </div>
              <div className="mt-1 font-mono-num text-xs text-slate-400">
                {projection.effectiveGdpMultiplier.toFixed(2)}× capital output multiplier
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Fiscal &amp; tariff capture
              </div>
              <div className="font-mono-num mt-1 text-2xl font-bold text-slate-100 tabular-nums">
                {ccyPrefix}
                {projection.cumulativeFiscalReturnM.toLocaleString('en-US', {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
                m
              </div>
              <div className="mt-1 font-mono-num text-xs text-slate-400">
                {(projection.profile.fiscalReturnShare * 100).toFixed(0)}% cumulative local capture
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {projection.profile.outcomeMetricLabel}
              </div>
              <div className="font-mono-num mt-1 text-2xl font-bold text-sky-300 tabular-nums">
                {projection.primaryOutcomeFormatted}
              </div>
              <div className="mt-1 font-mono-num text-xs text-slate-400">
                ~{projection.householdsReached.toLocaleString()} households reached
              </div>
            </div>
          </div>

          {/* Methodology Breakdown (on demand) */}
          {showMethodology && (
            <div className="mt-5 border-b border-white/10 pb-5 text-xs text-slate-300">
              <p className="leading-relaxed text-slate-300">
                {projection.profile.methodologyNote}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 font-mono-num text-slate-400">
                <span>
                  Direct: {projection.profile.directJobsPer100M} / {ccyPrefix}100m
                </span>
                <span>
                  Indirect: {projection.profile.indirectJobsPer100M} / {ccyPrefix}100m
                </span>
                <span>
                  Induced: {projection.profile.inducedJobsPer100M} / {ccyPrefix}100m
                </span>
                <span>
                  10Y GDP Multiplier: {projection.profile.gdpMultiplier10Y.toFixed(2)}×
                </span>
                <span>
                  Ops retention:{' '}
                  {Math.round(projection.profile.opsRetentionFactor * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Dual Recharts Visualization Grid */}
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            {/* Chart 1: Employment Projections */}
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">
                    Annual job creation projection
                  </h4>
                  <p className="text-xs text-slate-400">
                    Construction peak (Y1–Y3) to permanent operations &amp; supply-chain spillovers
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="inline-block h-2 w-2 rounded-sm bg-[#2dd4bf]" />
                    Direct
                  </span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="inline-block h-2 w-2 rounded-sm bg-[#38bdf8]" />
                    Indirect
                  </span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="inline-block h-2 w-2 rounded-sm bg-[#fbbf24]" />
                    Induced
                  </span>
                </div>
              </div>

              <div
                data-testid="impact-jobs-chart"
                className="h-[260px] w-full rounded-lg border border-white/8 bg-[#07101d]/75 p-3"
              >
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart
                    data={projection.series}
                    margin={{ top: 10, right: 8, left: 4, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.06)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="yearLabel"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={46}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                      content={<JobsTooltip />}
                    />
                    <Bar
                      dataKey="directJobs"
                      name="Direct"
                      stackId="jobs"
                      fill="#2dd4bf"
                    />
                    <Bar
                      dataKey="indirectJobs"
                      name="Indirect"
                      stackId="jobs"
                      fill="#38bdf8"
                    />
                    <Bar
                      dataKey="inducedJobs"
                      name="Induced"
                      stackId="jobs"
                      fill="#fbbf24"
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: GDP Contribution & Fiscal Return */}
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">
                    GDP contribution &amp; fiscal capture ({ccyPrefix}m)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Cumulative economic value added vs annual output and fiscal return
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="inline-block h-2 w-2 rounded-sm bg-[#2dd4bf]" />
                    Cumulative
                  </span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="inline-block h-2 w-2 rounded-sm bg-[#fbbf24]" />
                    Annual GDP
                  </span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="inline-block h-2 w-2 rounded-sm bg-[#a78bfa]" />
                    Fiscal
                  </span>
                </div>
              </div>

              <div
                data-testid="impact-gdp-chart"
                className="h-[260px] w-full rounded-lg border border-white/8 bg-[#07101d]/75 p-3"
              >
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <ComposedChart
                    data={projection.series}
                    margin={{ top: 10, right: 6, left: 4, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="impactGdpGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.32} />
                        <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.06)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="yearLabel"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="cum"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={48}
                    />
                    <YAxis
                      yAxisId="ann"
                      orientation="right"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={42}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                      content={<GdpTooltip ccyPrefix={ccyPrefix} />}
                    />
                    <Area
                      yAxisId="cum"
                      type="monotone"
                      dataKey="cumulativeGdpM"
                      name="Cumulative GDP"
                      stroke="#2dd4bf"
                      strokeWidth={2}
                      fill="url(#impactGdpGrad)"
                    />
                    <Bar
                      yAxisId="ann"
                      dataKey="annualGdpM"
                      name="Annual GDP"
                      fill="#fbbf24"
                      fillOpacity={0.78}
                      barSize={16}
                      radius={[3, 3, 0, 0]}
                    />
                    <Line
                      yAxisId="ann"
                      type="monotone"
                      dataKey="fiscalReturnM"
                      name="Fiscal Return"
                      stroke="#a78bfa"
                      strokeWidth={2}
                      dot={{ r: 2.5, fill: '#a78bfa' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
