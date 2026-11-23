import type {
  CapitalProvider,
  DealDocumentKind,
  EngagementStatus,
  OfficialPipelineProject,
  Project,
} from '../types/capital';

export interface DocumentContext {
  project: Project;
  provider: CapitalProvider;
  signatory?: string;
  signatoryTitle?: string;
  counterpartyRep?: string;
  governingLaw?: string;
  customTerms?: string;
  confidentialityYears?: number;
  dataRoomFileName?: string;
  date?: string;
}

export interface GeneratedDocument {
  docKind: DealDocumentKind;
  title: string;
  subtitle: string;
  referenceCode: string;
  executionLabel: string;
  targetNextStatus?: EngagementStatus;
  governingLawDefault: string;
  clauses: Array<{ heading: string; body: string }>;
  checklist: string[];
  plainText: string;
}

export function defaultGoverningLawForJurisdiction(jurisdiction: string): string {
  const j = jurisdiction.toLowerCase();
  if (j.includes('south africa')) {
    return 'Laws of the Republic of South Africa (MFMA Act 56 of 2003 / PFMA)';
  }
  if (j.includes('kenya')) {
    return 'Laws of the Republic of Kenya (PFMA 2012 & PPP Act 2021)';
  }
  if (j.includes('zambia')) {
    return 'Laws of the Republic of Zambia (Public-Private Partnership Act & PFMA)';
  }
  if (j.includes('drc')) {
    return 'Laws of the Democratic Republic of the Congo (OHADA & PPP Law 18/016)';
  }
  if (j.includes('nigeria')) {
    return 'Laws of the Federal Republic of Nigeria (ICRC Act & ISA)';
  }
  return 'Applicable Host Jurisdiction Law & ICC / AFSA Arbitration';
}

function formatCapexLine(project: Project): string {
  const millions = (project.capex / 1e6).toFixed(1);
  return `${project.currency === 'ZAR' ? 'ZAR ' : `${project.currency} `}${millions}m`;
}

