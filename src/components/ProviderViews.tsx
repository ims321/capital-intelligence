import React, { useMemo, useState } from 'react';
import { STAGE_LABEL } from '../data/capitalData';
import type {
  CapitalProvider,
  Engagement,
  Project,
  ProviderMandate,
  TabId,
} from '../types/capital';
import { fmtM } from '../utils/finance';
import { EngagementText, ReadinessMeter, SectionHeader } from './SharedUI';

const ALL_SECTORS = [
  'Water',
  'Renewable energy',
  'Transport',
  'Climate adaptation',
  'Sanitation',
  'Health',
];

export function MandateView({
  mandate,
  onSaveMandate,
  onPreviewOpportunities,
}: {
  mandate: ProviderMandate;
  onSaveMandate: (m: ProviderMandate) => void;
  onPreviewOpportunities: () => void;
}) {
  const [draft, setDraft] = useState<ProviderMandate>(mandate);

  const toggleSector = (sec: string) => {
    setDraft((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(sec)
        ? prev.sectors.filter((s) => s !== sec)
        : [...prev.sectors, sec],
    }));
  };

  return (
    <section aria-labelledby="mandate-heading" className="space-y-6">
      <SectionHeader
        title="My mandate & preferences"
        hint="Defines which African infrastructure opportunities surface in your feed"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSaveMandate(draft);
        }}
        className="rounded-xl border border-white/10 bg-[#0b1424] p-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="mandate-inst"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Institution
            </label>
            <input
              id="mandate-inst"
              type="text"
              value={draft.institution}
              onChange={(e) =>
                setDraft({ ...draft, institution: e.target.value })
              }
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="mandate-type"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Institution type
            </label>
            <select
              id="mandate-type"
              value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2.5 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
            >
              <option>DFI / Multilateral</option>
              <option>Infrastructure fund</option>
              <option>Commercial bank</option>
              <option>ECA</option>
              <option>Climate fund</option>
              <option>Pension fund</option>
              <option>Sovereign wealth fund</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="mandate-ticket"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Ticket size (USD m)
            </label>
            <input
              id="mandate-ticket"
              type="text"
              value={draft.ticketSize}
              onChange={(e) =>
                setDraft({ ...draft, ticketSize: e.target.value })
              }
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="mandate-geo"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Target geographies
            </label>
            <input
              id="mandate-geo"
              type="text"
              value={draft.geographies}
              onChange={(e) =>
                setDraft({ ...draft, geographies: e.target.value })
              }
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Target sectors
            </span>
            <div className="flex flex-wrap gap-2">
              {ALL_SECTORS.map((sec) => {
                const active = draft.sectors.includes(sec);
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => toggleSector(sec)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'border-teal-400/60 bg-teal-400/15 text-teal-200'
                        : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sec}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="mandate-notes"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Risk &amp; return notes
            </label>
            <textarea
              id="mandate-notes"
              rows={3}
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-lg bg-teal-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-teal-300 whitespace-nowrap shrink-0"
          >
            Save mandate
          </button>
          <button
            type="button"
            onClick={() => {
              onSaveMandate(draft);
              onPreviewOpportunities();
            }}
            className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5 whitespace-nowrap shrink-0"
          >
            Preview matching opportunities
          </button>
        </div>
      </form>
    </section>
  );
}

