import type {
  CapitalProvider,
  ConfidenceLevel,
  FinancingScenario,
  FlowArc,
  FlowDriver,
  FlowInstrumentShare,
  FlowInstrumentType,
  JurisdictionLegalProfile,
  LegalRuleStatus,
  Project,
  ProviderMandate,
  StageKey,
  TransactionRecord,
  Engagement,
} from '../types/capital';
import { EXPANDED_NONTRADITIONAL_PROVIDERS } from './expandedProviders';
import { SOURCED_OFFICIAL_PROJECT_MAP } from './continentalProjects';

export const STAGE_ORDER: StageKey[] = [
  'concept',
  'feasibility',
  'structuring',
  'transaction',
  'construction',
  'ops',
];

export const STAGE_LABEL: Record<StageKey, string> = {
  concept: 'Concept',
  feasibility: 'Feasibility',
  structuring: 'Structuring',
  transaction: 'Transaction',
  construction: 'Construction',
  ops: 'Operations',
};

export const CONF_META: Record<
  ConfidenceLevel,
  { label: string; tone: string; description: string }
> = {
  verified: {
    label: 'Verified current',
    tone: 'text-teal-300',
    description: 'Authoritative source, within review period',
  },
  published: {
    label: 'Published programme',
    tone: 'text-sky-300',
    description: 'Official facility; capacity unconfirmed',
  },
  open: {
    label: 'Open funding call',
    tone: 'text-emerald-300',
    description: 'Published window with deadline',
  },
  precedent: {
    label: 'Historical precedent',
    tone: 'text-amber-300',
    description: 'Prior deal — not current availability',
  },
  mandate: {
    label: 'Mandate match',
    tone: 'text-violet-300',
    description: 'Mandate relevant; no allocation confirmed',
  },
  inferred: {
    label: 'Inferred / analytical',
    tone: 'text-slate-300',
    description: 'Analytical assessment — requires human review',
  },
};

export const ENGAGEMENT_META: Record<
  string,
  { label: string; tone: string }
> = {
  none: { label: 'Not engaged', tone: 'text-slate-400' },
  interest: { label: 'Interest expressed', tone: 'text-sky-300' },
  nda: { label: 'NDA active', tone: 'text-amber-300' },
  terms: { label: 'Terms discussion', tone: 'text-teal-300' },
  closed: { label: 'Financial close', tone: 'text-emerald-300' },
};

export const CATS: string[] = [
  'DFI & multilateral lenders',
  'Export credit agencies',
  'Commercial banks & private credit',
  'Private equity & infrastructure funds',
  'Pension funds',
  'Sovereign wealth funds',
  'Family offices',
  'Endowments & foundations',
  'Insurers & asset managers',
  'Climate & guarantee facilities',
  'Grants & preparation facilities',
];

