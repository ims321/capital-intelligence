import React, { useEffect, useState } from 'react';
import { STAGE_LABEL, STAGE_ORDER } from '../data/capitalData';
import type {
  CapitalProvider,
  GapStatus,
  Project,
  ProjectStage,
  TabId,
} from '../types/capital';
import { fmtM } from '../utils/finance';
import { ImpactDashboard } from './ImpactDashboard';
import { EvidenceText, ReadinessMeter, SectionHeader, SeverityText } from './SharedUI';

interface WorkspaceViewProps {
  projects: Record<string, Project>;
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  capitalProviders: CapitalProvider[];
  onToggleActivity: (projectId: string, stageKey: string, activity: string) => void;
  onCycleGapStatus: (projectId: string, gapIndex: number) => void;
  onNavigate: (tab: TabId) => void;
}

export function WorkspaceView({
  projects,
  activeProjectId,
  onSelectProject,
  capitalProviders,
  onToggleActivity,
  onCycleGapStatus,
  onNavigate,
}: WorkspaceViewProps) {
  const project = projects[activeProjectId] || Object.values(projects)[0];

  const stages: ProjectStage[] =
    project && project.stages.length > 0
      ? project.stages
      : STAGE_ORDER.map((key) => ({
          name: STAGE_LABEL[key],
          key,
          status:
            project && key === project.stage
              ? 'active'
              : project &&
                  STAGE_ORDER.indexOf(key) < STAGE_ORDER.indexOf(project.stage)
                ? 'complete'
                : 'pending',
          activities: ['Stage scoping & institutional alignment'],
          completedActivities: [],
          outputs: 'Draft baseline captured in session.',
        }));

  const defaultStageIndex = Math.max(
    0,
    stages.findIndex((s) => s.status === 'active')
  );
  const [selectedStageIdx, setSelectedStageIdx] = useState(defaultStageIndex);

  useEffect(() => {
    setSelectedStageIdx(
      Math.max(
        0,
        stages.findIndex((s) => s.status === 'active')
      )
    );
  }, [activeProjectId]);

  if (!project) return null;

  const currentStage = stages[selectedStageIdx] || stages[0];
  const stageFunding = capitalProviders
    .filter((c) => c.stages.includes(currentStage.key))
    .slice(0, 4);

  const openGaps = project.gaps.filter((g) => g.status !== 'Closed').length;
  const criticalGaps = project.gaps.filter(
    (g) => g.severity === 'critical' && g.status !== 'Closed'
  ).length;

  const gapButtonTone: Record<GapStatus, string> = {
    Open: 'border-rose-400/30 text-rose-200 hover:bg-rose-400/10',
    'In progress': 'border-amber-400/30 text-amber-200 hover:bg-amber-400/10',
    Closed: 'border-teal-400/30 text-teal-200 hover:bg-teal-400/10',
  };

  return (
    <section aria-labelledby="workspace-heading" className="space-y-8">
      <div className="rounded-xl border border-white/10 bg-[#0b1424] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>
                {project.sourceCategory
                  ? `${project.sourceCategory} · ${project.authorityName}`
                  : 'Illustrative project workspace'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{project.jurisdiction}</span>
              <span aria-hidden="true">·</span>
              <span>{project.sector}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">
                {project.currency === 'ZAR' ? 'R' : `${project.currency} `}
                {fmtM(project.capex)}m
              </span>
            </div>
            <h2
              id="workspace-heading"
              className="font-display text-2xl font-medium text-slate-100"
            >
              {project.name}
            </h2>
          </div>

          <div className="flex w-full min-w-0 items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-4">
            <div className="min-w-0 flex-1 sm:flex-none">
              <label htmlFor="ws-project-select" className="sr-only">
                Active project
              </label>
              <select
                id="ws-project-select"
                value={project.id}
                onChange={(e) => onSelectProject(e.target.value)}
                className="w-full max-w-full truncate rounded-lg border border-white/15 bg-[#07101d] px-3 py-2 text-xs font-medium text-slate-200 focus:border-teal-400/50 focus:outline-none sm:max-w-[300px]"
              >
                {Object.values(projects).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <ReadinessMeter score={project.readiness} />
          </div>
        </div>
      </div>

      {/* 6-Stage Lifecycle Stepper */}
      <div>
        <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider">
            Project Lifecycle Stages
          </span>
          <span>Click any stage to inspect required activities &amp; stage-matched capital</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stages.map((s, idx) => {
            const isSelected = idx === selectedStageIdx;
            const statusLabel =
              s.status === 'complete'
                ? 'Complete'
                : s.status === 'active'
                  ? 'In progress'
                  : 'Not started';
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSelectedStageIdx(idx)}
                className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? 'border-teal-400 bg-teal-400/10'
                    : s.status === 'complete'
                      ? 'border-teal-400/25 bg-teal-400/[0.04] hover:border-teal-400/45'
                      : 'border-white/10 bg-[#0b1424] hover:border-white/20'
                }`}
              >
                <span className="font-mono-num text-[11px] font-semibold text-slate-400">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="mt-1 text-xs font-semibold text-slate-100">
                  {s.name}
                </span>
                <span
                  className={`mt-2 text-[10px] font-semibold uppercase tracking-wider ${
                    s.status === 'complete' || s.status === 'active'
                      ? 'text-teal-300'
                      : 'text-slate-500'
                  }`}
                >
                  {statusLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Activities + Stage-Matched Capital */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-[#0b1424] p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Stage {selectedStageIdx + 1}: {currentStage.name}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Check off completed deliverables to update workspace progress.
          </p>

          <ul className="mt-4 divide-y divide-white/8">
            {currentStage.activities.map((act) => {
              const checked = (currentStage.completedActivities || []).includes(act);
              return (
                <li key={act} className="py-2.5">
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-200 hover:text-white">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        onToggleActivity(project.id, currentStage.key, act)
                      }
                      className="h-4 w-4 rounded border-white/20 bg-white/5 accent-teal-400"
                    />
                    <span className={checked ? 'line-through text-slate-400' : ''}>
                      {act}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 rounded-lg border border-teal-400/20 bg-teal-400/[0.05] p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              Output status
            </h4>
            <p className="mt-1.5 text-sm text-slate-300">
              {currentStage.outputs || '—'}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0b1424] p-6">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Stage-matched capital ({STAGE_LABEL[currentStage.key]})
            </p>
            <button
              type="button"
              onClick={() => onNavigate('matches')}
              className="text-xs font-semibold text-teal-300 hover:text-teal-200 whitespace-nowrap shrink-0"
            >
              View all matches →
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {stageFunding.length > 0 ? (
              stageFunding.map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg border border-white/8 bg-white/[0.02] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <strong className="text-sm font-semibold text-slate-100">
                      {c.name}
                    </strong>
                    <EvidenceText level={c.confidence} />
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {c.type} <span aria-hidden="true">·</span>{' '}
                    <span className="font-mono-num">{c.ticket}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    {c.legal}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">
                No capital facilities matched directly to this stage.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bankability Gap Register */}
      <div>
        <SectionHeader
          title="Bankability gap register"
          hint={`${openGaps} open gaps (${criticalGaps} critical) · Click a status button to update progress`}
        />
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0b1424]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Gap</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Remedy</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {project.gaps.length > 0 ? (
                project.gaps.map((g, idx) => (
                  <tr key={g.gap} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-slate-100">
                      {g.gap}
                    </td>
                    <td className="px-4 py-3">
                      <SeverityText severity={g.severity} />
                    </td>
                    <td className="px-4 py-3 text-slate-300">{g.stage}</td>
                    <td className="px-4 py-3 text-slate-300">{g.remedy}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onCycleGapStatus(project.id, idx)}
                        className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                          gapButtonTone[g.status]
                        }`}
                      >
                        {g.status}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    No bankability gaps registered yet for this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Socioeconomic Impact Dashboard */}
      <ImpactDashboard project={project} />

      {/* Recommended Next Action */}
      <div className="rounded-xl border border-teal-400/20 bg-teal-400/[0.05] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold text-teal-300">
                Recommended next action
              </h3>
              <EvidenceText level="inferred" />
            </div>
            <p className="mt-1.5 text-sm text-slate-200">
              {criticalGaps > 0
                ? `Prioritise closing ${criticalGaps} critical bankability gap(s) using preparation grants while verifying municipal borrowing headroom in Legal & fiscal.`
                : 'Critical gaps addressed — advance to financing scenario comparison and shortlist debt/equity providers in Matches.'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onNavigate('legal')}
              className="rounded-lg border border-white/15 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5 whitespace-nowrap shrink-0"
            >
              Verify legal authority
            </button>
            <button
              type="button"
              onClick={() => onNavigate('scenarios')}
              className="rounded-lg bg-teal-400 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-300 whitespace-nowrap shrink-0"
            >
              Compare scenarios
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
