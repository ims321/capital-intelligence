import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Building2,
  FolderPlus,
  Globe2,
  Landmark,
  Search,
  Sparkles,
} from 'lucide-react';
import { STAGE_LABEL } from '../data/capitalData';
import {
  OFFICIAL_PIPELINE_PROJECTS,
  OFFICIAL_PIPELINE_SOURCES,
} from '../data/continentalProjects';
import type { OfficialPipelineProject } from '../types/capital';
import { filterOfficialPipelines } from '../utils/templates';
import { SectionHeader } from './SharedUI';

interface ContinentalPipelineViewProps {
  onImportOfficialProject: (official: OfficialPipelineProject) => void;
  onExploreOverlookedProvider: (providerKeyword: string) => void;
}

const RECS = ['all', 'SADC', 'EAC', 'ECOWAS', 'COMESA', 'North Africa', 'Continental'];

const OFFICIAL_PORTALS = [
  { name: 'AU Agenda 2063 Flagships', url: 'https://au.int/en/agenda2063/flagship-projects' },
  { name: 'AUDA-NEPAD PIDA VP', url: 'https://www.au-pida.org/' },
  { name: 'AfDB Projects & Operations', url: 'https://www.afdb.org/en/projects-and-operations' },
  { name: 'World Bank Projects', url: 'https://projects.worldbank.org/en/projects-operations/projects-home' },
  { name: 'Infrastructure South Africa', url: 'https://infrastructure.gov.za/' },
  { name: 'Kenya PPP Directorate', url: 'https://www.pppunit.go.ke/' },
  { name: 'Nigeria ICRC PPP Portal', url: 'https://www.icrc.gov.ng/projects/' },
  { name: 'DBSA Project Hub', url: 'https://www.dbsa.org/projects' },
];