const CORE_CAPITAL: Array<Omit<CapitalProvider, 'category'> & { catIdx: number }> = [
  { id: 'c1', catIdx: 10, name: 'DBSA Project Preparation Fund', type: 'Project preparation', desc: 'Preparation funding for municipal and regional infrastructure.', ticket: 'R5m–R50m', currency: 'ZAR', stages: ['feasibility', 'structuring'], sectors: ['Water', 'Energy', 'Transport'], confidence: 'precedent', legal: 'Available to SA municipalities; recoverable terms may apply.', source: 'DBSA (illustrative)', verified: '2026-08-30', geographies: ['South Africa'] },
  { id: 'c2', catIdx: 10, name: 'AfDB — Africa Water Facility', type: 'Grant / technical assistance', desc: 'Grants for water and sanitation project preparation.', ticket: 'USD 0.5m–5m', currency: 'USD', stages: ['feasibility', 'structuring'], sectors: ['Water', 'Sanitation'], confidence: 'published', legal: 'National endorsement required.', source: 'AfDB (illustrative)', verified: '2026-09-14', geographies: ['Africa'] },
  { id: 'c3', catIdx: 10, name: 'Green Climate Fund — PPF', type: 'Grant / technical assistance', desc: 'Preparation support for climate projects.', ticket: 'Up to USD 1.5m', currency: 'USD', stages: ['feasibility'], sectors: ['Water', 'Climate', 'Energy'], confidence: 'open', legal: 'Accredited entity required.', source: 'GCF (illustrative)', verified: '2026-10-02', geographies: ['Africa', 'Global'] },
  { id: 'c4', catIdx: 0, name: 'World Bank — IPF', type: 'Concessional debt', desc: 'Sovereign or sovereign-guaranteed lending for infrastructure.', ticket: 'USD 20m–200m', currency: 'USD', stages: ['feasibility', 'construction'], sectors: ['Water', 'Sanitation', 'Transport'], confidence: 'mandate', legal: 'Sovereign or guaranteed; municipal via on-lending.', source: 'World Bank (illustrative)', verified: '2026-07-21', geographies: ['Africa', 'Global'] },
  { id: 'c5', catIdx: 0, name: 'IFC — Upstream & Advisory', type: 'Advisory (not capital)', desc: 'Advisory to structure commercially viable projects.', ticket: 'Case-by-case', currency: '—', stages: ['structuring', 'transaction'], sectors: ['Water', 'Energy', 'Transport'], confidence: 'mandate', legal: 'Requires path to commercial viability.', source: 'IFC (illustrative)', verified: '2026-06-30', geographies: ['Africa', 'Global'] },
  { id: 'c6', catIdx: 9, name: 'MIGA — Political Risk', type: 'Guarantee / risk', desc: 'Guarantees and PRI for cross-border investment.', ticket: 'Case-by-case', currency: 'Multi', stages: ['construction', 'ops'], sectors: ['Water', 'Energy', 'Transport'], confidence: 'mandate', legal: 'Structure-dependent for municipal relevance.', source: 'MIGA (illustrative)', verified: '2026-05-18', geographies: ['Africa', 'Global'] },
  { id: 'c7', catIdx: 1, name: 'UKEF — Buyer Credit', type: 'ECA / guarantee', desc: 'Export credit for UK goods and services.', ticket: 'GBP 5m–200m', currency: 'GBP', stages: ['construction'], sectors: ['Water', 'Energy', 'Transport'], confidence: 'published', legal: 'Export content rules; national approval for municipal borrowers.', source: 'UKEF (illustrative)', verified: '2026-09-01', geographies: ['Africa', 'Global'] },
  { id: 'c8', catIdx: 0, name: 'KfW — Concessional Loan', type: 'Concessional debt', desc: 'Below-market lending for water, climate and municipal infrastructure.', ticket: 'EUR 10m–100m', currency: 'EUR', stages: ['construction'], sectors: ['Water', 'Climate', 'Sanitation'], confidence: 'published', legal: 'Typically sovereign or national programme.', source: 'KfW (illustrative)', verified: '2026-08-11', geographies: ['Africa'] },
  { id: 'c9', catIdx: 10, name: 'National Treasury — BFI', type: 'Grant / technical assistance', desc: 'On-budget support for large infrastructure meeting readiness criteria.', ticket: 'ZAR 50m–500m', currency: 'ZAR', stages: ['transaction', 'construction'], sectors: ['Water', 'Energy', 'Transport', 'Health'], confidence: 'published', legal: 'Treasury appraisal; via sponsoring department.', source: 'NT (illustrative)', verified: '2026-10-20', geographies: ['South Africa'] },
  { id: 'c10', catIdx: 2, name: 'Commercial bank syndicate (ZAR)', type: 'Commercial debt', desc: 'Senior ZAR debt subject to credit assessment.', ticket: 'ZAR 50m–500m', currency: 'ZAR', stages: ['construction', 'ops'], sectors: ['Water', 'Energy', 'Transport'], confidence: 'inferred', legal: 'Credit assessment and security; may need provincial approval.', source: 'Analytical', verified: '2026-11-01', geographies: ['South Africa'] },
  { id: 'c11', catIdx: 10, name: 'Municipal Infrastructure Grant', type: 'Grant / technical assistance', desc: 'Conditional national grant for municipal infrastructure.', ticket: 'ZAR 10m–100m', currency: 'ZAR', stages: ['concept', 'construction'], sectors: ['Water', 'Sanitation', 'Roads'], confidence: 'verified', legal: 'Grant conditions and procurement rules apply.', source: 'National framework (illustrative)', verified: '2026-09-25', geographies: ['South Africa'] },
  { id: 'c12', catIdx: 9, name: 'PIDG — InfraCo / GuarantCo', type: 'Guarantee / risk', desc: 'Early-stage development and guarantees to mobilise private capital.', ticket: 'USD 5m–50m', currency: 'USD', stages: ['structuring', 'transaction', 'construction'], sectors: ['Energy', 'Transport', 'Water'], confidence: 'published', legal: 'Focus on pioneering projects.', source: 'PIDG (illustrative)', verified: '2026-08-22', geographies: ['Africa'] },
  { id: 'c13', catIdx: 3, name: 'Climate Fund Managers', type: 'Equity', desc: 'Development and construction equity for renewable energy.', ticket: 'USD 10m–75m', currency: 'USD', stages: ['structuring', 'construction'], sectors: ['Energy', 'Climate'], confidence: 'published', legal: 'Commercial structures; offtake material.', source: 'CFM (illustrative)', verified: '2026-09-10', geographies: ['Africa'] },
  { id: 'c14', catIdx: 0, name: 'AFD / Proparco', type: 'Concessional debt', desc: 'French development finance for sustainable infrastructure.', ticket: 'EUR 10m–100m', currency: 'EUR', stages: ['feasibility', 'construction'], sectors: ['Water', 'Energy', 'Climate'], confidence: 'published', legal: 'Sovereign and non-sovereign windows.', source: 'AFD (illustrative)', verified: '2026-08-05', geographies: ['Africa'] },
  { id: 'c15', catIdx: 0, name: 'DBSA — Lending', type: 'Concessional debt', desc: 'Infrastructure and municipal lending across SADC.', ticket: 'ZAR/USD varied', currency: 'Multi', stages: ['construction'], sectors: ['Water', 'Energy', 'Transport'], confidence: 'published', legal: 'Direct municipal lending within mandate.', source: 'DBSA (illustrative)', verified: '2026-09-12', geographies: ['South Africa', 'SADC'] },
  { id: 'c16', catIdx: 9, name: 'GCF — Funded projects', type: 'Grant / technical assistance', desc: 'Larger climate finance through accredited entities.', ticket: 'USD 10m–250m', currency: 'USD', stages: ['construction'], sectors: ['Climate', 'Energy', 'Water'], confidence: 'published', legal: 'AE and country programme alignment.', source: 'GCF (illustrative)', verified: '2026-10-01', geographies: ['Africa', 'Global'] },
  { id: 'c17', catIdx: 0, name: 'US DFC', type: 'Commercial debt', desc: 'US development finance debt and political risk insurance.', ticket: 'USD 10m–500m', currency: 'USD', stages: ['construction'], sectors: ['Energy', 'Transport', 'Water'], confidence: 'mandate', legal: 'US nexus and development impact criteria.', source: 'DFC (illustrative)', verified: '2026-08-28', geographies: ['Africa'] },
  { id: 'c18', catIdx: 9, name: 'GuarantCo', type: 'Guarantee / risk', desc: 'Local-currency and partial credit guarantees.', ticket: 'USD 5m–50m', currency: 'Multi', stages: ['construction'], sectors: ['Energy', 'Transport', 'Water'], confidence: 'published', legal: 'Local-currency solutions focus.', source: 'GuarantCo (illustrative)', verified: '2026-09-03', geographies: ['Africa'] },
  { id: 'c19', catIdx: 3, name: 'Africa50', type: 'Equity', desc: 'Project development and equity in African infrastructure.', ticket: 'USD 20m–100m', currency: 'USD', stages: ['structuring', 'construction'], sectors: ['Energy', 'Transport'], confidence: 'mandate', legal: 'Commercial equity; often co-invests with DFIs.', source: 'Africa50 (illustrative)', verified: '2026-06-22', geographies: ['Africa'] },
  { id: 'c20', catIdx: 0, name: 'EIB — Global / Africa', type: 'Concessional debt', desc: 'EIB lending and blending for infrastructure outside the EU.', ticket: 'EUR 20m–200m', currency: 'EUR', stages: ['construction'], sectors: ['Energy', 'Transport', 'Water', 'Climate'], confidence: 'mandate', legal: 'Often via sovereign or strong intermediaries.', source: 'EIB (illustrative)', verified: '2026-07-18', geographies: ['Africa'] },
  { id: 'c21', catIdx: 10, name: 'GIF — Project preparation', type: 'Project preparation', desc: 'Upstream project preparation support with MDBs.', ticket: 'USD 0.5m–5m', currency: 'USD', stages: ['feasibility', 'structuring'], sectors: ['Transport', 'Energy', 'Water'], confidence: 'published', legal: 'Typically via MDB partnership.', source: 'GIF (illustrative)', verified: '2026-07-30', geographies: ['Africa', 'Global'] },
  { id: 'c22', catIdx: 1, name: 'SACE (Italy) Export Credit', type: 'ECA / guarantee', desc: 'Italian export credit support.', ticket: 'EUR 5m–150m', currency: 'EUR', stages: ['construction'], sectors: ['Water', 'Energy', 'Transport'], confidence: 'published', legal: 'Export content and procurement rules.', source: 'SACE (illustrative)', verified: '2026-06-15', geographies: ['Africa', 'Global'] },
  { id: 'c23', catIdx: 2, name: 'Private credit fund (illustrative)', type: 'Commercial debt', desc: 'Senior/mezzanine private credit for contracted infrastructure cash flows.', ticket: 'USD 20m–150m', currency: 'USD', stages: ['construction', 'ops'], sectors: ['Energy', 'Transport', 'Water'], confidence: 'inferred', legal: 'Robust security package often required.', source: 'Analytical', verified: '2026-11-05', geographies: ['South Africa', 'Kenya'] },
  { id: 'c24', catIdx: 2, name: 'Standard Bank / local commercial', type: 'Commercial debt', desc: 'ZAR and multi-currency facilities for municipal and project borrowers.', ticket: 'ZAR 30m–400m', currency: 'ZAR', stages: ['construction', 'ops'], sectors: ['Water', 'Energy', 'Transport'], confidence: 'inferred', legal: 'MFMA constraints for municipalities.', source: 'Analytical', verified: '2026-10-28', geographies: ['South Africa'] },
  { id: 'c25', catIdx: 0, name: 'AIIB Infrastructure', type: 'Concessional debt', desc: 'Sustainable infrastructure financing.', ticket: 'USD 50m–300m', currency: 'USD', stages: ['construction'], sectors: ['Transport', 'Energy', 'Water'], confidence: 'mandate', legal: 'Membership and eligibility rules.', source: 'AIIB (illustrative)', verified: '2026-07-05', geographies: ['Africa', 'Global'] },
  { id: 'c26', catIdx: 1, name: 'Japan NEXI / JBIC', type: 'ECA / guarantee', desc: 'Japanese export credit and overseas investment support.', ticket: 'USD/JPY significant', currency: 'Multi', stages: ['construction'], sectors: ['Energy', 'Transport', 'Water'], confidence: 'mandate', legal: 'Often tied to Japanese content.', source: 'NEXI/JBIC (illustrative)', verified: '2026-05-30', geographies: ['Africa', 'Global'] },
  { id: 'c27', catIdx: 10, name: 'Kenya county climate funds', type: 'Grant / technical assistance', desc: 'County-level preparation and small infrastructure support.', ticket: 'KES varied', currency: 'KES', stages: ['concept', 'feasibility', 'construction'], sectors: ['Water', 'Climate'], confidence: 'precedent', legal: 'County fiscal rules apply.', source: 'Illustrative', verified: '2026-04-20', geographies: ['Kenya'] },
  { id: 'c28', catIdx: 10, name: 'Water sector support programme', type: 'Grant / technical assistance', desc: 'Technical assistance for water conservation and NRW reduction.', ticket: 'ZAR 1m–20m', currency: 'ZAR', stages: ['concept', 'feasibility'], sectors: ['Water'], confidence: 'precedent', legal: 'Programme-based; eligibility varies.', source: 'Sector programme (illustrative)', verified: '2026-04-12', geographies: ['South Africa'] },
];

