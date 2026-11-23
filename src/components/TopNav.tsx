import React from 'react';
import { JURISDICTION_OPTIONS } from '../data/capitalData';
import type { Role, TabId } from '../types/capital';

export const TABS_BORROWER: Array<{ id: TabId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'My projects' },
  { id: 'pipelines', label: 'AU & DFI' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'legal', label: 'Legal & fiscal' },
  { id: 'scenarios', label: 'Scenarios' },
  { id: 'matches', label: 'Matches' },
  { id: 'dealroom', label: 'Deal rooms' },
  { id: 'capital', label: 'Capital explorer' },
  { id: 'flows', label: 'Flows' },
  { id: 'map', label: 'Flows map' },
  { id: 'guide', label: 'User guide' },
];

export const TABS_PROVIDER: Array<{ id: TabId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'mandate', label: 'My mandate' },
  { id: 'opps', label: 'Opportunities' },
  { id: 'pipelines', label: 'AU & DFI' },
  { id: 'pipeline', label: 'My pipeline' },
  { id: 'dealroom', label: 'Deal rooms' },
  { id: 'capital', label: 'Capital explorer' },
  { id: 'flows', label: 'Flows' },
  { id: 'map', label: 'Flows map' },
  { id: 'guide', label: 'User guide' },
];

interface TopNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  role: Role;
  onChangeRole: (role: Role) => void;
  jurisdiction: string;
  onChangeJurisdiction: (j: string) => void;
  onOpenTutorial: () => void;
}

export function TopNav({
  activeTab,
  onSelectTab,
  role,
  onChangeRole,
  jurisdiction,
  onChangeJurisdiction,
  onOpenTutorial,
}: TopNavProps) {
  const tabs = role === 'borrower' ? TABS_BORROWER : TABS_PROVIDER;
  const primaryWorkspaceTab: TabId = role === 'borrower' ? 'workspace' : 'opps';

  return (
    <div className="md:sticky md:top-0 z-40 border-b border-white/10 bg-[#060c16]/92 backdrop-blur-xl">
      {/* Zone-strict 3-zone top bar */}
      <header className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-2.5 lg:px-6">
        <button
          type="button"
          onClick={() => onSelectTab('overview')}
          className="font-display text-lg font-semibold tracking-tight text-slate-100 whitespace-nowrap shrink-0 hover:text-teal-200 transition-colors"
        >
          Capital Intelligence
        </button>

        <nav
          aria-label="Primary sections"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400"
        >
          <button
            type="button"
            onClick={() => onSelectTab('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 ${
              activeTab === 'overview' ? 'text-teal-300' : ''
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => onSelectTab(primaryWorkspaceTab)}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 ${
              activeTab === primaryWorkspaceTab ||
              activeTab === 'projects' ||
              activeTab === 'legal' ||
              activeTab === 'scenarios' ||
              activeTab === 'matches' ||
              activeTab === 'mandate'
                ? 'text-teal-300'
                : ''
            }`}
          >
            Workspace
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('pipelines')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 ${
              activeTab === 'pipelines' ? 'text-teal-300' : ''
            }`}
          >
            AU &amp; DFI Pipelines
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('capital')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 ${
              activeTab === 'capital' ? 'text-teal-300' : ''
            }`}
          >
            Capital Explorer
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('map')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-teal-300 ${
              activeTab === 'map' ? 'text-teal-300' : ''
            }`}
          >
            Flows Map
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('guide')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-100 ${
              activeTab === 'guide' ? 'text-teal-300' : ''
            }`}
          >
            User Guide
          </button>
        </nav>

        <div className="shrink-0">
          {activeTab === 'overview' ? (
            <button
              type="button"
              onClick={() => onSelectTab(primaryWorkspaceTab)}
              className="rounded-lg bg-teal-400 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-teal-300 whitespace-nowrap shrink-0"
            >
              Enter Workspace
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenTutorial}
              className="rounded-lg border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-100 transition-colors hover:bg-white/10 whitespace-nowrap shrink-0"
            >
              Tutorial
            </button>
          )}
        </div>
      </header>

      {/* Secondary Workspace Context & Sub-navigation bar */}
      <div className="border-t border-white/6 bg-[#09111f]/90">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-1.5 lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:px-6">
          <div
            role="tablist"
            aria-label="Platform views"
            className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto py-0.5"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectTab(tab.id)}
                  className={`rounded-md px-1.5 py-1 text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-teal-400/15 text-teal-300'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div
              role="group"
              aria-label="Platform role"
              className="flex items-center rounded-lg border border-white/10 bg-white/[0.03] p-0.5"
            >
              <button
                type="button"
                onClick={() => onChangeRole('borrower')}
                className={`rounded-md px-2.5 py-0.5 text-[11.5px] font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  role === 'borrower'
                    ? 'bg-teal-400/20 text-teal-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Borrower
              </button>
              <button
                type="button"
                onClick={() => onChangeRole('provider')}
                className={`rounded-md px-2.5 py-0.5 text-[11.5px] font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  role === 'provider'
                    ? 'bg-teal-400/20 text-teal-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Capital provider
              </button>
            </div>

            <div className="flex items-center">
              <label htmlFor="jurisdiction-select" className="sr-only">
                Jurisdiction
              </label>
              <select
                id="jurisdiction-select"
                value={jurisdiction}
                onChange={(e) => onChangeJurisdiction(e.target.value)}
                className="max-w-[180px] truncate rounded-lg border border-white/10 bg-[#0d1728] px-2 py-1 text-[11px] font-medium text-slate-200 focus:border-teal-400/50 focus:outline-none"
              >
                {JURISDICTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
