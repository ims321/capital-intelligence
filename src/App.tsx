import React, { useMemo, useState } from 'react';
import {
  CAT_DEF,
  CATS,
  INITIAL_CAPITAL,
  INITIAL_ENGAGEMENTS,
  INITIAL_MANDATE,
  INITIAL_PROJECTS,
  JURISDICTION_OPTIONS,
} from './data/capitalData';
import type {
  CapitalProvider,
  Engagement,
  EngagementStatus,
  ExecutedDocRecord,
  GapStatus,
  Project,
  ProviderMandate,
  Role,
  StageKey,
  TabId,
} from './types/capital';
import { TopNav, TABS_BORROWER, TABS_PROVIDER } from './components/TopNav';
import { LandingView } from './components/LandingView';
import { ProjectsView } from './components/ProjectsView';
import { WorkspaceView } from './components/WorkspaceView';
import { LegalView } from './components/LegalView';
import { ScenariosView } from './components/ScenariosView';
import { MatchesView } from './components/MatchesView';
import { DealRoomView } from './components/DealRoomView';
import { ContinentalPipelineView } from './components/ContinentalPipelineView';
import { CapitalExplorerView } from './components/CapitalExplorerView';
import { FlowsView } from './components/FlowsView';
import { FlowsMapView } from './components/FlowsMapView';
import {
  MandateView,
  OpportunitiesView,
  PipelineView,
} from './components/ProviderViews';
import { GuideView } from './components/GuideView';
import {
  AddProviderModal,
  EngageModal,
  NewProjectModal,
  TutorialModal,
} from './components/Modals';
import { CapitalGuideWidget } from './components/CapitalGuideWidget';
import { ToastBanner } from './components/SharedUI';

function resolveInitialTab(): { tab: TabId; role: Role } {
  if (typeof window === 'undefined') {
    return { tab: 'overview', role: 'borrower' };
  }
  const params = new URLSearchParams(window.location.search);
  const roleParam = params.get('role') === 'provider' ? 'provider' : 'borrower';
  const tabParam = params.get('tab') as TabId | null;
  if (tabParam) {
    return { tab: tabParam, role: roleParam };
  }
  if (params.get('autostart') === '1') {
    return {
      tab: roleParam === 'provider' ? 'opps' : 'workspace',
      role: roleParam,
    };
  }
  return { tab: 'overview', role: roleParam };
}