export const CAT_DEF: Record<
  string,
  { c: number; stg: StageKey[]; legal: string; d: string }
> = {
  PE: { c: 3, stg: ['structuring', 'construction', 'ops'], legal: 'Commercial returns required; needs contracted revenues and a bankable sponsor structure.', d: 'Equity investor in infrastructure and energy platforms.' },
  PEN: { c: 4, stg: ['construction', 'ops'], legal: 'Fiduciary and regulatory limits apply; favours operating, inflation-linked or contracted assets.', d: 'Long-dated institutional capital for operating infrastructure.' },
  SWF: { c: 5, stg: ['transaction', 'construction'], legal: 'Strategic or co-investment mandates; often alongside DFIs or sponsors.', d: 'State-backed investor with long horizon and co-investment appetite.' },
  FO: { c: 6, stg: ['structuring', 'construction'], legal: 'Discretionary and relationship-led; smaller tickets, faster decisions.', d: 'Private wealth investing directly or via funds in infrastructure and impact.' },
  END: { c: 7, stg: ['concept', 'feasibility', 'structuring'], legal: 'Mission-aligned; grants, programme-related investments or LP commitments to funds.', d: 'Foundation or endowment capital — catalytic, grant or impact allocation.' },
  INS: { c: 8, stg: ['construction', 'ops'], legal: 'Solvency and asset-liability rules; prefers investment-grade or wrapped long-dated debt.', d: 'Insurance and asset-management balance sheets for long-term infrastructure debt and equity.' },
  DFI: { c: 0, stg: ['feasibility', 'structuring', 'construction'], legal: 'Eligibility, safeguards and sovereign or sponsor requirements apply.', d: 'Development finance institution lending and investing in infrastructure.' },
  BANK: { c: 2, stg: ['construction', 'ops'], legal: 'Credit assessment and security package required.', d: 'Commercial lender to infrastructure and project borrowers.' },
  GRT: { c: 10, stg: ['concept', 'feasibility'], legal: 'Eligibility and application criteria apply.', d: 'Preparation and catalytic grant funding.' },
};

