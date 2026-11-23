import React from 'react';
import { STAGE_LABEL } from '../data/capitalData';
import type { Project, TabId } from '../types/capital';
import { fmtM } from '../utils/finance';
import { ReadinessMeter, SectionHeader } from './SharedUI';

interface ProjectsViewProps {
  projects: Record<string, Project>;
  activeProjectId: string;
  onOpenWorkspace: (id: string) => void;
  onViewMatches: (id: string) => void;
  onOpenNewProject: () => void;
  onNavigate?: (tab: TabId) => void;
}

export function ProjectsView({
  projects,
  activeProjectId,
  onOpenWorkspace,
  onViewMatches,
  onOpenNewProject,
  onNavigate,
}: ProjectsViewProps) {
  const list = Object.values(projects);

  return (
    <section aria-labelledby="projects-heading">
      <SectionHeader
        title="My projects"
        hint="Register early-stage concepts or import official AU Agenda 2063, DFI & National pipelines"
        action={
          <div className="flex flex-wrap gap-2">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('pipelines')}
                className="rounded-lg border border-white/15 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-teal-400/40 hover:text-teal-200 whitespace-nowrap shrink-0"
              >
                Import AU / DFI Project
              </button>
            )}
            <button
              type="button"
              onClick={onOpenNewProject}
              className="rounded-lg bg-teal-400 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-teal-300 whitespace-nowrap shrink-0"
            >
              + New project
            </button>
          </div>
        }
      />

      <div className="grid gap-5 md:grid-cols-2">
        {list.map((p) => {
          const isCurrent = p.id === activeProjectId;
          return (
            <article
              key={p.id}
              className={`rounded-xl border p-6 transition-colors ${
                isCurrent
                  ? 'border-teal-400/35 bg-[#0d192b]'
                  : 'border-white/10 bg-[#0b1424] hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>{p.jurisdiction}</span>
                    <span aria-hidden="true">·</span>
                    <span>{p.sector}</span>
                    {isCurrent && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-teal-300">Active workspace</span>
                      </>
                    )}
                  </div>
                  <h3 className="mt-1.5 text-lg font-semibold text-slate-100">
                    {p.name}
                  </h3>
                </div>
                <ReadinessMeter score={p.readiness} />
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-300">{p.desc}</p>

              <dl className="mt-5 grid grid-cols-3 gap-4 border-y border-white/8 py-3.5">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Stage
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-100">
                    {STAGE_LABEL[p.stage]}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Capex
                  </dt>
                  <dd className="font-mono-num mt-1 text-sm font-semibold text-slate-100">
                    {p.currency === 'ZAR' ? 'R' : ''}
                    {fmtM(p.capex)}m
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Updated
                  </dt>
                  <dd className="font-mono-num mt-1 text-sm font-semibold text-slate-300">
                    {p.updated}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap gap-3">
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
    </section>
  );
}