export function OpportunitiesView({
  projects,
  mandate,
  onOpenEngageProject,
}: {
  projects: Record<string, Project>;
  mandate: ProviderMandate;
  onOpenEngageProject: (projId: string, projName: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('all');
  const [stage, setStage] = useState('all');
  const [minReadiness, setMinReadiness] = useState(0);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return Object.values(projects).filter((p) => {
      const hay = `${p.name} ${p.sector} ${p.jurisdiction}`.toLowerCase();
      return (
        (!q || hay.includes(q)) &&
        (country === 'all' || p.jurisdiction.includes(country)) &&
        (stage === 'all' || p.stage === stage) &&
        p.readiness >= minReadiness
      );
    });
  }, [projects, search, country, stage, minReadiness]);

  return (
    <section aria-labelledby="opps-heading" className="space-y-6">
      <SectionHeader
        title="Matching opportunities"
        hint={`Filtered against ${mandate.institution} · Readiness & legal compatibility visible`}
      />

      <div className="grid gap-3 rounded-xl border border-white/10 bg-[#0b1424] p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="opp-search"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Search
          </label>
          <input
            id="opp-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Project, sector..."
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="opp-country"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Country
          </label>
          <select
            id="opp-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
          >
            <option value="all">All countries</option>
            <option>South Africa</option>
            <option>Kenya</option>
            <option>Zambia</option>
            <option>DRC</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="opp-stage"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Stage
          </label>
          <select
            id="opp-stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
          >
            <option value="all">All stages</option>
            <option value="concept">Concept</option>
            <option value="feasibility">Feasibility</option>
            <option value="structuring">Structuring</option>
            <option value="transaction">Transaction</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="opp-ready"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Min. readiness
          </label>
          <select
            id="opp-ready"
            value={minReadiness}
            onChange={(e) => setMinReadiness(Number(e.target.value))}
            className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
          >
            <option value={0}>Any readiness</option>
            <option value={50}>50+</option>
            <option value={70}>70+</option>
          </select>
        </div>
      </div>

      <div className="font-mono-num text-xs text-slate-400">
        {list.length} opportunities · illustrative
      </div>

      {list.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {list.map((p) => (
            <article
              key={p.id}
              className="rounded-xl border border-white/10 bg-[#0b1424] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400">
                    {p.jurisdiction} · {p.sector}
                  </div>
                  <h3 className="mt-1 text-base font-semibold text-slate-100">
                    {p.name}
                  </h3>
                </div>
                <ReadinessMeter score={p.readiness} />
              </div>

              <p className="mt-3 text-sm text-slate-300">{p.desc}</p>

              <dl className="mt-4 grid grid-cols-3 gap-3 border-y border-white/8 py-3">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Stage
                  </dt>
                  <dd className="mt-0.5 text-xs font-semibold text-slate-100">
                    {STAGE_LABEL[p.stage]}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Capex
                  </dt>
                  <dd className="font-mono-num mt-0.5 text-xs font-semibold text-slate-100">
                    {p.currency === 'ZAR' ? 'R' : ''}
                    {fmtM(p.capex)}m
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Updated
                  </dt>
                  <dd className="font-mono-num mt-0.5 text-xs font-semibold text-slate-300">
                    {p.updated}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpenEngageProject(p.id, p.name)}
                  className="rounded-lg bg-teal-400 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-300 whitespace-nowrap shrink-0"
                >
                  Express interest
                </button>
                <button
                  type="button"
                  onClick={() => onOpenEngageProject(p.id, p.name)}
                  className="rounded-lg border border-white/15 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5 whitespace-nowrap shrink-0"
                >
                  Request info
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-[#0b1424] p-12 text-center">
          <h3 className="text-base font-semibold text-slate-100">
            No matching opportunities
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Broaden country, stage, or minimum readiness filters.
          </p>
        </div>
      )}
    </section>
  );
}

export function PipelineView({
  projects,
  capitalProviders,
  engagements,
  onNavigate,
}: {
  projects: Record<string, Project>;
  capitalProviders: CapitalProvider[];
  engagements: Record<string, Engagement>;
  onNavigate: (tab: TabId) => void;
}) {
  const items = Object.entries(engagements).filter(
    ([, eng]) => eng.status !== 'none'
  );

  return (
    <section aria-labelledby="pipeline-heading" className="space-y-6">
      <SectionHeader
        title="My engagement pipeline"
        hint="Track active borrower counterparties from initial interest through NDA and terms"
      />

      {items.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#0b1424] p-12 text-center">
          <h3 className="text-base font-semibold text-slate-100">
            Pipeline empty
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Express interest on matching opportunities to populate your pipeline.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(([key, eng]) => {
            const [pid, cid] = key.split('-');
            const p = projects[pid];
            const c = capitalProviders.find((x) => x.id === cid);
            return (
              <div
                key={key}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0b1424] p-5"
              >
                <div>
                  <h3 className="text-base font-semibold text-slate-100">
                    {p ? p.name : pid}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {c ? c.name : cid} <span aria-hidden="true">·</span>{' '}
                    <span className="font-mono-num">{eng.date}</span>
                  </p>
                  {eng.note && (
                    <p className="mt-2 text-sm text-slate-300">{eng.note}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <EngagementText status={eng.status} />
                  <button
                    type="button"
                    onClick={() => onNavigate('dealroom')}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5 whitespace-nowrap shrink-0"
                  >
                    Open deal room
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