export default function App() {
  const initial = useMemo(() => resolveInitialTab(), []);

  const [role, setRole] = useState<Role>(initial.role);
  const [activeTab, setActiveTab] = useState<TabId>(initial.tab);
  const [jurisdiction, setJurisdiction] = useState<string>('za-muni');

  const [projects, setProjects] =
    useState<Record<string, Project>>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>('p1');
  const [capitalProviders, setCapitalProviders] =
    useState<CapitalProvider[]>(INITIAL_CAPITAL);
  const [engagements, setEngagements] =
    useState<Record<string, Engagement>>(INITIAL_ENGAGEMENTS);
  const [mandate, setMandate] = useState<ProviderMandate>(INITIAL_MANDATE);

  // Cross-view map & explorer integration state
  const [focusedMapCountry, setFocusedMapCountry] = useState<string | null>(
    null
  );
  const [explorerGeoSearch, setExplorerGeoSearch] = useState<string>('');

  // Modals & UI feedback
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [addProviderOpen, setAddProviderOpen] = useState(false);
  const [engageTarget, setEngageTarget] = useState<{
    type: 'capital' | 'project';
    id: string;
    name: string;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
  };

  const handleChangeRole = (nextRole: Role) => {
    setRole(nextRole);
    const validTabs = (
      nextRole === 'borrower' ? TABS_BORROWER : TABS_PROVIDER
    ).map((t) => t.id);
    if (!validTabs.includes(activeTab)) {
      setActiveTab('overview');
    }
  };

  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterRole = (nextRole: Role, targetTab: TabId) => {
    setRole(nextRole);
    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateProject = (input: {
    name: string;
    sector: string;
    stage: StageKey;
    capexM: number;
    desc: string;
  }) => {
    const id = `p${Object.keys(projects).length + 1}`;
    const jurisdictionLabel =
      JURISDICTION_OPTIONS.find((j) => j.value === jurisdiction)?.label ||
      'South Africa — Local Municipality';

    const newProj: Project = {
      id,
      name: input.name,
      sector: input.sector,
      jurisdiction: jurisdictionLabel,
      stage: input.stage,
      capex: input.capexM * 1e6,
      currency: 'ZAR',
      updated: '2026-11-22',
      readiness: input.stage === 'concept' ? 18 : 35,
      desc: input.desc,
      stages: [],
      gaps: [
        {
          gap: 'Initial legal & fiscal authority verification',
          severity: 'critical',
          stage: 'Concept',
          remedy: 'Complete Legal & fiscal check for jurisdiction',
          status: 'Open',
        },
      ],
    };

    setProjects((prev) => ({ ...prev, [id]: newProj }));
    setActiveProjectId(id);
    setActiveTab('workspace');
    showToast(`Project "${input.name}" created in workspace.`);
  };

  const handleToggleActivity = (
    projectId: string,
    stageKey: string,
    activity: string
  ) => {
    setProjects((prev) => {
      const proj = prev[projectId];
      if (!proj) return prev;
      const updatedStages = proj.stages.map((s) => {
        if (s.key !== stageKey) return s;
        const curr = s.completedActivities || [];
        const next = curr.includes(activity)
          ? curr.filter((a) => a !== activity)
          : [...curr, activity];
        return { ...s, completedActivities: next };
      });
      return {
        ...prev,
        [projectId]: {
          ...proj,
          stages: updatedStages,
          readiness: Math.min(98, proj.readiness + 2),
        },
      };
    });
  };

  const handleCycleGapStatus = (projectId: string, gapIndex: number) => {
    const order: GapStatus[] = ['Open', 'In progress', 'Closed'];
    setProjects((prev) => {
      const proj = prev[projectId];
      if (!proj) return prev;
      const updatedGaps = proj.gaps.map((g, i) => {
        if (i !== gapIndex) return g;
        const nextStatus = order[(order.indexOf(g.status) + 1) % order.length];
        return { ...g, status: nextStatus };
      });
      const closedCount = updatedGaps.filter((g) => g.status === 'Closed').length;
      const readinessBump = closedCount * 6;
      return {
        ...prev,
        [projectId]: {
          ...proj,
          gaps: updatedGaps,
          readiness: Math.min(96, Math.max(15, 36 + readinessBump)),
        },
      };
    });
  };

  const handleAddProvider = (input: {
    name: string;
    category: string;
    type: string;
    ticket: string;
    geographies: string;
    sectors: string;
    desc: string;
  }) => {
    const ci = CATS.indexOf(input.category);
    const D = Object.values(CAT_DEF).find((d) => d.c === ci) || CAT_DEF.PE;
    const geos = input.geographies
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const secs = input.sectors
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newProvider: CapitalProvider = {
      id: `c${capitalProviders.length + 1}u`,
      name: input.name,
      category: input.category,
      type: input.type,
      desc: input.desc || D.d,
      ticket: input.ticket,
      currency: 'Multi',
      stages: D.stg,
      sectors: secs.length ? secs : ['Energy'],
      confidence: 'mandate',
      legal: D.legal,
      source: 'User-submitted — pending verification',
      verified: '2026-11-22',
      geographies: geos.length ? geos : ['Africa'],
    };

    setCapitalProviders((prev) => [newProvider, ...prev]);
    showToast(`Added "${input.name}" to Capital Explorer.`);
  };

  const handleImportProviders = (imported: CapitalProvider[]) => {
    if (!imported.length) {
      showToast('No valid provider rows found in CSV.');
      return;
    }
    setCapitalProviders((prev) => [...imported, ...prev]);
    showToast(`Imported ${imported.length} providers from CSV.`);
  };

  const handleSubmitEngage = (
    action: 'interest' | 'nda' | 'rfi',
    note: string
  ) => {
    if (!engageTarget) return;
    const key =
      engageTarget.type === 'capital'
        ? `${activeProjectId}-${engageTarget.id}`
        : `${engageTarget.id}-c13`;

    const nextStatus: EngagementStatus = action === 'nda' ? 'nda' : 'interest';
    const label =
      action === 'nda'
        ? 'NDA & data room requested'
        : action === 'rfi'
          ? 'Information request submitted'
          : 'Interest expressed';

    setEngagements((prev) => {
      const existing = prev[key];
      return {
        ...prev,
        [key]: {
          status: nextStatus,
          date: '2026-11-22',
          note: note || label,
          qaLog: existing?.qaLog || [],
          auditTrail: [
            ...(existing?.auditTrail || []),
            { date: '2026-11-22', event: `${label} (${engageTarget.name})` },
          ],
        },
      };
    });

    showToast(`${label} for ${engageTarget.name}.`);
  };

  const handleExecuteDealDocument = (
    key: string,
    record: ExecutedDocRecord,
    nextStatus?: EngagementStatus
  ) => {
    const labels: Record<EngagementStatus, string> = {
      none: 'Reset',
      interest: 'Interest expressed',
      nda: 'Mutual NDA signed & data room unlocked',
      terms: 'Indicative Term Sheet issued',
      closed: 'Signed Financial Close recorded',
    };

    setEngagements((prev) => {
      const existing = prev[key];
      if (!existing) return prev;
      const updatedStatus = nextStatus || existing.status;
      const eventText = `${record.title} (${record.referenceCode}) executed by ${record.signatory}`;
      return {
        ...prev,
        [key]: {
          ...existing,
          status: updatedStatus,
          date: record.executedAt,
          executedDocs: {
            ...(existing.executedDocs || {}),
            [record.docKind]: record,
          },
          auditTrail: [
            ...(existing.auditTrail || []),
            { date: record.executedAt, event: eventText },
          ],
        },
      };
    });

    if (nextStatus) {
      showToast(`${labels[nextStatus]} (${record.referenceCode})`);
    } else {
      showToast(`Document ${record.referenceCode} logged to audit trail.`);
    }
  };

  const handlePostDealMessage = (key: string, text: string) => {
    setEngagements((prev) => {
      const existing = prev[key];
      if (!existing) return prev;
      const author = role === 'borrower' ? 'Borrower PMO' : mandate.institution;
      return {
        ...prev,
        [key]: {
          ...existing,
          qaLog: [
            ...(existing.qaLog || []),
            {
              id: `msg-${Date.now()}`,
              author,
              date: '2026-11-22',
              text,
            },
          ],
        },
      };
    });
    showToast('Q&A entry posted to deal room.');
  };

  const activeProject = projects[activeProjectId] || Object.values(projects)[0];
  const engagementCount = Object.values(engagements).filter(
    (e) => e.status !== 'none'
  ).length;

  return (
    <div className="flex min-h-screen flex-col bg-[#060c16] text-slate-100">
      <TopNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        role={role}
        onChangeRole={handleChangeRole}
        jurisdiction={jurisdiction}
        onChangeJurisdiction={setJurisdiction}
        onOpenTutorial={() => setTutorialOpen(true)}
      />

      <main className="mx-auto w-full max-w-[1360px] flex-1 px-6 py-8">
        {activeTab === 'overview' && (
          <LandingView
            projectCount={Object.keys(projects).length}
            providerCount={capitalProviders.length}
            engagementCount={engagementCount}
            onNavigate={handleSelectTab}
            onEnterRole={handleEnterRole}
            onFocusMapCountry={(countryKey) => {
              setFocusedMapCountry(countryKey);
              handleSelectTab('map');
            }}
            onOpenProjectWorkspace={(projId) => {
              setRole('borrower');
              setActiveProjectId(projId);
              handleSelectTab('workspace');
            }}
            onOpenTutorial={() => setTutorialOpen(true)}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            activeProjectId={activeProjectId}
            onOpenWorkspace={(id) => {
              setActiveProjectId(id);
              handleSelectTab('workspace');
            }}
            onViewMatches={(id) => {
              setActiveProjectId(id);
              handleSelectTab('matches');
            }}
            onOpenNewProject={() => setNewProjectOpen(true)}
            onNavigate={handleSelectTab}
          />
        )}

        {activeTab === 'pipelines' && (
          <ContinentalPipelineView
            projects={projects}
            activeProjectId={activeProjectId}
            onOpenWorkspace={(id) => {
              setRole('borrower');
              setActiveProjectId(id);
              handleSelectTab('workspace');
            }}
            onViewMatches={(id) => {
              setRole('borrower');
              setActiveProjectId(id);
              handleSelectTab('matches');
            }}
            onExploreOverlookedProvider={(providerKeyword) => {
              setExplorerGeoSearch(providerKeyword);
              handleSelectTab('capital');
            }}
            onOpenNewProject={() => setNewProjectOpen(true)}
          />
        )}

        {activeTab === 'workspace' && (
          <WorkspaceView
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={setActiveProjectId}
            capitalProviders={capitalProviders}
            onToggleActivity={handleToggleActivity}
            onCycleGapStatus={handleCycleGapStatus}
            onNavigate={handleSelectTab}
          />
        )}

        {activeTab === 'legal' && (
          <LegalView
            jurisdiction={jurisdiction}
            onChangeJurisdiction={setJurisdiction}
          />
        )}

        {activeTab === 'scenarios' && <ScenariosView />}

        {activeTab === 'matches' && activeProject && (
          <MatchesView
            project={activeProject}
            capitalProviders={capitalProviders}
            engagements={engagements}
            onOpenEngage={(capId, capName) =>
              setEngageTarget({ type: 'capital', id: capId, name: capName })
            }
            onNavigate={handleSelectTab}
          />
        )}

        {activeTab === 'dealroom' && (
          <DealRoomView
            projects={projects}
            capitalProviders={capitalProviders}
            engagements={engagements}
            onExecuteDocument={handleExecuteDealDocument}
            onPostMessage={handlePostDealMessage}
          />
        )}

        {activeTab === 'capital' && (
          <CapitalExplorerView
            providers={capitalProviders}
            initialSearch={explorerGeoSearch}
            onClearInitialSearch={() => setExplorerGeoSearch('')}
            onOpenAddProvider={() => setAddProviderOpen(true)}
            onImportProviders={handleImportProviders}
          />
        )}

        {activeTab === 'flows' && <FlowsView onNavigate={handleSelectTab} />}

        {activeTab === 'map' && (
          <FlowsMapView
            providers={capitalProviders}
            focusedCountry={focusedMapCountry}
            onFocusCountry={setFocusedMapCountry}
            onExploreProvidersForCountry={(countryName) => {
              setExplorerGeoSearch(countryName);
              handleSelectTab('capital');
            }}
            onInspectLegalForJurisdiction={(jKey) => {
              setRole('borrower');
              setJurisdiction(jKey);
              handleSelectTab('legal');
            }}
            onOpenProjectWorkspace={(projId) => {
              setRole('borrower');
              setActiveProjectId(projId);
              handleSelectTab('workspace');
            }}
          />
        )}

        {activeTab === 'mandate' && (
          <MandateView
            mandate={mandate}
            onSaveMandate={(m) => {
              setMandate(m);
              showToast('Capital provider mandate preferences saved.');
            }}
            onPreviewOpportunities={() => handleSelectTab('opps')}
          />
        )}

        {activeTab === 'opps' && (
          <OpportunitiesView
            projects={projects}
            mandate={mandate}
            onOpenEngageProject={(projId, projName) =>
              setEngageTarget({ type: 'project', id: projId, name: projName })
            }
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineView
            projects={projects}
            capitalProviders={capitalProviders}
            engagements={engagements}
            onNavigate={handleSelectTab}
          />
        )}

        {activeTab === 'guide' && <GuideView />}
      </main>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-slate-500">
        Capital Intelligence · Infrastructure funding platform · Illustrative
        data only. Not a feasibility study, legal opinion, investment memorandum
        or claim of committed capital.
      </footer>

      <CapitalGuideWidget
        activeTab={activeTab}
        role={role}
        activeProject={activeProject}
        jurisdiction={jurisdiction}
        focusedCountry={focusedMapCountry}
        onNavigate={handleSelectTab}
      />

      <NewProjectModal
        open={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        onCreate={handleCreateProject}
      />

      <AddProviderModal
        open={addProviderOpen}
        onClose={() => setAddProviderOpen(false)}
        onAdd={handleAddProvider}
      />

      <EngageModal
        target={engageTarget}
        onClose={() => setEngageTarget(null)}
        onSubmit={handleSubmitEngage}
      />

      <TutorialModal
        open={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
      />

      <ToastBanner message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