const NEW_ROWS: Array<[string, keyof typeof CAT_DEF, string, string, string, string, string, ConfidenceLevel]> = [
  ['Actis', 'PE', 'Equity', 'USD 50m–300m', 'USD', 'Africa', 'Energy,Climate', 'mandate'],
  ['Helios Investment Partners', 'PE', 'Equity', 'USD 50m–250m', 'USD', 'Africa', 'Energy,Transport', 'mandate'],
  ['Brookfield Infrastructure', 'PE', 'Equity', 'USD 100m–1bn', 'USD', 'Global', 'Energy,Transport', 'mandate'],
  ['Meridiam', 'PE', 'Equity', 'EUR 30m–300m', 'EUR', 'Africa,Global', 'Transport,Water,Energy', 'mandate'],
  ['Macquarie Asset Management', 'PE', 'Equity', 'USD 100m–500m', 'Multi', 'Global', 'Energy,Transport', 'mandate'],
  ['AIIM (Africa Infrastructure Investment Managers)', 'PE', 'Equity', 'USD 30m–150m', 'USD', 'Africa', 'Energy,Transport', 'mandate'],
  ['BlackRock — Global Infrastructure Partners', 'PE', 'Equity', 'USD 150m–1bn', 'USD', 'Global', 'Energy,Transport', 'mandate'],
  ['Public Investment Corporation (PIC)', 'PEN', 'Equity', 'ZAR 200m–5bn', 'ZAR', 'South Africa,SADC', 'Energy,Transport,Water', 'mandate'],
  ['Government Employees Pension Fund (via PIC)', 'PEN', 'Commercial debt', 'ZAR 500m–5bn', 'ZAR', 'South Africa', 'Energy,Transport,Water', 'inferred'],
  ['CDPQ', 'PEN', 'Equity', 'USD 100m–1bn', 'Multi', 'Global', 'Transport,Energy', 'mandate'],
  ['CPP Investments', 'PEN', 'Equity', 'USD 100m–1bn', 'Multi', 'Global', 'Energy,Transport', 'mandate'],
  ['OMERS Infrastructure', 'PEN', 'Equity', 'USD 100m–500m', 'Multi', 'Global', 'Energy,Transport,Water', 'mandate'],
  ['Ontario Teachers’ Pension Plan', 'PEN', 'Equity', 'USD 100m–1bn', 'Multi', 'Global', 'Transport,Energy', 'mandate'],
  ['APG / PGGM (Dutch pension managers)', 'PEN', 'Commercial debt', 'EUR 50m–500m', 'EUR', 'Global', 'Energy,Climate', 'mandate'],
  ['Kenya NSSF / pension schemes', 'PEN', 'Equity', 'KES varied', 'KES', 'Kenya', 'Transport,Energy', 'inferred'],
  ['West African pension funds (PenCom-regulated)', 'PEN', 'Commercial debt', 'USD 10m–100m eq.', 'Multi', 'Africa', 'Energy,Transport', 'inferred'],
  ['Mubadala', 'SWF', 'Equity', 'USD 100m–1bn', 'USD', 'Global,Africa', 'Energy,Transport', 'mandate'],
  ['ADQ', 'SWF', 'Equity', 'USD 100m–1bn', 'USD', 'Global,Africa', 'Energy,Transport', 'mandate'],
  ['Public Investment Fund (PIF)', 'SWF', 'Equity', 'USD 100m–1bn', 'USD', 'Global', 'Energy,Transport', 'mandate'],
  ['GIC', 'SWF', 'Equity', 'USD 100m–1bn', 'USD', 'Global', 'Energy,Transport', 'mandate'],
  ['Temasek', 'SWF', 'Equity', 'USD 100m–1bn', 'USD', 'Global', 'Energy,Climate', 'mandate'],
  ['Qatar Investment Authority', 'SWF', 'Equity', 'USD 100m–1bn', 'USD', 'Global', 'Energy,Transport', 'mandate'],
  ['Nigeria Sovereign Investment Authority (NSIA)', 'SWF', 'Equity', 'USD 20m–200m', 'USD', 'Africa', 'Energy,Transport,Health', 'mandate'],
  ['Ghana Infrastructure Investment Fund (GIIF)', 'SWF', 'Equity', 'USD 10m–100m', 'USD', 'Africa', 'Energy,Transport,Water', 'mandate'],
  ['FONSIS (Senegal)', 'SWF', 'Equity', 'USD 10m–100m', 'USD', 'Africa', 'Energy,Transport', 'inferred'],
  ['Heirs Holdings', 'FO', 'Equity', 'USD 10m–100m', 'USD', 'Africa', 'Energy', 'mandate'],
  ['Gulf family office (archetype)', 'FO', 'Equity', 'USD 10m–100m', 'USD', 'Africa,Global', 'Energy,Transport', 'inferred'],
  ['European multi-family office (archetype)', 'FO', 'Equity', 'EUR 5m–50m', 'EUR', 'Africa,Global', 'Energy,Climate,Water', 'inferred'],
  ['Asian family office (archetype)', 'FO', 'Equity', 'USD 10m–100m', 'USD', 'Africa,Global', 'Energy,Transport', 'inferred'],
  ['Impact-focused single-family office (archetype)', 'FO', 'Equity', 'USD 1m–25m', 'USD', 'Africa', 'Water,Climate,Energy', 'inferred'],
  ['Rockefeller Foundation', 'END', 'Grant / technical assistance', 'USD 1m–20m', 'USD', 'Africa,Global', 'Energy,Climate', 'mandate'],
  ['Gates Foundation', 'END', 'Grant / technical assistance', 'USD 1m–50m', 'USD', 'Africa,Global', 'Sanitation,Health,Water', 'mandate'],
  ['Mastercard Foundation', 'END', 'Grant / technical assistance', 'USD 1m–30m', 'USD', 'Africa', 'Energy,Health', 'mandate'],
  ['Bloomberg Philanthropies', 'END', 'Grant / technical assistance', 'USD 1m–20m', 'USD', 'Global', 'Climate,Transport', 'mandate'],
  ['CIFF (Children’s Investment Fund Foundation)', 'END', 'Grant / technical assistance', 'USD 1m–25m', 'USD', 'Africa,Global', 'Climate,Health', 'mandate'],
  ['University endowment (archetype)', 'END', 'Equity', 'USD 10m–100m', 'USD', 'Global', 'Energy,Climate', 'inferred'],
  ['Old Mutual Alternative Investments', 'INS', 'Equity', 'ZAR 100m–1bn', 'ZAR', 'South Africa,Africa', 'Energy,Transport,Water', 'mandate'],
  ['Sanlam Investments', 'INS', 'Commercial debt', 'ZAR 100m–1bn', 'ZAR', 'South Africa,Africa', 'Energy,Transport', 'mandate'],
  ['Ninety One', 'INS', 'Equity', 'USD 20m–200m', 'USD', 'Africa,Global', 'Energy,Climate', 'mandate'],
  ['Global insurer — infrastructure debt desk (archetype)', 'INS', 'Commercial debt', 'USD 50m–300m', 'USD', 'Global', 'Energy,Transport', 'inferred'],
  ['Norfund', 'DFI', 'Equity', 'USD 10m–100m', 'USD', 'Africa', 'Energy,Climate', 'published'],
  ['FMO', 'DFI', 'Concessional debt', 'USD 10m–100m', 'USD', 'Africa,Global', 'Energy,Water,Transport', 'published'],
  ['British International Investment (BII)', 'DFI', 'Equity', 'USD 10m–150m', 'USD', 'Africa', 'Energy,Transport,Water', 'published'],
  ['DEG (Germany)', 'DFI', 'Concessional debt', 'EUR 10m–100m', 'EUR', 'Africa,Global', 'Energy,Water', 'published'],
  ['Swedfund / Finnfund', 'DFI', 'Equity', 'EUR 5m–50m', 'EUR', 'Africa', 'Energy,Climate', 'published'],
  ['Africa Finance Corporation (AFC)', 'DFI', 'Concessional debt', 'USD 20m–300m', 'USD', 'Africa', 'Energy,Transport', 'published'],
  ['Trade & Development Bank (TDB)', 'DFI', 'Commercial debt', 'USD 10m–150m', 'USD', 'Africa', 'Transport,Energy', 'published'],
  ['Standard Bank CIB', 'BANK', 'Commercial debt', 'ZAR 100m–2bn', 'Multi', 'Africa,South Africa', 'Energy,Transport,Water', 'mandate'],
  ['Absa CIB', 'BANK', 'Commercial debt', 'ZAR 100m–2bn', 'Multi', 'Africa,South Africa', 'Energy,Transport', 'mandate'],
  ['Nedbank CIB', 'BANK', 'Commercial debt', 'ZAR 100m–1.5bn', 'ZAR', 'South Africa', 'Energy,Water,Transport', 'mandate'],
  ['RMB (FirstRand)', 'BANK', 'Commercial debt', 'ZAR 100m–1.5bn', 'Multi', 'Africa,South Africa', 'Energy,Transport', 'mandate'],
];