export function ContinentalPipelineView({
  onImportOfficialProject,
  onExploreOverlookedProvider,
}: ContinentalPipelineViewProps) {
  const [search, setSearch] = useState('');
  const [sourceCategory, setSourceCategory] = useState('all');
  const [rec, setRec] = useState('all');
  const [sector, setSector] = useState('all');
  const [stage, setStage] = useState('all');

  // Live Google-Search grounded portal lookup
  const [liveQuery, setLiveQuery] = useState('');
  const [liveCountry, setLiveCountry] = useState('Africa');
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveResult, setLiveResult] = useState<{
    answer: string;
    sources: Array<{ title: string; uri: string }>;
  } | null>(null);

  const filtered = useMemo(
    () =>
      filterOfficialPipelines(OFFICIAL_PIPELINE_PROJECTS, {
        search,
        sourceCategory,
        rec,
        sector,
        stage,
      }),
    [search, sourceCategory, rec, sector, stage]
  );

  const handleLiveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveQuery.trim()) return;
    setLiveLoading(true);
    setLiveError(null);
    try {
      const res = await fetch('/api/official-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: liveQuery.trim(),
          scope: 'projects',
          country: liveCountry,
          sector: sector === 'all' ? 'All infrastructure sectors' : sector,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLiveError(data.error || 'Unable to query official portals.');
        setLiveResult(null);
      } else {
        setLiveResult(data);
      }
    } catch {
      setLiveError('Network error reaching official portal search service.');
    } finally {
      setLiveLoading(false);
    }
  };

  return (
    <section aria-labelledby="pipelines-heading" className="space-y-6">
      <SectionHeader
        title="AU Agenda 2063, DFI & National Official Pipelines"
        hint="Verified continental, multilateral, and national infrastructure pipelines — import directly into your Workspace"
      />

      {/* Official Source Quick-Verify Strip */}
      <div className="rounded-xl border border-white/10 bg-[#0b1424] p-4">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-300">
            <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
            Direct Official Institutional Portals
          </span>
          <span className="text-[11px] text-slate-400">
            Opens primary AUDA-NEPAD, DFI &amp; National Ministry registries in a new tab
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {OFFICIAL_PORTALS.map((portal) => (
            <a
              key={portal.name}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-teal-400/50 hover:text-teal-200"
            >
              <span>{portal.name}</span>
              <ArrowUpRight className="h-3 w-3 text-slate-400" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>

      {/* Live Official Portal Discovery (Grounded Search) */}
      <div className="rounded-xl border border-teal-400/20 bg-gradient-to-br from-[#0b1829] to-[#08121f] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-300">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Live Official Portal &amp; Agenda 2063 Tender Search
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Query live AUDA-NEPAD PIDA, AfDB, World Bank, and National PPP websites via grounded search.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              'AUDA-NEPAD PIDA water transport 2026',
              'Kenya PPP Directorate open road water tenders',
              'South Africa Infrastructure SA gazetted SIPs',
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setLiveQuery(preset)}
                className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300 hover:border-teal-400/40 hover:text-teal-200"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLiveSearch} className="mt-3 flex flex-wrap gap-2">
          <div className="relative min-w-[240px] flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="text"
              value={liveQuery}
              onChange={(e) => setLiveQuery(e.target.value)}
              placeholder="Search live official portals (e.g. PIDA SADC rail, AfDB green hydro call, Nigeria ICRC)..."
              className="w-full rounded-lg border border-white/12 bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
            />
          </div>
          <select
            aria-label="Live search geography"
            value={liveCountry}
            onChange={(e) => setLiveCountry(e.target.value)}
            className="rounded-lg border border-white/12 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
          >
            <option value="Africa">Pan-African</option>
            <option value="South Africa">South Africa</option>
            <option value="Kenya">Kenya</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Zambia">Zambia</option>
            <option value="DRC">DRC</option>
            <option value="Ghana">Ghana</option>
            <option value="Senegal">Senegal</option>
            <option value="Morocco">Morocco</option>
            <option value="Egypt">Egypt</option>
          </select>
          <button
            type="submit"
            disabled={liveLoading || !liveQuery.trim()}
            className="rounded-lg bg-teal-400 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-teal-300 disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            {liveLoading ? 'Searching portals…' : 'Search Official Sites'}
          </button>
        </form>

        {liveError && (
          <div
            role="alert"
            className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3.5 py-2.5 text-xs text-amber-200"
          >
            {liveError}
          </div>
        )}

        {liveResult && (
          <div className="mt-4 rounded-lg border border-white/10 bg-[#070f1b] p-4">
            <div className="whitespace-pre-line text-sm leading-relaxed text-slate-200">
              {liveResult.answer}
            </div>
            {liveResult.sources.length > 0 && (
              <div className="mt-3 border-t border-white/10 pt-3">
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Grounded Official Sources
                </div>
                <div className="flex flex-wrap gap-2">
                  {liveResult.sources.map((src) => (
                    <a
                      key={src.uri}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded border border-teal-400/30 bg-teal-400/10 px-2.5 py-1 text-xs font-medium text-teal-200 hover:bg-teal-400/20"
                    >
                      <span className="max-w-[260px] truncate">{src.title}</span>
                      <ArrowUpRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Authority Summary Tiles */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setSourceCategory('all')}
          className={`rounded-xl border p-4 text-left transition-colors ${
            sourceCategory === 'all'
              ? 'border-teal-400 bg-teal-400/12'
              : 'border-white/10 bg-[#0b1424] hover:border-white/20'
          }`}
        >
          <div className="font-mono-num text-2xl font-bold text-slate-100">
            {OFFICIAL_PIPELINE_PROJECTS.length}
          </div>
          <div className="mt-1 text-xs font-semibold text-slate-300">
            All official pipeline records
          </div>
        </button>

        {OFFICIAL_PIPELINE_SOURCES.map((src) => {
          const count = OFFICIAL_PIPELINE_PROJECTS.filter(
            (p) => p.sourceCategory === src
          ).length;
          const active = sourceCategory === src;
          return (
            <button
              key={src}
              type="button"
              onClick={() => setSourceCategory(src)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                active
                  ? 'border-teal-400 bg-teal-400/12'
                  : 'border-white/10 bg-[#0b1424] hover:border-white/20'
              }`}
            >
              <div className="font-mono-num text-2xl font-bold text-slate-100">
                {count}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                {src === 'AU Agenda 2063 / PIDA' ? (
                  <Landmark className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                ) : src === 'Multilateral / DFI' ? (
                  <Globe2 className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" />
                ) : (
                  <Building2 className="h-3.5 w-3.5 text-sky-300" aria-hidden="true" />
                )}
                <span>{src}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="grid gap-3 rounded-xl border border-white/10 bg-[#0b1424] p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="pipe-search"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Search projects or countries
          </label>
          <input
            id="pipe-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Lobito, Inga, Kenya, desalination..."
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="pipe-rec"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Regional Economic Community
          </label>
          <select
            id="pipe-rec"
            value={rec}
            onChange={(e) => setRec(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
          >
            {RECS.map((r) => (
              <option key={r} value={r}>
                {r === 'all' ? 'All African regions / RECs' : r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="pipe-sector"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Sector
          </label>
          <select
            id="pipe-sector"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
          >
            <option value="all">All sectors</option>
            <option value="Water">Water &amp; sanitation</option>
            <option value="Renewable energy">Renewable energy</option>
            <option value="Transport">Transport / logistics</option>
            <option value="Climate">Climate adaptation</option>
            <option value="Municipal">Digital / Municipal</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="pipe-stage"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Lifecycle stage
          </label>
          <select
            id="pipe-stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
          >
            <option value="all">All stages</option>
            <option value="feasibility">Feasibility</option>
            <option value="structuring">Structuring</option>
            <option value="transaction">Transaction</option>
          </select>
        </div>
      </div>

      <div className="font-mono-num text-xs text-slate-400">
        {filtered.length} official listings matched across AUDA-NEPAD, DFI &amp; National agencies
      </div>

      {/* Pipeline Cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0b1424] p-6"
          >
            <div>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span
                  className={`text-xs font-semibold ${
                    item.sourceCategory === 'AU Agenda 2063 / PIDA'
                      ? 'text-amber-300'
                      : item.sourceCategory === 'Multilateral / DFI'
                        ? 'text-teal-300'
                        : 'text-sky-300'
                  }`}
                >
                  {item.sourceCategory} · {item.rec}
                </span>
                <span className="font-mono-num text-xs font-semibold text-slate-300">
                  {STAGE_LABEL[item.stage]} · ~USD {item.capexUsdM.toLocaleString()}m
                </span>
              </div>

              <h3 className="mt-1.5 text-lg font-semibold leading-snug text-slate-100">
                {item.name}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                {item.authorityName} · <strong className="text-slate-200">{item.country}</strong>
              </p>

              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {item.summary}
              </p>

              <div className="mt-4 rounded-lg border border-white/8 bg-[#08111e] p-3 text-xs">
                <div className="font-semibold uppercase tracking-wider text-slate-400">
                  Financing Gap &amp; Mandate Alignment
                </div>
                <p className="mt-1 text-slate-200">{item.financingGap}</p>
                <p className="mt-1 text-[11px] text-slate-400">{item.agendaAlignment}</p>
              </div>

              <div className="mt-3">
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Overlooked &amp; Blended Windows (click to inspect in Capital Explorer)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.recommendedOverlookedCapital.map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => onExploreOverlookedProvider(cap)}
                      className="rounded border border-violet-400/25 bg-violet-400/10 px-2 py-0.5 text-[11px] font-medium text-violet-200 hover:border-violet-400/60 hover:bg-violet-400/20"
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
              <a
                href={item.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-300 hover:text-teal-200"
              >
                <span>View official listing</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={() => onImportOfficialProject(item)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-400 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-teal-300 whitespace-nowrap shrink-0"
              >
                <FolderPlus className="h-3.5 w-3.5" aria-hidden="true" />
                Clone into Workspace
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