export function generateDealDocument(
  kind: DealDocumentKind,
  ctx: DocumentContext
): GeneratedDocument {
  const dateStr = ctx.date || '2026-11-23';
  const signatory = ctx.signatory?.trim() || 'Municipal / Sponsor Accounting Officer';
  const signatoryTitle =
    ctx.signatoryTitle?.trim() || 'Authorized Accounting Officer / Project Director';
  const counterpartyRep =
    ctx.counterpartyRep?.trim() || `${ctx.provider.name} Investment & Structuring Desk`;
  const govLaw =
    ctx.governingLaw?.trim() || defaultGoverningLawForJurisdiction(ctx.project.jurisdiction);
  const years = ctx.confidentialityYears || 3;
  const capexStr = formatCapexLine(ctx.project);
  const refPrefix = kind.toUpperCase().slice(0, 4);
  const referenceCode = `CI-${refPrefix}-${ctx.project.id.toUpperCase()}-${ctx.provider.id.toUpperCase()}`;

  if (kind === 'nda') {
    const clauses = [
      {
        heading: '1. Parties & Purpose',
        body: `This Mutual Non-Disclosure & Data Room Access Agreement ("Agreement") is entered into on ${dateStr} between the Disclosing Project Authority ("${ctx.project.jurisdiction}", acting for "${ctx.project.name}", indicative Capex ${capexStr}) and "${ctx.provider.name}" (${ctx.provider.category} — ${ctx.provider.type}), solely to evaluate potential ${ctx.provider.type.toLowerCase()} participation, blended finance structuring, or technical preparation support.`,
      },
      {
        heading: '2. Definition of Confidential Information & Data Room Materials',
        body: `Confidential Information encompasses all non-public engineering schematics, NRW metering logs, financial & tariff affordability models, council resolutions, procurement drafts, and Q&A disclosures accessed in the permissioned Capital Intelligence Deal Room under reference ${referenceCode}.`,
      },
      {
        heading: '3. Statutory & Public-Audit Carve-Out',
        body: `Nothing in this Agreement prevents mandatory statutory reporting to the National Treasury, Auditor-General, Municipal/County Council, Parliament, or procurement oversight bodies under ${govLaw}, nor disclosure required by valid regulatory directive after prior written notice where legally permissible.`,
      },
      {
        heading: '4. Permitted Recipients, Non-Circumvention & Data Security',
        body: `The Receiving Party may share Confidential Information strictly on a need-to-know basis with internal credit committees, DFI co-lenders, legal counsel, and independent technical consultants bound by equivalent written confidentiality duties for ${years} years from execution.`,
      },
      {
        heading: '5. Non-Binding Commitment',
        body: `Execution of this NDA grants immediate read access to the Data Room and formal Q&A log, but creates no legally binding commitment to lend, grant, guarantee, or award procurement until definitive financing agreements and statutory borrowing approvals are completed.`,
      },
      {
        heading: '6. Governing Law & Dispute Resolution',
        body: `This Agreement is governed by ${govLaw}. Any unresolved dispute shall be referred to confidential expedited arbitration seated in the primary commercial hub of the host jurisdiction unless otherwise agreed in writing.${ctx.customTerms ? `\nSpecial Provisions: ${ctx.customTerms}` : ''}`,
      },
    ];

    const checklist = [
      'Confirms public-sector transparency & Auditor-General statutory carve-out',
      'Activates full read/download permissions across 01–04 Data Room folders',
      'Authorizes counterparty DFI credit & technical advisors under strict back-to-back confidentiality',
    ];

    return {
      docKind: 'nda',
      title: 'Mutual Non-Disclosure & Data Room Access Agreement',
      subtitle: `${ctx.project.name} ↔ ${ctx.provider.name}`,
      referenceCode,
      executionLabel: 'Execute NDA & Open Data Room',
      targetNextStatus: 'nda',
      governingLawDefault: govLaw,
      clauses,
      checklist,
      plainText: formatPlainText(
        'MUTUAL NON-DISCLOSURE & DATA ROOM ACCESS AGREEMENT',
        referenceCode,
        dateStr,
        clauses,
        signatory,
        signatoryTitle,
        counterpartyRep,
        ctx.provider.name
      ),
    };
  }

  if (kind === 'termsheet') {
    const clauses = [
      {
        heading: '1. Proposed Facility & Counterparty Mandate Alignment',
        body: `Facility Sponsor / Provider: ${ctx.provider.name} (${ctx.provider.type}). Indicative Mandate Ticket: ${ctx.provider.ticket} (${ctx.provider.currency}). Borrower / Sponsor: ${ctx.project.jurisdiction} for "${ctx.project.name}" (Total Capex: ${capexStr}, Sector: ${ctx.project.sector}).`,
      },
      {
        heading: '2. Indicative Structure, Tenor & Pricing Benchmarks',
        body: `Indicative instrument: ${ctx.provider.type}. Target tenor aligned with asset useful life (12–20 years with 2–3 years construction grace where applicable). Pricing benchmarked to ${ctx.provider.currency === 'ZAR' ? '3M JIBAR + concessional/commercial margin' : 'SOFR/EURIBOR + blended concessional spread'}, subject to credit committee and scenario stress testing.`,
      },
      {
        heading: '3. Local-Currency, Hedging & Blended First-Loss Protections',
        body: `Consistent with revenue-currency matching, parties shall evaluate partial credit guarantees (GuarantCo, InfraCredit/InfraZamin/Dhamana) or long-tenor FX swaps (TCX) if hard-currency tranches exceed 25% of senior debt.`,
      },
      {
        heading: '4. Key Conditions Precedent (CPs) & Statutory Compliance',
        body: `Disbursement remains conditional upon: (i) Council/Ministerial borrowing approval and compliance checklist (${ctx.provider.legal}); (ii) verified technical feasibility & E&S management plan; (iii) closing open bankability gaps (${ctx.project.gaps.filter((g) => g.status !== 'Closed').map((g) => g.gap).join('; ') || 'All initial gaps cleared'}).`,
      },
      {
        heading: '5. Exclusivity Window & Indicative Status',
        body: `This Term Sheet is non-binding except as to confidentiality, costs, and governing law (${govLaw}), and serves as the basis for joint due diligence and credit committee submission.${ctx.customTerms ? `\nCommercial Parameters / Margin Notes: ${ctx.customTerms}` : ''}`,
      },
    ];

    return {
      docKind: 'termsheet',
      title: 'Indicative Blended Financing Term Sheet',
      subtitle: `${ctx.project.name} · ${ctx.provider.name}`,
      referenceCode,
      executionLabel: 'Issue Indicative Term Sheet & Advance Stage',
      targetNextStatus: 'terms',
      governingLawDefault: govLaw,
      clauses,
      checklist: [
        'Documents indicative tenor, currency denomination & FX mitigation',
        'Maps open bankability gaps directly into Conditions Precedent (CPs)',
        'Preserves statutory borrowing compliance & affordability thresholds',
      ],
      plainText: formatPlainText(
        'INDICATIVE BLENDED FINANCING TERM SHEET (NON-BINDING)',
        referenceCode,
        dateStr,
        clauses,
        signatory,
        signatoryTitle,
        counterpartyRep,
        ctx.provider.name
      ),
    };
  }

  if (kind === 'closememo') {
    const clauses = [
      {
        heading: '1. Financial Close Declaration & Committed Structure',
        body: `Closing Memorandum confirming completion of definitive documentation between ${ctx.project.jurisdiction} ("${ctx.project.name}", Capex ${capexStr}) and ${ctx.provider.name} (${ctx.provider.type}, Ticket range ${ctx.provider.ticket}).`,
      },
      {
        heading: '2. Satisfaction of Statutory & Precedent Conditions',
        body: `Legal counsel and Accounting Officer confirm all statutory clearances under ${govLaw}, Treasury/Ministry approvals, environmental authorizations, and inter-creditor escrow mechanics have been satisfied or formally waived in writing.`,
      },
      {
        heading: '3. First Drawdown & Construction Monitoring Protocol',
        body: `Initial disbursement notice verified against Owner’s Engineer milestone schedule, ring-fenced Debt Service Reserve Account (DSRA) funding, and quarterly E&S / financial covenant reporting.${ctx.customTerms ? `\nClosing Covenant / Conditions Subsequent: ${ctx.customTerms}` : ''}`,
      },
    ];

    return {
      docKind: 'closememo',
      title: 'Mandate & Financial Close Memorandum',
      subtitle: `${ctx.project.name} · ${ctx.provider.name}`,
      referenceCode,
      executionLabel: 'Record Signed Financial Close',
      targetNextStatus: 'closed',
      governingLawDefault: govLaw,
      clauses,
      checklist: [
        'Confirms full statutory & Treasury borrowing resolution satisfaction',
        'Locks first disbursement conditions and DSRA ring-fencing',
        'Records immutable Financial Close audit timestamp',
      ],
      plainText: formatPlainText(
        'MANDATE & FINANCIAL CLOSE MEMORANDUM',
        referenceCode,
        dateStr,
        clauses,
        signatory,
        signatoryTitle,
        counterpartyRep,
        ctx.provider.name
      ),
    };
  }

  if (kind === 'rfi') {
    const clauses = [
      {
        heading: '1. Counterparty Information Request Scope',
        body: `Structured Request for Information (RFI) issued between ${ctx.project.name} (${capexStr}) and ${ctx.provider.name} (${ctx.provider.category}) ahead of formal NDA/Data Room verification.`,
      },
      {
        heading: '2. Eligibility & Mandate Screening Questions',
        body: `a) Minimum/maximum commitment in ${ctx.provider.currency} (${ctx.provider.ticket});\nb) Applicability of "${ctx.provider.legal}";\nc) Appetite for ${ctx.project.stage}-stage co-development grants or local-currency guarantees.`,
      },
      {
        heading: '3. Requested Borrower Pre-Read Pack',
        body: `Project authority readiness score: ${ctx.project.readiness}/100. Open bankability items: ${ctx.project.gaps.map((g) => `${g.gap} (${g.status})`).join('; ') || 'None'}.${ctx.customTerms ? `\nSpecific Questions: ${ctx.customTerms}` : ''}`,
      },
    ];

    return {
      docKind: 'rfi',
      title: 'Request for Information & Mandate Screening Pack',
      subtitle: `${ctx.project.name} · ${ctx.provider.name}`,
      referenceCode,
      executionLabel: 'Log RFI in Audit Trail',
      governingLawDefault: govLaw,
      clauses,
      checklist: [
        'Confirms exact legal eligibility & currency appetite before diligence costs',
        'Lists open bankability gaps and preparation grant fit',
      ],
      plainText: formatPlainText(
        'REQUEST FOR INFORMATION & MANDATE SCREENING PACK',
        referenceCode,
        dateStr,
        clauses,
        signatory,
        signatoryTitle,
        counterpartyRep,
        ctx.provider.name
      ),
    };
  }

  // Data room document template preview
  const docName = ctx.dataRoomFileName || 'Municipal Council Resolution Draft.pdf';
  const clauses = [
    {
      heading: `1. Document Overview — ${docName}`,
      body: `Prepared within the ${ctx.project.name} (${ctx.project.jurisdiction}) permissioned Data Room for review by ${ctx.provider.name} under Reference ${referenceCode}.`,
    },
    {
      heading: '2. Substantive Summary & Statutory Alignment',
      body: docName.toLowerCase().includes('council')
        ? `Draft Authorizing Resolution confirming capital expenditure need (${capexStr}), multi-year budget appropriation, public consultation notice, and compliance under ${govLaw}.`
        : docName.toLowerCase().includes('nrw') || docName.toLowerCase().includes('technical')
          ? `Technical Engineering & District Metered Area (DMA) baseline quantifying non-revenue water losses, pressure management zones, pump efficiency upgrades, and climate resilience design parameters.`
          : docName.toLowerCase().includes('tariff') || docName.toLowerCase().includes('financial')
            ? `20-year Cashflow & Tariff Affordability schedule comparing blended concessional/grant layers vs. commercial debt, DSCR sensitivity under +200 bps interest and +25% FX depreciation.`
            : `Environmental & Social (E&S) Screening Summary benchmarked against IFC Performance Standards and AfDB Integrated Safeguards System (ISS), identifying land access, community consultation, and mitigation budget.`,
    },
    {
      heading: '3. Diligence Action Items',
      body: `Reviewing Lender (${ctx.provider.name}) may log technical clarifications in the Counterparty Q&A tab referencing ${referenceCode}.${ctx.customTerms ? `\nReviewer Annotation: ${ctx.customTerms}` : ''}`,
    },
  ];

  return {
    docKind: 'dataroom_doc',
    title: docName,
    subtitle: `Data Room Document Template · ${ctx.project.name}`,
    referenceCode,
    executionLabel: 'Mark Document Reviewed',
    governingLawDefault: govLaw,
    clauses,
    checklist: [
      'Structured institutional template ready for local project figures',
      'Aligned with DFI / commercial credit committee review standards',
    ],
    plainText: formatPlainText(
      `DATA ROOM TEMPLATE: ${docName}`,
      referenceCode,
      dateStr,
      clauses,
      signatory,
      signatoryTitle,
      counterpartyRep,
      ctx.provider.name
    ),
  };
}