export const INITIAL_CAPITAL: CapitalProvider[] = [
  ...CORE_CAPITAL.map(({ catIdx, ...rest }) => ({
    ...rest,
    category: CATS[catIdx],
  })),
  ...NEW_ROWS.map((r, i) => {
    const D = CAT_DEF[r[1]];
    return {
      id: 'c' + (29 + i),
      name: r[0],
      category: CATS[D.c],
      type: r[2],
      desc: D.d,
      ticket: r[3],
      currency: r[4],
      stages: D.stg,
      sectors: r[6].split(','),
      confidence: r[7],
      legal: D.legal,
      source: r[0].includes('archetype')
        ? 'Archetype — analytical (not a named institution)'
        : 'Public profile (illustrative) — verify before use',
      verified: '2026-11-20',
      geographies: r[5].split(','),
    };
  }),
  ...EXPANDED_NONTRADITIONAL_PROVIDERS,
];

export const INITIAL_PROJECTS: Record<string, Project> = {
  p1: {
    id: 'p1',
    name: 'Water Treatment Plant Upgrade & NRW Reduction',
    sector: 'Water & sanitation',
    jurisdiction: 'South Africa — Local Municipality',
    stage: 'feasibility',
    capex: 420e6,
    currency: 'ZAR',
    updated: '2026-11-18',
    readiness: 42,
    desc: 'Upgrade of existing works and non-revenue water reduction. Limited engineering and finance capacity.',
    stages: [
      {
        name: 'Concept & identification',
        key: 'concept',
        status: 'complete',
        activities: ['Needs assessment', 'Preliminary options', 'Site identification', 'Institutional mapping'],
        completedActivities: ['Needs assessment', 'Preliminary options', 'Site identification', 'Institutional mapping'],
        outputs: 'Concept note completed. Basic demand estimate exists.',
      },
      {
        name: 'Pre-feasibility & feasibility',
        key: 'feasibility',
        status: 'active',
        activities: ['Technical studies', 'Demand analysis', 'E&S screening', 'Financial model', 'Legal feasibility'],
        completedActivities: ['Demand analysis'],
        outputs: 'Required: full feasibility study and independent water audit.',
      },
      {
        name: 'Structuring & bankability',
        key: 'structuring',
        status: 'pending',
        activities: ['Delivery model options', 'Risk allocation', 'Bankability gap analysis', 'Procurement strategy'],
        completedActivities: [],
        outputs: 'Structuring report, risk register, tariff study.',
      },
      {
        name: 'Transaction & close',
        key: 'transaction',
        status: 'pending',
        activities: ['Lender engagement', 'Due diligence', 'Conditions precedent'],
        completedActivities: [],
        outputs: 'Data room, IM, signed agreements.',
      },
      {
        name: 'Construction',
        key: 'construction',
        status: 'pending',
        activities: ['Construction & commissioning', 'Owner’s engineer', 'Disbursement tracking'],
        completedActivities: [],
        outputs: 'Implementation dashboard.',
      },
      {
        name: 'Operations',
        key: 'ops',
        status: 'pending',
        activities: ['O&M', 'Revenue collection', 'Refinancing'],
        completedActivities: [],
        outputs: 'Operating performance.',
      },
    ],
    gaps: [
      { gap: 'No feasibility study', severity: 'critical', stage: 'Feasibility', remedy: 'Commission via DBSA PPF / AfDB AWF', status: 'Open' },
      { gap: 'Water-loss baseline unverified', severity: 'high', stage: 'Feasibility', remedy: 'Independent water audit', status: 'Open' },
      { gap: 'E&S screening not done', severity: 'high', stage: 'Feasibility', remedy: 'E&S to DFI standards', status: 'Open' },
      { gap: 'Tariff model outdated', severity: 'high', stage: 'Structuring', remedy: 'Tariff & affordability study', status: 'Open' },
      { gap: 'Borrowing headroom unconfirmed', severity: 'critical', stage: 'Concept', remedy: 'Legal & fiscal check', status: 'In progress' },
      { gap: 'Revenue collection at 78%', severity: 'medium', stage: 'Structuring', remedy: 'Revenue enhancement plan', status: 'Open' },
    ],
  },
  p2: {
    id: 'p2',
    name: 'Regional Solar + Storage Programme',
    sector: 'Renewable energy',
    jurisdiction: 'South Africa — Provincial',
    stage: 'structuring',
    capex: 1800e6,
    currency: 'ZAR',
    updated: '2026-11-12',
    readiness: 68,
    desc: 'Portfolio of solar PV with storage. Grid connection and offtake under discussion.',
    stages: [
      { name: 'Concept & identification', key: 'concept', status: 'complete', activities: ['Resource assessment', 'Grid screening'], completedActivities: ['Resource assessment', 'Grid screening'], outputs: 'Concept approved.' },
      { name: 'Pre-feasibility & feasibility', key: 'feasibility', status: 'complete', activities: ['Yield study', 'EIA scoping', 'Financial pre-model'], completedActivities: ['Yield study', 'EIA scoping', 'Financial pre-model'], outputs: 'Feasibility signed off.' },
      { name: 'Structuring & bankability', key: 'structuring', status: 'active', activities: ['PPA offtake term sheet', 'Grid connection agreement', 'Blended equity/debt sizing'], completedActivities: ['Grid connection agreement'], outputs: 'Draft PPA and risk matrix under lender review.' },
      { name: 'Transaction & close', key: 'transaction', status: 'pending', activities: ['RFP & financial close'], completedActivities: [], outputs: 'Pending structuring.' },
      { name: 'Construction', key: 'construction', status: 'pending', activities: ['EPC execution'], completedActivities: [], outputs: '—' },
      { name: 'Operations', key: 'ops', status: 'pending', activities: ['Dispatch & O&M'], completedActivities: [], outputs: '—' },
    ],
    gaps: [
      { gap: 'Municipal offtaker credit enhancement needed', severity: 'high', stage: 'Structuring', remedy: 'Explore GuarantCo partial credit guarantee', status: 'In progress' },
      { gap: 'BESS degradation warranty not locked', severity: 'medium', stage: 'Structuring', remedy: 'Include OEM augmentation wrap in EPC', status: 'Open' },
    ],
  },
  p3: {
    id: 'p3',
    name: 'Secondary City BRT Corridor',
    sector: 'Transport / logistics',
    jurisdiction: 'South Africa — Local Municipality',
    stage: 'concept',
    capex: 950e6,
    currency: 'ZAR',
    updated: '2026-10-30',
    readiness: 22,
    desc: 'BRT corridor linking industrial zone and residential areas. Early concept.',
    stages: [
      { name: 'Concept & identification', key: 'concept', status: 'active', activities: ['Corridor alignment', 'Ridership estimate', 'Institutional mandate check'], completedActivities: ['Corridor alignment'], outputs: 'Draft concept note.' },
      { name: 'Pre-feasibility & feasibility', key: 'feasibility', status: 'pending', activities: ['Origin-destination survey', 'Capital & opex sizing'], completedActivities: [], outputs: '—' },
      { name: 'Structuring & bankability', key: 'structuring', status: 'pending', activities: ['Operator concession design'], completedActivities: [], outputs: '—' },
      { name: 'Transaction & close', key: 'transaction', status: 'pending', activities: ['Fleet & civil procurement'], completedActivities: [], outputs: '—' },
      { name: 'Construction', key: 'construction', status: 'pending', activities: ['Dedicated lane civil works'], completedActivities: [], outputs: '—' },
      { name: 'Operations', key: 'ops', status: 'pending', activities: ['Farebox & subsidy management'], completedActivities: [], outputs: '—' },
    ],
    gaps: [
      { gap: 'No passenger demand study', severity: 'critical', stage: 'Concept', remedy: 'Apply for GIF / DBSA preparation grant', status: 'Open' },
      { gap: 'Farebox subsidy mechanism undefined', severity: 'high', stage: 'Feasibility', remedy: 'Confirm PTNG / national grant allocation', status: 'Open' },
    ],
  },
  ...SOURCED_OFFICIAL_PROJECT_MAP,
};

