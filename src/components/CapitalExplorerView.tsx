import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Search, Sparkles } from 'lucide-react';
import { CATS, STAGE_LABEL } from '../data/capitalData';
import type { CapitalProvider } from '../types/capital';
import {
  filterProviders,
  importProvidersFromCSV,
  serializeCapitalCSV,
} from '../utils/finance';
import {
  matchesOverlookedSegment,
  type OverlookedSegment,
} from '../utils/templates';
import { EvidenceText, SectionHeader } from './SharedUI';

interface CapitalExplorerViewProps {
  providers: CapitalProvider[];
  initialSearch?: string;
  onClearInitialSearch?: () => void;
  onOpenAddProvider: () => void;
  onImportProviders: (imported: CapitalProvider[]) => void;
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
  'Advisory (not capital)',
];

const OVERLOOKED_SEGMENTS: Array<{ id: OverlookedSegment; label: string }> = [
  { id: 'all', label: 'All providers' },
  { id: 'overlooked', label: 'Overlooked & non-traditional' },
  { id: 'municipal', label: 'Municipal & prep grants' },
  { id: 'local_ccy', label: 'Local-currency & FX risk' },
  { id: 'gulf_south_south', label: 'Gulf / Arab & South-South' },
  { id: 'philanthropic_climate', label: 'Philanthropic & carbon' },
];