function formatPlainText(
  header: string,
  referenceCode: string,
  dateStr: string,
  clauses: Array<{ heading: string; body: string }>,
  signatory: string,
  signatoryTitle: string,
  counterpartyRep: string,
  providerName: string
): string {
  const lines = [
    header,
    `Reference: ${referenceCode} | Date: ${dateStr}`,
    '='.repeat(64),
    '',
    ...clauses.flatMap((c) => [c.heading, c.body, '']),
    'SIGNATURES',
    '-'.repeat(32),
    `For Project / Borrower: ${signatory} (${signatoryTitle})`,
    `For Counterparty (${providerName}): ${counterpartyRep}`,
    '',
    'Generated via Capital Intelligence Platform (Template Draft — Legal Counsel Review Advised)',
  ];
  return lines.join('\n');
}

export type OverlookedSegment =
  | 'all'
  | 'overlooked'
  | 'municipal'
  | 'local_ccy'
  | 'gulf_south_south'
  | 'philanthropic_climate';

export function matchesOverlookedSegment(
  c: CapitalProvider,
  segment: OverlookedSegment
): boolean {
  if (segment === 'all') return true;
  if (segment === 'overlooked') return Boolean(c.overlooked);
  const tag = `${c.nontraditionalTag || ''} ${c.desc} ${c.name} ${c.category}`.toLowerCase();
  if (segment === 'municipal') {
    return (
      tag.includes('municipal') ||
      tag.includes('sub-sovereign') ||
      tag.includes('prep') ||
      c.stages.includes('concept')
    );
  }
  if (segment === 'local_ccy') {
    return (
      tag.includes('local-currency') ||
      tag.includes('fx hedge') ||
      tag.includes('guarantee') ||
      tag.includes('pension') ||
      c.type === 'Guarantee / risk'
    );
  }
  if (segment === 'gulf_south_south') {
    return (
      tag.includes('gulf') ||
      tag.includes('arab') ||
      tag.includes('islamic') ||
      tag.includes('south-south') ||
      tag.includes('badea') ||
      tag.includes('isdb') ||
      tag.includes('opec') ||
      tag.includes('exim')
    );
  }
  if (segment === 'philanthropic_climate') {
    return (
      c.category === 'Endowments & foundations' ||
      c.category === 'Climate & guarantee facilities' ||
      tag.includes('carbon') ||
      tag.includes('philanthrop') ||
      tag.includes('nature')
    );
  }
  return true;
}

export function filterOfficialPipelines(
  list: OfficialPipelineProject[],
  filters: {
    search?: string;
    sourceCategory?: string;
    rec?: string;
    sector?: string;
    stage?: string;
  }
): OfficialPipelineProject[] {
  const q = (filters.search || '').trim().toLowerCase();
  return list.filter((item) => {
    const hay = `${item.name} ${item.country} ${item.authorityName} ${item.sector} ${item.summary} ${item.agendaAlignment}`.toLowerCase();
    return (
      (!q || hay.includes(q)) &&
      (!filters.sourceCategory ||
        filters.sourceCategory === 'all' ||
        item.sourceCategory === filters.sourceCategory) &&
      (!filters.rec || filters.rec === 'all' || item.rec === filters.rec) &&
      (!filters.sector ||
        filters.sector === 'all' ||
        item.sector.toLowerCase().includes(filters.sector.toLowerCase())) &&
      (!filters.stage || filters.stage === 'all' || item.stage === filters.stage)
    );
  });
}
