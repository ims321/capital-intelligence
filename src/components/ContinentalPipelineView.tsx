import React, { useMemo, useState } from 'react';
import {
  Building2,
  Database,
  Download,
  Globe2,
  Landmark,
  Layers,
} from 'lucide-react';
import { STAGE_LABEL } from '../data/capitalData';
import { OFFICIAL_PIPELINE_SOURCES } from '../data/continentalProjects';
import type { Project } from '../types/capital';
import { fmtM } from '../utils/finance';
import { ReadinessMeter, SectionHeader } from './SharedUI';

interface ContinentalPipelineViewProps {
  projects: Record<string, Project>;
  activeProjectId: string;
  onOpenWorkspace: (projectId: string) => void;
  onViewMatches: (projectId: string) => void;
  onExploreOverlookedProvider: (providerKeyword: string) => void;
  onOpenNewProject: () => void;
}

const RECS = [
  'all',
  'SADC',
  'EAC',
  'ECOWAS',
  'COMESA',
  'ECCAS',
  'North Africa',
  'Continental',
];

export function ContinentalPipelineView({
  projects,
  activeProjectId,
  onOpenWorkspace,
  onViewMatches,
  onExploreOverlookedProvider,
  onOpenNewProject,
}: ContinentalPipelineViewProps) {
  const [search, setSearch] = useState('');
  const [sourceCategory, setSourceCategory] = useState('all');
  const [rec, setRec] = useState('all');
  const [sector, setSector] = useState('all');
  const [stage, setStage] = useState('all');

  const sourcedProjects = useMemo(
    () => Object.values(projects).filter((p) => Boolean(p.sourceCategory)),
    [projects]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sourcedProjects.filter((item) => {
      const hay = `${item.name} ${item.jurisdiction} ${item.authorityName || ''} ${item.sector} ${item.desc} ${item.agendaAlignment || ''}`.toLowerCase();
      return (
        (!q || hay.includes(q)) &&
        (sourceCategory === 'all' || item.sourceCategory === sourceCategory) &&
        (rec === 'all' || item.rec === rec) &&
        (sector === 'all' ||
          item.sector.toLowerCase().includes(sector.toLowerCase())) &&
        (stage === 'all' || item.stage === stage)
      );
    });
  }, [sourcedProjects, search, sourceCategory, rec, sector, stage]);

  const handleExportCSV = () => {
    const headers = [
      'id',
      'name',
      'sourceCategory',
      'authorityName',
      'jurisdiction',
      'rec',
      'sector',
      'stage',
      'capex_usd',
      'readiness',
      'updated',
    ];
    const escapeCell = (v: unknown) => {
      const s = String(v ?? '');
      return s.includes(',') || s.includes('"') || s.includes('\n')
        ? `"${s.replaceAll('"', '""')}"`
        : s;
    };
    const rows = [
      headers.join(','),
      ...filtered.map((p) =>
        [
          p.id,
          p.name,
          p.sourceCategory,
          p.authorityName,
          p.jurisdiction,
          p.rec,
          p.sector,
          p.stage,
          p.capex,
          p.readiness,
          p.updated,
        ]
          .map(escapeCell)
          .join(',')
      ),
    ];
    const blob = new Blob([rows.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'au-dfi-national-projects-database.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section aria-labelledby="pipelines-heading" className="space-y-6">
      <SectionHeader
        title="AU Agenda 2063, DFI & National Project Database"
        hint="Projects sourced from AUDA-NEPAD PIDA PAP-2, AfDB, World Bank, DBSA, EIB & national PPP agencies — stored natively in our Project format"
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/5 whitespace-nowrap shrink-0"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={onOpenNewProject}
              className="rounded-lg bg-teal-400 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-teal-300 whitespace-nowrap shrink-0"
            >
              + Add project
            </button>
          </div>
        }
      />

      {/* Database Origin Summary Tiles */}
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
            {sourcedProjects.length}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Database className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" />
            <span>All sourced database records</span>
          </div>
        </button>

        {OFFICIAL_PIPELINE_SOURCES.map((src) => {
          const count = sourcedProjects.filter(
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
            Search projects, countries or agencies
          </label>
          <input
            id="pipe-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Lobito, Mambilla, Inga, uMkhomazi, Kenya..."
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

      <div className="flex flex-wrap items-center justify-between gap-2 font-mono-num text-xs text-slate-400">
        <span>
          {filtered.length} of {sourcedProjects.length} sourced database records · full
          lifecycle stages, gaps &amp; scoring populated
        </span>
        <span className="inline-flex items-center gap-1.5 text-teal-300">
          <Layers className="h-3.5 w-3.5" aria-hidden="true" />
          Native Project Format · 0 external redirects
        </span>
      </div>

      {/* Native Project Cards */}
      {filtered.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((p) => {
            const isCurrent = p.id === activeProjectId;
            const openGapCount = p.gaps.filter((g) => g.status !== 'Closed').length;
            return (
              <article
                key={p.id}
                className={`flex flex-col justify-between rounded-xl border p-6 transition-colors ${
                  isCurrent
                    ? 'border-teal-400/40 bg-[#0d192b]'
                    : 'border-white/10 bg-[#0b1424] hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`font-semibold ${
                            p.sourceCategory === 'AU Agenda 2063 / PIDA'
                              ? 'text-amber-300'
                              : p.sourceCategory === 'Multilateral / DFI'
                                ? 'text-teal-300'
                                : 'text-sky-300'
                          }`}
                        >
                          {p.sourceCategory} · {p.rec}
                        </span>
                        {isCurrent && (
                          <span className="rounded bg-teal-400/15 px-1.5 py-0.5 text-[10px] font-semibold text-teal-300">
                            Active workspace
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1.5 text-lg font-semibold leading-snug text-slate-100">
                        {p.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        {p.jurisdiction} · {p.sector}
                      </p>
                      {p.authorityName && (
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Registry: {p.authorityName}
                        </p>
                      )}
                    </div>
                    <ReadinessMeter score={p.readiness} />
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {p.desc}
                  </p>

                  {/* Native Project Metrics Strip */}
                  <dl className="mt-4 grid grid-cols-4 gap-3 border-y border-white/8 py-3">
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Stage
                      </dt>
                      <dd className="mt-1 text-xs font-semibold text-slate-100">
                        {STAGE_LABEL[p.stage]}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Capex
                      </dt>
                      <dd className="font-mono-num mt-1 text-xs font-semibold text-slate-100">
                        {p.currency} {fmtM(p.capex)}m
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Gaps
                      </dt>
                      <dd className="font-mono-num mt-1 text-xs font-semibold text-amber-300">
                        {openGapCount} tracked
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Reviewed
                      </dt>
                      <dd className="font-mono-num mt-1 text-xs font-semibold text-slate-300">
                        {p.updated}
                      </dd>
                    </div>
                  </dl>

                  {p.financingGap && (
                    <div className="mt-3.5 rounded-lg border border-white/8 bg-[#08111e] p-3 text-xs">
                      <div className="font-semibold uppercase tracking-wider text-slate-400">
                        Primary Bankability Gap &amp; Alignment
                      </div>
                      <p className="mt-1 text-slate-200">{p.financingGap}</p>
                      {p.agendaAlignment && (
                        <p className="mt-1 text-[11px] text-slate-400">
                          {p.agendaAlignment}
                        </p>
                      )}
                    </div>
                  )}

                  {p.recommendedOverlookedCapital &&
                    p.recommendedOverlookedCapital.length > 0 && (
                      <div className="mt-3">
                        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Matched Overlooked Capital Windows (inspect in Explorer)
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {p.recommendedOverlookedCapital.map((cap) => (
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
                    )}
                </div>

                <div className="mt-5 flex flex-wrap gap-3 border-t border-white/8 pt-4">
                  <button
                    type="button"
                    onClick={() => onOpenWorkspace(p.id)}
                    className="rounded-lg bg-teal-400 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-teal-300 whitespace-nowrap shrink-0"
                  >
                    Open workspace
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewMatches(p.id)}
                    className="rounded-lg border border-white/15 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/5 whitespace-nowrap shrink-0"
                  >
                    View matches
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-[#0b1424] p-12 text-center">
          <h3 className="text-base font-semibold text-slate-100">
            No sourced projects match these filters
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Clear your search or select All African regions / sectors.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSourceCategory('all');
              setRec('all');
              setSector('all');
              setStage('all');
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