export const INITIAL_ENGAGEMENTS: Record<string, Engagement> = {
  'p1-c1': {
    status: 'interest',
    date: '2026-11-10',
    note: 'Interested in PPF application support',
    qaLog: [
      { id: 'm1', author: 'DBSA PPF Desk', date: '2026-11-11', text: 'Confirm council resolution timeline for preparation grant recovery terms.' },
    ],
    auditTrail: [
      { date: '2026-11-10', event: 'Borrower expressed interest in DBSA Project Preparation Fund' },
    ],
  },
  'p1-c2': {
    status: 'nda',
    date: '2026-11-14',
    note: 'NDA executed; data room opened',
    qaLog: [
      { id: 'm2', author: 'AfDB Water Facility', date: '2026-11-15', text: 'Please upload the preliminary NRW zone metering schematic to folder 02-Technical.' },
      { id: 'm3', author: 'Municipal PMO', date: '2026-11-16', text: 'Uploaded bulk meter logs for 2024–2026 and municipal council resolution draft.' },
    ],
    auditTrail: [
      { date: '2026-11-12', event: 'Interest expressed by borrower' },
      { date: '2026-11-14', event: 'Mutual NDA executed; data room provisioned' },
    ],
  },
  'p1-c9': {
    status: 'interest',
    date: '2026-11-08',
    note: 'Initial screening submitted for Budget Facility for Infrastructure window',
    qaLog: [],
    auditTrail: [
      { date: '2026-11-08', event: 'BFI pre-screening submitted' },
    ],
  },
};

export const JURISDICTION_OPTIONS = [
  { value: 'za-muni', label: 'South Africa — Local Municipality' },
  { value: 'za-metro', label: 'South Africa — Metropolitan' },
  { value: 'za-nat', label: 'South Africa — National' },
  { value: 'drc-prov', label: 'DRC — Provincial' },
  { value: 'ke-county', label: 'Kenya — County' },
  { value: 'zm-muni', label: 'Zambia — Local Authority' },
];

export const LEGAL_STATUS: Record<LegalRuleStatus, { label: string; tone: string }> = {
  prohibition: { label: 'Express prohibition', tone: 'text-rose-300' },
  conditional: { label: 'Conditional authority', tone: 'text-amber-300' },
  approval: { label: 'Admin approval required', tone: 'text-sky-300' },
  allowed: { label: 'Generally permitted', tone: 'text-teal-300' },
  unsettled: { label: 'Unsettled', tone: 'text-slate-300' },
};

export const LEGAL_BY_JURISDICTION: Record<string, JurisdictionLegalProfile> = {
  'za-muni': {
    summary:
      'Long-term borrowing for capital expenditure is conditionally permitted under MFMA. Foreign-currency borrowing and guarantees face tighter constraints.',
    rules: [
      { q: 'Borrowing for capital expenditure', status: 'conditional', cite: 'MFMA 56 of 2003, ss 46–48', note: 'Long-term debt only for capital expenditure; council resolution and affordability assessment required.', reviewed: '2026-10-15' },
      { q: 'Foreign-currency borrowing', status: 'approval', cite: 'MFMA s 48 + NT guidance', note: 'National Treasury approval and FX risk management required.', reviewed: '2026-10-15' },
      { q: 'Public-private partnerships', status: 'conditional', cite: 'MFMA s 33; TR 16', note: 'PPP feasibility and Treasury approval stages apply.', reviewed: '2026-10-15' },
      { q: 'Guarantees by municipality', status: 'prohibition', cite: 'MFMA s 50', note: 'May not guarantee debt of other entities except where expressly permitted.', reviewed: '2026-10-15' },
      { q: 'Pledging project revenue', status: 'conditional', cite: 'MFMA regulations', note: 'Security arrangements limited; enforcement rights constrained.', reviewed: '2026-10-15' },
      { q: 'Debt ceilings / affordability', status: 'approval', cite: 'NT circulars', note: 'Debt-service ratios inform approval.', reviewed: '2026-10-15' },
    ],
  },
  'za-metro': {
    summary: 'Metros have broader capacity but MFMA and National Treasury oversight still apply.',
    rules: [
      { q: 'Borrowing for capital expenditure', status: 'conditional', cite: 'MFMA ss 46–48', note: 'Same core framework; often stronger credit histories and municipal bond market access.', reviewed: '2026-10-15' },
      { q: 'Foreign-currency borrowing', status: 'approval', cite: 'MFMA s 48 + NT guidance', note: 'Subject to National Treasury approval and hedging policy.', reviewed: '2026-10-15' },
      { q: 'Municipal bond issuance', status: 'conditional', cite: 'MFMA s 46; JSE Debt Listings', note: 'Permitted with council resolution, credit rating, and capital programme ring-fencing.', reviewed: '2026-10-15' },
    ],
  },
  'za-nat': {
    summary: 'National borrowing governed by PFMA and sovereign debt management framework.',
    rules: [
      { q: 'Sovereign borrowing', status: 'conditional', cite: 'PFMA', note: 'Subject to fiscal framework and debt sustainability.', reviewed: '2026-10-15' },
      { q: 'Sovereign guarantees', status: 'approval', cite: 'PFMA s 70', note: 'Requires concurrence of the Minister of Finance and Fiscal Liability Committee review.', reviewed: '2026-10-15' },
    ],
  },
  'drc-prov': {
    summary: 'Provincial borrowing in DRC is constrained; central involvement typically required. Full legal mapping needed before live use.',
    rules: [
      { q: 'Provincial borrowing', status: 'unsettled', cite: 'LOFIP / Provincial Fiscal Code', note: 'Prototype placeholder — verify central Ministry of Finance authorisation before structuring.', reviewed: '2026-11-01' },
      { q: 'Concession & PPP authority', status: 'conditional', cite: 'PPP Law 18/016', note: 'National PPP unit coordination typically required for cross-border lenders.', reviewed: '2026-11-01' },
    ],
  },
  'ke-county': {
    summary: 'County borrowing under Kenyan PFMA, subject to national oversight and statutory debt ceilings.',
    rules: [
      { q: 'County borrowing', status: 'conditional', cite: 'PFMA Kenya ss 140–142', note: 'County assembly approval, National Treasury guarantee clearance, and fiscal responsibility principles.', reviewed: '2026-09-20' },
      { q: 'County climate & PPP windows', status: 'allowed', cite: 'Kenyan PPP Act 2021', note: 'Counties may originate PPPs subject to PPP Directorate approval.', reviewed: '2026-09-20' },
    ],
  },
  'zm-muni': {
    summary: 'Zambian local authority borrowing — confirm current circulars with local counsel.',
    rules: [
      { q: 'Local authority borrowing', status: 'conditional', cite: 'Local Government Act / PFMA', note: 'Prototype coverage limited — Ministry of Local Government and Finance clearance required.', reviewed: '2026-11-01' },
    ],
  },
};

