import React, { useMemo, useState } from 'react';
import { CATS, STAGE_LABEL } from '../data/capitalData';
import type {
  CapitalProvider,
  Engagement,
  Project,
  TabId,
} from '../types/capital';
import { scoreMatch } from '../utils/finance';
import {
  EngagementText,
  EvidenceText,
  ReadinessMeter,
  SectionHeader,
} from './SharedUI';

interface MatchesViewProps {
  project: Project;
  capitalProviders: CapitalProvider[];
  engagements: Record<string, Engagement>;
  onOpenEngage: (capId: string, capName: string) => void;
  onNavigate: (tab: TabId) => void;
}

const INSTRUMENTS = [
  'all',
  'Grant / technical assistance',
  'Project preparation',
  'Concessional debt',
  'Commercial debt',
  'ECA / guarantee',
  'Guarantee / risk',
  'Equity',
];

export function MatchesView({
  project,
  capitalProviders,
  engagements,
  onOpenEngage,
  onNavigate,
}: MatchesViewProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [instrument, setInstrument] = useState('all');
  const [minScore, setMinScore] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [overlookedOnly, setOverlookedOnly] = useState(false);

  const ranked = useMemo(() => {
    const q = search.trim().toLowerCase();
    return capitalProviders
      .map((c) => {
        const score = scoreMatch(project, c);
        const eng = engagements[`${project.id}-${c.id}`];
        const engStatus = eng?.status || 'none';
        return { ...c, score, engStatus };
      })
      .filter((c) => {
        const hay = `${c.name} ${c.desc} ${c.type} ${c.category} ${c.nontraditionalTag ?? ''}`.toLowerCase();
        return (
          (!q || hay.includes(q)) &&
          (category === 'all' || c.category === category) &&
          (instrument === 'all' || c.type === instrument) &&
          c.score >= minScore &&
          (statusFilter === 'all' || c.engStatus === statusFilter) &&
          (!overlookedOnly || Boolean(c.overlooked))
        );
      })
      .sort((a, b) => b.score - a.score);
  }, [
    project,
    capitalProviders,
    engagements,
    search,
    category,
    instrument,
    minScore,
    statusFilter,
    overlookedOnly,
  ]);

  return (
    <section aria-labelledby="matches-heading" className="space-y-6">
      <SectionHeader
        title="Capital matches"
        hint={`Ranked for "${project.name}" (${STAGE_LABEL[project.stage]}) by stage fit, legal compatibility & mandate alignment`}
      />

      {/* Filter Bar */}
      <div className="grid gap-3 rounded-xl border border-white/10 bg-[#0b1424] p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label
            htmlFor="match-search"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Search
          </label>
          <input
            id="match-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Provider, instrument..."
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="match-cat"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Category
          </label>
          <select
            id="match-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
          >
            <option value="all">All categories</option>
            {CATS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="match-type"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Instrument
          </label>
          <select
            id="match-type"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
          >
            {INSTRUMENTS.map((t) => (
              <option key={t} value={t}>
                {t === 'all' ? 'All instruments' : t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="match-score"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Min. fit score
          </label>
          <select
            id="match-score"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
          >
            <option value={0}>Any score</option>
            <option value={60}>60+</option>
            <option value={75}>75+</option>
            <option value={85}>85+</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="match-status"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Engagement
          </label>
          <select
            id="match-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="none">Not engaged</option>
            <option value="interest">Interest expressed</option>
            <option value="nda">NDA active</option>
            <option value="terms">Terms discussion</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono-num text-xs text-slate-400">
          {ranked.length} matched providers · illustrative stage &amp; mandate fit
        </div>
        <button
          type="button"
          onClick={() => setOverlookedOnly((prev) => !prev)}
          aria-pressed={overlookedOnly}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
            overlookedOnly
              ? 'border-amber-300/50 bg-amber-300/15 text-amber-200'
              : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]'
          }`}
        >
          {overlookedOnly
            ? 'Showing non-traditional & overlooked pools'
            : 'Filter: Overlooked & non-traditional pools'}
        </button>
      </div>

      {ranked.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {ranked.map((c) => (
            <article
              key={c.id}
              className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0b1424] p-6"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <ReadinessMeter score={c.score} label="Fit score" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-violet-300">
                        <span>{c.category}</span>
                        {c.nontraditionalTag && (
                          <span className="rounded bg-amber-300/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-200">
                            {c.nontraditionalTag}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-0.5 text-base font-semibold text-slate-100">
                        {c.name}
                      </h3>
                      <div className="mt-0.5 text-xs text-slate-400">
                        {c.type}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <EvidenceText level={c.confidence} />
                    {c.engStatus !== 'none' && (
                      <div className="mt-1">
                        <EngagementText status={c.engStatus} />
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-300">{c.desc}</p>

                <div className="mt-2.5 text-xs text-slate-400">
                  Stages:{' '}
                  <span className="text-slate-200">
                    {c.stages.map((s) => STAGE_LABEL[s]).join(' · ')}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-3 border-y border-white/8 py-3">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Ticket
                    </dt>
                    <dd className="font-mono-num mt-0.5 text-xs font-semibold text-slate-100">
                      {c.ticket}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Currency
                    </dt>
                    <dd className="font-mono-num mt-0.5 text-xs font-semibold text-slate-100">
                      {c.currency}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Sectors
                    </dt>
                    <dd className="mt-0.5 text-xs font-semibold text-slate-200">
                      {c.sectors.slice(0, 3).join(', ')}
                    </dd>
                  </div>
                </dl>

                <p className="mt-3 text-xs leading-relaxed text-slate-300">
                  <strong className="text-slate-100">Eligibility:</strong> {c.legal}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex gap-2">
                  {c.engStatus === 'none' && (
                    <button
                      type="button"
                      onClick={() => onOpenEngage(c.id, c.name)}
                      className="rounded-lg bg-teal-400 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-teal-300 whitespace-nowrap shrink-0"
                    >
                      Express interest
                    </button>
                  )}
                  {c.engStatus === 'interest' && (
                    <button
                      type="button"
                      onClick={() => onOpenEngage(c.id, c.name)}
                      className="rounded-lg bg-teal-400 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-teal-300 whitespace-nowrap shrink-0"
                    >
                      Request NDA
                    </button>
                  )}
                  {(c.engStatus === 'nda' ||
                    c.engStatus === 'terms' ||
                    c.engStatus === 'closed') && (
                    <button
                      type="button"
                      onClick={() => onNavigate('dealroom')}
                      className="rounded-lg border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5 whitespace-nowrap shrink-0"
                    >
                      Open deal room
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span>
                    {c.source} · {c.verified}
                  </span>
                  {c.officialUrl && (
                    <a
                      href={c.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-teal-300 underline decoration-teal-300/40 underline-offset-2 hover:text-teal-200"
                    >
                      Portal ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-[#0b1424] p-12 text-center">
          <h3 className="text-base font-semibold text-slate-100">
            No capital providers match these filters
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Reset the minimum fit score or broaden category and instrument filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCategory('all');
              setInstrument('all');
              setMinScore(0);
              setStatusFilter('all');
              setOverlookedOnly(false);
            }}
            className="mt-4 rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5"
          >
            Reset filters
          </button>
        </div>
      )}
    </section>
  );
}
