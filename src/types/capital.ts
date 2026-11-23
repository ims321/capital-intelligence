export type Role = 'borrower' | 'provider';

export type TabId =
  | 'overview'
  | 'projects'
  | 'workspace'
  | 'legal'
  | 'scenarios'
  | 'matches'
  | 'dealroom'
  | 'pipelines'
  | 'capital'
  | 'flows'
  | 'map'
  | 'mandate'
  | 'opps'
  | 'pipeline'
  | 'guide';

export type StageKey =
  | 'concept'
  | 'feasibility'
  | 'structuring'
  | 'transaction'
  | 'construction'
  | 'ops';

export type ConfidenceLevel =
  | 'verified'
  | 'published'
  | 'open'
  | 'precedent'
  | 'mandate'
  | 'inferred';

export type EngagementStatus = 'none' | 'interest' | 'nda' | 'terms' | 'closed';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export type GapStatus = 'Open' | 'In progress' | 'Closed';

export interface CapitalProvider {
  id: string;
  name: string;
  category: string;
  type: string;
  desc: string;
  ticket: string;
  currency: string;
  stages: StageKey[];
  sectors: string[];
  confidence: ConfidenceLevel;
  legal: string;
  source: string;
  verified: string;
  geographies: string[];
  overlooked?: boolean;
  nontraditionalTag?: string;
  officialUrl?: string;
}

export interface ProjectStage {
  name: string;
  key: StageKey;
  status: 'complete' | 'active' | 'pending';
  activities: string[];
  outputs: string;
  completedActivities?: string[];
}

export interface ProjectGap {
  gap: string;
  severity: SeverityLevel;
  stage: string;
  remedy: string;
  status: GapStatus;
}

export interface Project {
  id: string;
  name: string;
  sector: string;
  jurisdiction: string;
  stage: StageKey;
  capex: number;
  currency: string;
  updated: string;
  readiness: number;
  desc: string;
  stages: ProjectStage[];
  gaps: ProjectGap[];
}

export interface DealRoomMessage {
  id: string;
  author: string;
  date: string;
  text: string;
}

export type DealDocumentKind =
  | 'nda'
  | 'rfi'
  | 'termsheet'
  | 'closememo'
  | 'dataroom_doc';

export interface ExecutedDocRecord {
  docKind: DealDocumentKind;
  title: string;
  signatory: string;
  signatoryTitle: string;
  counterpartyRep: string;
  governingLaw: string;
  executedAt: string;
  referenceCode: string;
}

export interface Engagement {
  status: EngagementStatus;
  date: string;
  note: string;
  qaLog?: DealRoomMessage[];
  auditTrail?: { date: string; event: string }[];
  executedDocs?: Partial<Record<DealDocumentKind, ExecutedDocRecord>>;
}

export type OfficialPipelineSource =
  | 'AU Agenda 2063 / PIDA'
  | 'Multilateral / DFI'
  | 'National Official Agency';

export interface OfficialPipelineProject {
  id: string;
  name: string;
  sourceCategory: OfficialPipelineSource;
  authorityName: string;
  officialUrl: string;
  country: string;
  jurisdictionKey: string;
  rec: 'SADC' | 'EAC' | 'ECOWAS' | 'COMESA' | 'ECCAS' | 'North Africa' | 'Continental';
  sector: string;
  stage: StageKey;
  capexUsdM: number;
  financingGap: string;
  summary: string;
  agendaAlignment: string;
  recommendedOverlookedCapital: string[];
  lastVerified: string;
}

export type LegalRuleStatus =
  | 'prohibition'
  | 'conditional'
  | 'approval'
  | 'allowed'
  | 'unsettled';

export interface LegalRule {
  q: string;
  status: LegalRuleStatus;
  cite: string;
  note: string;
  reviewed: string;
}

export interface JurisdictionLegalProfile {
  summary: string;
  rules: LegalRule[];
}

export interface ScenarioComponent {
  label: string;
  amount: number;
  rate: number;
  years: number;
  grace: number;
  ccy: string;
  fl?: number;
  grant?: boolean;
}

export interface FinancingScenario {
  id: string;
  name: string;
  desc: string;
  components: ScenarioComponent[];
  legal: string;
  time: string;
  recommended?: boolean;
}

export interface ScenarioResult {
  annual: number;
  total: number;
  fxExposed: number;
  debt: number;
  grant: number;
  interest: number;
}

export type FlowInstrumentType = 'dfi' | 'commercial' | 'eca' | 'grant';

export interface FlowArc {
  from: string;
  to: string;
  vol: number;
  type: FlowInstrumentType;
  sector?: string;
}

export interface FlowInstrumentShare {
  name: string;
  pct: number;
  color: string;
}

export interface FlowDriver {
  title: string;
  text: string;
}

export interface TransactionRecord {
  project: string;
  country: string;
  providers: string;
  structure: string;
  amount: string;
  year: string;
  status: 'Closed' | 'Implementation' | 'Preparation';
}

export interface ProviderMandate {
  institution: string;
  type: string;
  ticketSize: string;
  geographies: string;
  sectors: string[];
  notes: string;
}