export const SCENARIOS: FinancingScenario[] = [
  {
    id: 'A',
    name: 'DFI concessional (ZAR)',
    desc: 'Single ZAR concessional DFI loan.',
    components: [{ label: 'DFI loan', amount: 420e6, rate: 0.08, years: 15, grace: 3, ccy: 'ZAR', fl: 0.5 }],
    legal: 'Subject to municipal approval and affordability.',
    time: '9–15 months',
  },
  {
    id: 'B',
    name: 'Blended (grant + concessional + commercial)',
    desc: 'R120m grant, R200m concessional, R100m commercial.',
    components: [
      { label: 'Grant', amount: 120e6, rate: 0, years: 0, grace: 0, ccy: 'ZAR', grant: true },
      { label: 'Concessional', amount: 200e6, rate: 0.065, years: 18, grace: 3, ccy: 'ZAR', fl: 0.5 },
      { label: 'Commercial', amount: 100e6, rate: 0.11, years: 10, grace: 1, ccy: 'ZAR', fl: 1 },
    ],
    legal: 'Grant requires eligible criteria. Strong analytical candidate.',
    time: '12–18 months',
    recommended: true,
  },
  {
    id: 'C',
    name: 'Commercial only',
    desc: 'Full commercial bank debt.',
    components: [{ label: 'Commercial', amount: 420e6, rate: 0.115, years: 10, grace: 1, ccy: 'ZAR', fl: 1 }],
    legal: 'Compatible but may breach affordability norms.',
    time: '6–9 months',
  },
  {
    id: 'D',
    name: 'ECA + commercial',
    desc: 'R180m ECA (USD) + R240m ZAR commercial.',
    components: [
      { label: 'ECA USD', amount: 180e6, rate: 0.085, years: 12, grace: 2, ccy: 'USD', fl: 0.25 },
      { label: 'Commercial ZAR', amount: 240e6, rate: 0.11, years: 10, grace: 1, ccy: 'ZAR', fl: 1 },
    ],
    legal: 'ECA export-content rules; municipal approval required.',
    time: '9–14 months',
  },
];

export const FLOW_INSTRUMENTS: FlowInstrumentShare[] = [
  { name: 'Commercial / private debt', pct: 28, color: '#e8c36a' },
  { name: 'DFI / MDB concessional', pct: 24, color: '#2dd4bf' },
  { name: 'Equity & infra funds', pct: 14, color: '#60a5fa' },
  { name: 'ECA-backed', pct: 11, color: '#a78bfa' },
  { name: 'Grants & preparation', pct: 8, color: '#34d399' },
  { name: 'Guarantees / risk', pct: 7, color: '#c084fc' },
  { name: 'Other / blended', pct: 8, color: '#64748b' },
];

export const FLOW_DRIVERS: FlowDriver[] = [
  { title: 'Project preparation quality', text: 'Completed feasibility, clear offtake and clean E&S screening attract broader capital and better terms.' },
  { title: 'Legal predictability', text: 'Lenders allocate to jurisdictions where security and dispute resolution are reliable.' },
  { title: 'Currency & convertibility', text: 'Hard-currency debt creates risk for local-revenue projects. Local-currency solutions improve bankability.' },
  { title: 'Sovereign / sub-sovereign support', text: 'Guarantees and on-lending expand the lender universe but create contingent liabilities.' },
  { title: 'Sector track record', text: 'Power and some transport have deeper track records than water or social infrastructure.' },
  { title: 'Blended finance availability', text: 'Grant or concessional layers can crowd in commercial capital that would otherwise stay away.' },
];

export const TRANSACTIONS: TransactionRecord[] = [
  { project: 'Utility-scale solar', country: 'South Africa', providers: 'DFIs + commercial + ECA', structure: 'Project finance', amount: '~$400m', year: '2023', status: 'Closed' },
  { project: 'Port expansion', country: 'Kenya', providers: 'MDB + syndicate', structure: 'Sovereign / hybrid', amount: '~$280m', year: '2022', status: 'Closed' },
  { project: 'Municipal water bulk', country: 'South Africa', providers: 'DBSA + commercial', structure: 'Municipal loan + grant', amount: 'R1.1bn', year: '2024', status: 'Closed' },
  { project: 'Transmission line', country: 'Zambia', providers: 'MDB + bilateral', structure: 'Sovereign guaranteed', amount: '~$180m', year: '2021', status: 'Closed' },
  { project: 'BRT Phase 2', country: 'Ghana', providers: 'MDB + climate fund', structure: 'Blended', amount: '~$220m', year: '2023', status: 'Implementation' },
  { project: 'Mini-grid programme', country: 'DRC', providers: 'Climate fund + DFI', structure: 'Results-based + equity', amount: '~$60m', year: '2024', status: 'Preparation' },
  { project: 'NRW programme', country: 'Kenya', providers: 'AFD + grant', structure: 'Concessional + TA', amount: '€45m', year: '2022', status: 'Closed' },
  { project: 'Airport terminal', country: 'Senegal', providers: 'ECA + commercial', structure: 'Buyer credit', amount: '~$350m', year: '2020', status: 'Closed' },
];