export function CapitalExplorerView({
  providers,
  initialSearch = '',
  onClearInitialSearch,
  onOpenAddProvider,
  onImportProviders,
}: CapitalExplorerViewProps) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState('all');
  const [instrument, setInstrument] = useState('all');
  const [stage, setStage] = useState('all');
  const [confidence, setConfidence] = useState('all');
  const [segment, setSegment] = useState<OverlookedSegment>('all');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Live grounded fund discovery
  const [aiFundQuery, setAiFundQuery] = useState('');
  const [aiFundLoading, setAiFundLoading] = useState(false);
  const [aiFundError, setAiFundError] = useState<string | null>(null);
  const [aiFundResult, setAiFundResult] = useState<{
    answer: string;
    sources: Array<{ title: string; uri: string }>;
  } | null>(null);

  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
    }
  }, [initialSearch]);

  const overlookedCount = useMemo(
    () => providers.filter((p) => p.overlooked).length,
    [providers]
  );

  const filtered = useMemo(
    () =>
      filterProviders(providers, {
        search,
        category,
        type: instrument,
        stage,
        confidence,
      }).filter((p) => matchesOverlookedSegment(p, segment)),
    [providers, search, category, instrument, stage, confidence, segment]
  );

  const handleExportCSV = () => {
    const csv = serializeCapitalCSV(providers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'capital_providers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const imported = importProvidersFromCSV(text, providers.length);
      onImportProviders(imported);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleLiveFundSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiFundQuery.trim()) return;
    setAiFundLoading(true);
    setAiFundError(null);
    try {
      const res = await fetch('/api/official-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: aiFundQuery.trim(),
          scope: 'capital',
          country: 'Africa',
          sector: 'Infrastructure',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiFundError(data.error || 'Unable to search live funding portals.');
        setAiFundResult(null);
      } else {
        setAiFundResult(data);
      }
    } catch {
      setAiFundError('Network error querying live capital sources.');
    } finally {
      setAiFundLoading(false);
    }
  };

  return (
    <section aria-labelledby="capital-heading" className="space-y-6">
      <SectionHeader
        title="Global capital explorer"
        hint={`${providers.length} institutional providers across 11 capital categories · ${overlookedCount} non-traditional & overlooked windows highlighted`}
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenAddProvider}
              className="rounded-lg bg-teal-400 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-300 whitespace-nowrap shrink-0"
            >
              + Add provider
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-white/15 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5 whitespace-nowrap shrink-0"
            >
              Import CSV
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="rounded-lg border border-white/15 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5 whitespace-nowrap shrink-0"
            >
              Export CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        }
      />

      {/* Non-traditional / Overlooked Capital Spotlight Filter */}
      <div className="rounded-xl border border-violet-400/20 bg-violet-400/[0.04] p-4">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">
            Uncover Overlooked &amp; Non-Traditional Capital Pockets
          </span>
          <span className="text-[11px] text-slate-400">
            Focus beyond commercial banks: municipal PPFs, local-currency guarantees, Arab/South-South DFIs &amp; carbon/foundation facilities
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {OVERLOOKED_SEGMENTS.map((seg) => {
            const active = segment === seg.id;
            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => setSegment(seg.id)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'border-violet-400 bg-violet-400/20 text-violet-100'
                    : 'border-white/12 bg-[#0b1424] text-slate-300 hover:border-white/25 hover:text-slate-100'
                }`}
              >
                {seg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 11 Interactive Category Tiles */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <button
          type="button"
          onClick={() => setCategory('all')}
          className={`rounded-xl border p-3 text-left transition-colors ${
            category === 'all'
              ? 'border-teal-400 bg-teal-400/12'
              : 'border-white/10 bg-[#0b1424] hover:border-white/20'
          }`}
        >
          <span className="font-mono-num block text-xl font-bold text-slate-100">
            {providers.length}
          </span>
          <span className="mt-0.5 block text-xs font-medium text-slate-300">
            All providers
          </span>
        </button>

        {CATS.map((cat) => {
          const count = providers.filter((p) => p.category === cat).length;
          const active = category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-xl border p-3 text-left transition-colors ${
                active
                  ? 'border-teal-400 bg-teal-400/12'
                  : 'border-white/10 bg-[#0b1424] hover:border-white/20'
              }`}
            >
              <span className="font-mono-num block text-xl font-bold text-slate-100">
                {count}
              </span>
              <span className="mt-0.5 block text-xs font-medium leading-snug text-slate-300">
                {cat}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="grid gap-3 rounded-xl border border-white/10 bg-[#0b1424] p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label
            htmlFor="cap-search"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Search
          </label>
          <input
            id="cap-search"
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!e.target.value && onClearInitialSearch) {
                onClearInitialSearch();
              }
            }}
            placeholder="Providers, sectors, countries..."
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="cap-cat"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Category
          </label>
          <select
            id="cap-cat"
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
            htmlFor="cap-type"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Instrument
          </label>
          <select
            id="cap-type"
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
            htmlFor="cap-stage"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Stage
          </label>
          <select
            id="cap-stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
          >
            <option value="all">All stages</option>
            <option value="concept">Concept</option>
            <option value="feasibility">Feasibility</option>
            <option value="structuring">Structuring</option>
            <option value="transaction">Transaction</option>
            <option value="construction">Construction</option>
            <option value="ops">Operations</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="cap-conf"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Evidence
          </label>
          <select
            id="cap-conf"
            value={confidence}
            onChange={(e) => setConfidence(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
          >
            <option value="all">All evidence levels</option>
            <option value="verified">Verified</option>
            <option value="published">Published</option>
            <option value="open">Open call</option>
            <option value="precedent">Precedent</option>
            <option value="mandate">Mandate</option>
            <option value="inferred">Inferred</option>
          </select>
        </div>
      </div>

      {/* Live Web-Grounded Funding Call Finder */}
      <div className="rounded-xl border border-white/10 bg-[#091322] p-4">
        <form onSubmit={handleLiveFundSearch} className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300 shrink-0">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Live Call Finder:</span>
          </div>
          <div className="relative min-w-[220px] flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="text"
              value={aiFundQuery}
              onChange={(e) => setAiFundQuery(e.target.value)}
              placeholder="Search live web for open DFI calls, green grants, or Islamic / sovereign windows..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-1.5 pl-8 pr-3 text-xs text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={aiFundLoading || !aiFundQuery.trim()}
            className="rounded-lg border border-teal-400/40 bg-teal-400/15 px-3 py-1.5 text-xs font-semibold text-teal-200 hover:bg-teal-400/25 disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            {aiFundLoading ? 'Searching…' : 'Search Live Calls'}
          </button>
        </form>
        {aiFundError && (
          <div className="mt-2.5 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
            {aiFundError}
          </div>
        )}
        {aiFundResult && (
          <div className="mt-3 rounded-lg border border-white/10 bg-[#070f1b] p-3.5 text-xs">
            <div className="whitespace-pre-line leading-relaxed text-slate-200">
              {aiFundResult.answer}
            </div>
            {aiFundResult.sources.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-white/10 pt-2">
                {aiFundResult.sources.map((s) => (
                  <a
                    key={s.uri}
                    href={s.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded border border-teal-400/30 bg-teal-400/10 px-2 py-0.5 text-[11px] text-teal-200 hover:bg-teal-400/20"
                  >
                    <span className="max-w-[200px] truncate">{s.title}</span>
                    <ArrowUpRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span className="font-mono-num">
          {filtered.length} of {providers.length} providers · illustrative
        </span>
        {(search ||
          category !== 'all' ||
          instrument !== 'all' ||
          stage !== 'all' ||
          confidence !== 'all' ||
          segment !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCategory('all');
              setInstrument('all');
              setStage('all');
              setConfidence('all');
              setSegment('all');
              onClearInitialSearch?.();
            }}
            className="font-semibold text-teal-300 hover:text-teal-200"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Providers Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((c) => (
            <article
              key={c.id}
              className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0b1424] p-6"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-violet-300">
                      <span>{c.category}</span>
                      {c.nontraditionalTag && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-300">{c.nontraditionalTag}</span>
                        </>
                      )}
                    </div>
                    <h3 className="mt-0.5 text-base font-semibold text-slate-100">
                      {c.name}
                    </h3>
                    <div className="mt-0.5 text-xs text-slate-400">{c.type}</div>
                  </div>
                  <EvidenceText level={c.confidence} />
                </div>

                <p className="mt-3 text-sm text-slate-300">{c.desc}</p>

                <div className="mt-2.5 text-xs text-slate-400">
                  Stages:{' '}
                  <span className="text-slate-200">
                    {c.stages.map((s) => STAGE_LABEL[s] || s).join(' · ')}
                  </span>
                  <span className="mx-1.5" aria-hidden="true">
                    /
                  </span>
                  Geographies:{' '}
                  <span className="text-slate-200">{c.geographies.join(', ')}</span>
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
                      {c.sectors.join(', ')}
                    </dd>
                  </div>
                </dl>

                <p className="mt-3 text-xs leading-relaxed text-slate-300">
                  <strong className="text-slate-100">Eligibility:</strong> {c.legal}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <span>
                  Source: {c.source} · Verified {c.verified}
                </span>
                {c.officialUrl && (
                  <a
                    href={c.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-teal-300 hover:text-teal-200"
                  >
                    <span>Official portal</span>
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-[#0b1424] p-12 text-center">
          <h3 className="text-base font-semibold text-slate-100">
            No providers match the current filters
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Adjust search keywords or clear category, segment, and stage filters.
          </p>
        </div>
      )}

      {/* Database Growth Methodology */}
      <div className="rounded-xl border border-teal-400/20 bg-teal-400/[0.04] p-6">
        <h3 className="text-sm font-semibold text-teal-300">
          How the provider database grows
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          1) <strong className="text-slate-100">Seed non-traditional capital</strong> from
          sub-sovereign preparation facilities, Arab/Islamic DFIs, South-South ECAs, local-currency
          guarantors, and climate/carbon funds — tagged with evidence provenance. 2){' '}
          <strong className="text-slate-100">Import in bulk</strong> via CSV (columns: name,
          category, type, ticket, currency, geographies, sectors, stages, description, eligibility,
          source). 3) <strong className="text-slate-100">Self-register</strong> mandates
          directly. 4) <strong className="text-slate-100">Live Official Portal Discovery</strong>{' '}
          surfaces fresh DFI and catalytic funding windows via web-grounded search.
        </p>
      </div>
    </section>
  );
}