export const FLOW_DATA: FlowArc[] = [
  { from: 'USA', to: 'South Africa', vol: 420, type: 'dfi', sector: 'Energy & Water' },
  { from: 'USA', to: 'Kenya', vol: 310, type: 'dfi', sector: 'Transport & Energy' },
  { from: 'USA', to: 'Nigeria', vol: 280, type: 'commercial', sector: 'Power & Digital' },
  { from: 'GBR', to: 'South Africa', vol: 260, type: 'commercial', sector: 'Renewables' },
  { from: 'GBR', to: 'Kenya', vol: 180, type: 'dfi', sector: 'Climate & Water' },
  { from: 'GBR', to: 'Ghana', vol: 140, type: 'eca', sector: 'Transport' },
  { from: 'DEU', to: 'South Africa', vol: 240, type: 'dfi', sector: 'Just Energy Transition' },
  { from: 'DEU', to: 'Kenya', vol: 160, type: 'dfi', sector: 'Geothermal & Water' },
  { from: 'DEU', to: 'Zambia', vol: 95, type: 'grant', sector: 'Water Preparation' },
  { from: 'FRA', to: 'Senegal', vol: 210, type: 'dfi', sector: 'Urban Transit & Water' },
  { from: 'FRA', to: "Côte d'Ivoire", vol: 170, type: 'dfi', sector: 'Clean Energy' },
  { from: 'FRA', to: 'Morocco', vol: 190, type: 'commercial', sector: 'Ports & Solar' },
  { from: 'CHN', to: 'Ethiopia', vol: 380, type: 'commercial', sector: 'Rail & Transmission' },
  { from: 'CHN', to: 'Kenya', vol: 290, type: 'commercial', sector: 'Roads & Ports' },
  { from: 'CHN', to: 'Nigeria', vol: 220, type: 'commercial', sector: 'Port & Rail' },
  { from: 'CHN', to: 'Zambia', vol: 150, type: 'commercial', sector: 'Grid & Hydro' },
  { from: 'JPN', to: 'Kenya', vol: 130, type: 'eca', sector: 'Port & Geothermal' },
  { from: 'JPN', to: 'South Africa', vol: 110, type: 'eca', sector: 'Grid Storage' },
  { from: 'NLD', to: 'South Africa', vol: 90, type: 'dfi', sector: 'Water & Climate' },
  { from: 'SWE', to: 'Kenya', vol: 70, type: 'grant', sector: 'Clean Cooking & Grid' },
  { from: 'ARE', to: 'Egypt', vol: 200, type: 'commercial', sector: 'Renewables & Ports' },
  { from: 'ZAF', to: 'Zambia', vol: 55, type: 'dfi', sector: 'SADC Interconnectors' },
  { from: 'ZAF', to: 'Mozambique', vol: 48, type: 'dfi', sector: 'Logistics & Gas' },
  { from: 'ZAF', to: 'DRC', vol: 40, type: 'commercial', sector: 'Regional Logistics' },
  { from: 'USA', to: 'Ghana', vol: 160, type: 'dfi', sector: 'Clean Power' },
  { from: 'GBR', to: 'Nigeria', vol: 195, type: 'commercial', sector: 'Infrastructure Debt' },
  { from: 'CHN', to: 'Angola', vol: 310, type: 'commercial', sector: 'Transport Corridors' },
  { from: 'USA', to: 'DRC', vol: 110, type: 'dfi', sector: 'Critical Minerals Corridor' },
  { from: 'FRA', to: 'DRC', vol: 85, type: 'dfi', sector: 'Municipal Water' },
  { from: 'CHN', to: 'DRC', vol: 240, type: 'commercial', sector: 'Hydro & Rail' },
  { from: 'USA', to: 'Senegal', vol: 95, type: 'dfi', sector: 'Port & Power' },
  { from: 'DEU', to: 'Ghana', vol: 80, type: 'dfi', sector: 'Renewable Grid' },
  { from: 'USA', to: 'Ethiopia', vol: 140, type: 'grant', sector: 'Health & Resilience' },
  { from: 'JPN', to: 'Mozambique', vol: 90, type: 'eca', sector: 'Port Terminal' },
];

export const CENTROIDS: Record<string, [number, number]> = {
  USA: [-98, 39],
  GBR: [-2, 54],
  DEU: [10, 51],
  FRA: [2, 46],
  CHN: [104, 35],
  JPN: [138, 36],
  NLD: [5, 52],
  SWE: [15, 62],
  ARE: [54, 24],
  ZAF: [25, -29],
  'South Africa': [25, -29],
  Kenya: [38, 0.5],
  Nigeria: [8, 10],
  Ghana: [-1, 8],
  Zambia: [28, -14],
  Senegal: [-14, 14],
  "Côte d'Ivoire": [-5, 8],
  Morocco: [-6, 32],
  Ethiopia: [40, 9],
  Egypt: [30, 27],
  Mozambique: [35, -18],
  DRC: [24, -3],
  Angola: [18, -12],
};

export const TYPE_COLOR: Record<FlowInstrumentType, string> = {
  dfi: '#2dd4bf',
  commercial: '#e8c36a',
  eca: '#a78bfa',
  grant: '#34d399',
};

export const TYPE_LABEL: Record<FlowInstrumentType, string> = {
  dfi: 'DFI / Concessional',
  commercial: 'Commercial Debt & Equity',
  eca: 'ECA / Guarantee',
  grant: 'Grant & Preparation',
};

export const NAME_TO_KEY: Record<string, string> = {
  'United States of America': 'USA',
  'United Kingdom': 'GBR',
  Germany: 'DEU',
  France: 'FRA',
  China: 'CHN',
  Japan: 'JPN',
  Netherlands: 'NLD',
  Sweden: 'SWE',
  'United Arab Emirates': 'ARE',
  'South Africa': 'ZAF',
  'Dem. Rep. Congo': 'DRC',
};

export const KEY_TO_DISPLAY: Record<string, string> = {
  USA: 'United States',
  GBR: 'United Kingdom',
  DEU: 'Germany',
  FRA: 'France',
  CHN: 'China',
  JPN: 'Japan',
  NLD: 'Netherlands',
  SWE: 'Sweden',
  ARE: 'United Arab Emirates',
  ZAF: 'South Africa',
  DRC: 'Dem. Rep. Congo',
};

export const COUNTRY_JURISDICTION_LINK: Record<string, string> = {
  ZAF: 'za-muni',
  'South Africa': 'za-muni',
  Kenya: 'ke-county',
  Zambia: 'zm-muni',
  DRC: 'drc-prov',
};

export interface RegionPreset {
  id: string;
  label: string;
  center: [number, number];
  scaleFactor: number;
}

export const REGION_PRESETS: RegionPreset[] = [
  { id: 'global', label: 'Global', center: [15, 12], scaleFactor: 1 },
  { id: 'africa', label: 'Africa Focus', center: [20, 2], scaleFactor: 2.35 },
  { id: 'southern', label: 'Southern Africa', center: [25, -20], scaleFactor: 3.4 },
  { id: 'east', label: 'East Africa', center: [38, 2], scaleFactor: 3.5 },
  { id: 'west', label: 'West & Central', center: [6, 7], scaleFactor: 3.2 },
];

export const INITIAL_MANDATE: ProviderMandate = {
  institution: 'Nordic Climate Infrastructure Fund (illustrative)',
  type: 'Infrastructure fund',
  ticketSize: '15 – 120',
  geographies: 'South Africa, Kenya, Zambia, Ghana, Senegal',
  sectors: ['Water', 'Renewable energy', 'Climate adaptation'],
  notes:
    'Prefer projects with sovereign or strong sub-sovereign support, clear offtake, completed feasibility. Open to blended structures.',
};
