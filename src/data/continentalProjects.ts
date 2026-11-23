import type {
  OfficialPipelineProject,
  OfficialPipelineSource,
  Project,
} from '../types/capital';

export const OFFICIAL_PIPELINE_SOURCES: OfficialPipelineSource[] = [
  'AU Agenda 2063 / PIDA',
  'Multilateral / DFI',
  'National Official Agency',
];

export const OFFICIAL_PIPELINE_PROJECTS: OfficialPipelineProject[] = [
  // --- AU AGENDA 2063 & AUDA-NEPAD PIDA PAP-2 FLAGSHIPS ---
  {
    id: 'au-pida-1',
    name: 'African Integrated High-Speed Railway Network (AIHSRN) — Lobito & Central Corridor Link',
    sourceCategory: 'AU Agenda 2063 / PIDA',
    authorityName: 'African Union · AUDA-NEPAD PIDA PAP-2',
    officialUrl: 'https://www.au-pida.org/',
    country: 'DRC & Zambia',
    jurisdictionKey: 'zm-muni',
    rec: 'SADC',
    sector: 'Transport / logistics',
    stage: 'structuring',
    capexUsdM: 4500,
    financingGap: 'USD 1.8bn blended concession equity, rolling-stock ECA tranches & rail track feasibility extension',
    summary:
      'Flagship Agenda 2063 project connecting Copperbelt mineral & industrial hubs (DRC/Zambia) to Atlantic port export capacity via open-access freight rail.',
    agendaAlignment: 'Agenda 2063 Flagship #1 (AIHSRN) · PIDA Priority Action Plan 2',
    recommendedOverlookedCapital: ['NEPAD-IPPF', 'ATIDI', 'US DFC', 'SADC PPDF', 'InfraZamin Zambia'],
    lastVerified: '2026-11-10',
  },
  {
    id: 'au-pida-2',
    name: 'Grand Inga Hydropower & SAPP-EAPP Continental Power Pool Integration',
    sourceCategory: 'AU Agenda 2063 / PIDA',
    authorityName: 'African Union Agenda 2063 · AfDB / PIDA',
    officialUrl: 'https://au.int/en/agenda2063/flagship-projects',
    country: 'DRC & South Africa',
    jurisdictionKey: 'drc-prov',
    rec: 'Continental',
    sector: 'Renewable energy',
    stage: 'feasibility',
    capexUsdM: 12000,
    financingGap: 'USD 85m technical/E&S preparation & cross-border wheeling bankability structuring',
    summary:
      'Agenda 2063 continental flagship linking clean baseload hydro generation in DRC with Southern African Power Pool (SAPP) industrial demand.',
    agendaAlignment: 'Agenda 2063 Flagship #2 (Grand Inga) · Continental Master Plan',
    recommendedOverlookedCapital: ['NEPAD-IPPF', 'SADC PPDF', 'AfDB SEFA', 'TCX', 'GEAPP'],
    lastVerified: '2026-11-08',
  },
  {
    id: 'au-pida-3',
    name: 'Abidjan–Lagos Coastal Corridor Highway & Smart One-Stop Border Posts',
    sourceCategory: 'AU Agenda 2063 / PIDA',
    authorityName: 'AUDA-NEPAD PIDA · ECOWAS PPDU',
    officialUrl: 'https://www.nepad.org/programme/programme-infrastructure-development-africa-pida',
    country: 'Ghana, Nigeria & Côte d’Ivoire',
    jurisdictionKey: 'za-nat',
    rec: 'ECOWAS',
    sector: 'Transport / logistics',
    stage: 'structuring',
    capexUsdM: 15600,
    financingGap: 'USD 620m public-private viaduct links & smart customs digital infrastructure',
    summary:
      'Six-lane transnational motorway and automated customs corridor uniting 5 West African economies to power AfCFTA intra-African trade.',
    agendaAlignment: 'PIDA PAP-2 Anchor Transport Corridor · AfCFTA Strategic Spine',
    recommendedOverlookedCapital: ['ECOWAS PPDU', 'EBID', 'Afreximbank', 'BADEA', 'IsDB'],
    lastVerified: '2026-11-05',
  },
  {
    id: 'au-pida-4',
    name: 'LAPSSET Corridor (Lamu Port–South Sudan–Ethiopia Transport & Fibre Spine)',
    sourceCategory: 'AU Agenda 2063 / PIDA',
    authorityName: 'AUDA-NEPAD PIDA · LAPSSET Development Authority',
    officialUrl: 'https://www.au-pida.org/',
    country: 'Kenya & Ethiopia',
    jurisdictionKey: 'ke-county',
    rec: 'EAC',
    sector: 'Transport / logistics',
    stage: 'transaction',
    capexUsdM: 3200,
    financingGap: 'USD 740m berth equipment concession debt, SEZ clean-water plants & dry port PPP',
    summary:
      'East African PIDA multi-modal corridor integrating deep-sea berths at Lamu, high-voltage power links, and cross-border logistics parks.',
    agendaAlignment: 'PIDA PAP-2 East Africa Maritime Gateway',
    recommendedOverlookedCapital: ['ATIDI', 'EADB', 'Saudi Fund (SFD)', 'CDP Italy', 'Dhamana'],
    lastVerified: '2026-11-01',
  },
  {
    id: 'au-pida-5',
    name: 'Continental Digital Africa Fiber Backbone & Smart IXP Programme',
    sourceCategory: 'AU Agenda 2063 / PIDA',
    authorityName: 'African Union · Smart Africa Alliance',
    officialUrl: 'https://au.int/en/agenda2063/overview',
    country: 'Senegal, Kenya & Continental',
    jurisdictionKey: 'ke-county',
    rec: 'Continental',
    sector: 'Municipal services',
    stage: 'feasibility',
    capexUsdM: 840,
    financingGap: 'USD 210m missing cross-border terrestrial links & green data-center energy microgrids',
    summary:
      'Pan-African missing terrestrial fiber links connecting landlocked corridors to submarine cables with solar-powered IXP hubs.',
    agendaAlignment: 'Agenda 2063 Flagship (Pan-African E-Network)',
    recommendedOverlookedCapital: ['USTDA', 'Korea EDCF', 'Afreximbank', 'EDFI ElectriFI'],
    lastVerified: '2026-10-29',
  },

  // --- MULTILATERAL & DFI OFFICIAL PROJECT PORTALS ---
  {
    id: 'dfi-afdb-1',
    name: 'AfDB — Secondary Cities Water Security & Non-Revenue Water Turnaround',
    sourceCategory: 'Multilateral / DFI',
    authorityName: 'African Development Bank · African Water Facility',
    officialUrl: 'https://www.afdb.org/en/projects-and-operations',
    country: 'Kenya & Zambia',
    jurisdictionKey: 'ke-county',
    rec: 'COMESA',
    sector: 'Water & sanitation',
    stage: 'feasibility',
    capexUsdM: 215,
    financingGap: 'USD 42m concessional NRW metering capex & local-currency bond wrap',
    summary:
      'Multi-utility programme reducing physical water losses from 48% to <22% while installing smart DMA telemetry and faecal sludge co-treatment.',
    agendaAlignment: 'AfDB High-5s · Water Action Decade · UMDF Municipal Pillar',
    recommendedOverlookedCapital: ['AfDB AWF', 'UMDF', 'Invest International DRIVE', 'WaterEquity', 'Dhamana'],
    lastVerified: '2026-11-12',
  },
  {
    id: 'dfi-wb-1',
    name: 'World Bank / ASCENT — Regional Solar Microgrids & Battery Storage Acceleration',
    sourceCategory: 'Multilateral / DFI',
    authorityName: 'World Bank Group · Mission 300 / ASCENT',
    officialUrl: 'https://projects.worldbank.org/en/projects-operations/projects-home',
    country: 'DRC, Zambia & Kenya',
    jurisdictionKey: 'drc-prov',
    rec: 'COMESA',
    sector: 'Renewable energy',
    stage: 'structuring',
    capexUsdM: 680,
    financingGap: 'USD 190m private commercial co-lending, FX hedging & results-based connection grants',
    summary:
      'Regional multi-country energy platform scaling clean productive-use mini-grids and peri-urban storage with standardized performance-based grants.',
    agendaAlignment: 'World Bank + AfDB Mission 300 Target (300m people connected)',
    recommendedOverlookedCapital: ['GEAPP', 'Acumen H2R', 'IKEA Foundation', 'TCX', 'EDFI ElectriFI'],
    lastVerified: '2026-11-15',
  },
  {
    id: 'dfi-dbsa-1',
    name: 'DBSA — Municipal Water Reuse & Embedded Generation Catalytic Window',
    sourceCategory: 'Multilateral / DFI',
    authorityName: 'Development Bank of Southern Africa (DBSA)',
    officialUrl: 'https://www.dbsa.org/projects',
    country: 'South Africa',
    jurisdictionKey: 'za-muni',
    rec: 'SADC',
    sector: 'Water & sanitation',
    stage: 'structuring',
    capexUsdM: 310,
    financingGap: 'R1.4bn blended DFI/grant tranche to maintain MFMA tariff affordability',
    summary:
      'Industrial wastewater reclamation + biogas cogeneration cutting municipal potable treatment stress across high-growth SA metros and districts.',
    agendaAlignment: 'DBSA Infrastructure Fund · Just Energy & Water Transition',
    recommendedOverlookedCapital: ['DBSA Green Fund', 'National Treasury BFI', 'Mining SLP Co-Funding', 'Mahlako', 'Futuregrowth'],
    lastVerified: '2026-11-14',
  },
  {
    id: 'dfi-eib-1',
    name: 'EIB / Team Europe Global Gateway — Green Ammonia Port & Desalination Corridor',
    sourceCategory: 'Multilateral / DFI',
    authorityName: 'European Investment Bank · EU Global Gateway',
    officialUrl: 'https://www.eib.org/en/projects/index.htm',
    country: 'South Africa & Egypt',
    jurisdictionKey: 'za-nat',
    rec: 'SADC',
    sector: 'Renewable energy',
    stage: 'feasibility',
    capexUsdM: 1450,
    financingGap: 'USD 340m shared port pipeline, multi-user desalination & sovereign grid reinforcement',
    summary:
      'Shared-user coastal desalination and port export common-user infrastructure unlocking private green molecule projects.',
    agendaAlignment: 'EU-Africa Global Gateway Investment Package',
    recommendedOverlookedCapital: ['EIB Global Gateway', 'Invest International D2B', 'CDP Italy', 'CIF', 'TCX'],
    lastVerified: '2026-11-09',
  },

  // --- NATIONAL OFFICIAL INFRASTRUCTURE AGENCIES AROUND AFRICA ---
  {
    id: 'nat-za-1',
    name: 'South Africa NIP 2050 / ISA — uMkhomazi & Vaal Bulk Water Augmentation SIP',
    sourceCategory: 'National Official Agency',
    authorityName: 'Infrastructure South Africa (ISA) · Dept. of Water & Sanitation',
    officialUrl: 'https://infrastructure.gov.za/',
    country: 'South Africa',
    jurisdictionKey: 'za-nat',
    rec: 'SADC',
    sector: 'Water & sanitation',
    stage: 'transaction',
    capexUsdM: 1320,
    financingGap: 'R5.5bn off-budget commercial institutional debt + BFI blend for raw-water transfer',
    summary:
      'Gazetted Strategic Integrated Project (SIP) securing long-term bulk water supply for eThekwini, uMgungundlovu, and Gauteng industrial corridors.',
    agendaAlignment: 'South Africa National Infrastructure Plan 2050 · Gazetted SIP',
    recommendedOverlookedCapital: ['Futuregrowth', 'GIPF', 'NT BFI', 'AfDB AWF', 'JSE Green Bond'],
    lastVerified: '2026-11-16',
  },
  {
    id: 'nat-ke-1',
    name: 'Kenya PPP Directorate — Menengai Geothermal & County Desalination Bundle',
    sourceCategory: 'National Official Agency',
    authorityName: 'National Treasury Kenya · PPP Directorate',
    officialUrl: 'https://www.pppunit.go.ke/',
    country: 'Kenya',
    jurisdictionKey: 'ke-county',
    rec: 'EAC',
    sector: 'Renewable energy',
    stage: 'structuring',
    capexUsdM: 490,
    financingGap: 'USD 135m KES-denominated senior tranche + PPA liquidity support',
    summary:
      'National Treasury Kenya official PPP pipeline bundling clean baseload steam generation with coastal county brackish water desalination.',
    agendaAlignment: 'Kenya Vision 2030 · PPP Act 2021 Official Pipeline',
    recommendedOverlookedCapital: ['KEPFIC', 'Dhamana', 'ATIDI RLSF', 'Frontier Energy', 'OPEC Fund'],
    lastVerified: '2026-11-11',
  },
  {
    id: 'nat-ng-1',
    name: 'Nigeria ICRC / NSIA — Presidential Clean Power & Lagos–Abuja Green Rail Hub',
    sourceCategory: 'National Official Agency',
    authorityName: 'Infrastructure Concession Regulatory Commission (ICRC) · NSIA',
    officialUrl: 'https://www.icrc.gov.ng/projects/',
    country: 'Nigeria',
    jurisdictionKey: 'za-nat',
    rec: 'ECOWAS',
    sector: 'Transport / logistics',
    stage: 'feasibility',
    capexUsdM: 980,
    financingGap: 'USD 310m local-currency guaranteed Naira infrastructure bonds & substation equipment',
    summary:
      'ICRC-certified national PPP pipeline pairing intermodal rail logistics hubs with captive industrial solar microgrids.',
    agendaAlignment: 'Nigeria National Integrated Infrastructure Master Plan (NIIMP)',
    recommendedOverlookedCapital: ['InfraCredit Nigeria', 'ARM-Harith', 'IsDB', 'Afreximbank', 'Access Bank'],
    lastVerified: '2026-11-06',
  },
  {
    id: 'nat-zm-1',
    name: 'Zambia PPP Unit — Kafue Gorge Bulk Water & Regional Solar Interconnector',
    sourceCategory: 'National Official Agency',
    authorityName: 'Ministry of Finance & National Planning · Zambia PPA',
    officialUrl: 'https://www.mofnp.gov.zm/',
    country: 'Zambia',
    jurisdictionKey: 'zm-muni',
    rec: 'SADC',
    sector: 'Water & sanitation',
    stage: 'structuring',
    capexUsdM: 275,
    financingGap: 'USD 88m ZMW local-currency debt enhancement & municipal tariff turnaround TA',
    summary:
      'National public-private package relieving drought-vulnerable hydro dependence via diversified solar-plus-storage and Lusaka/Copperbelt bulk water.',
    agendaAlignment: 'Zambia 8th National Development Plan · Energy & Water Diversification',
    recommendedOverlookedCapital: ['InfraZamin Zambia', 'BADEA', 'InfraCo Africa', 'SADC PPDF', 'PIDG TA'],
    lastVerified: '2026-11-03',
  },
  {
    id: 'nat-gh-1',
    name: 'Ghana GIPC / PPP Office — Greater Accra Coastal Sanitation & Drainage Resilience',
    sourceCategory: 'National Official Agency',
    authorityName: 'Ghana Investment Promotion Centre · Ministry of Finance PID',
    officialUrl: 'https://gipc.gov.gh/',
    country: 'Ghana',
    jurisdictionKey: 'za-muni',
    rec: 'ECOWAS',
    sector: 'Climate adaptation',
    stage: 'feasibility',
    capexUsdM: 240,
    financingGap: 'USD 65m grant/concessional flood basins + municipal waste-to-biogas equity',
    summary:
      'Climate-resilient urban drainage, nature-based mangrove retention zones, and faecal sludge valorization listed on national investment portals.',
    agendaAlignment: 'Ghana Infrastructure Plan · Greater Accra Resilience Programme',
    recommendedOverlookedCapital: ['Adaptation Fund', 'Hilton Foundation', 'IUCN BNCFF', 'EBID', 'Invest International DRIVE'],
    lastVerified: '2026-10-27',
  },
  {
    id: 'nat-eg-1',
    name: 'Egypt SCZONE — Red Sea Green Fuel Bunker & Solar Desalination Package',
    sourceCategory: 'National Official Agency',
    authorityName: 'Suez Canal Economic Zone (SCZONE) · Sovereign Fund of Egypt',
    officialUrl: 'https://sczone.eg/',
    country: 'Egypt',
    jurisdictionKey: 'za-nat',
    rec: 'North Africa',
    sector: 'Renewable energy',
    stage: 'transaction',
    capexUsdM: 2100,
    financingGap: 'USD 550m shared desalinated water intake & port green bunkering jetty capex',
    summary:
      'Official Red Sea industrial zone offering 100%-renewable desalination and green methanol/ammonia export berths backed by TSFE.',
    agendaAlignment: 'Egypt Vision 2030 · National Desalination Strategy',
    recommendedOverlookedCapital: ['TSFE', 'ADFD', 'IsDB', 'CDP Italy', 'EIB Global Gateway'],
    lastVerified: '2026-11-07',
  },
  {
    id: 'nat-ma-1',
    name: 'Morocco — Noor Midelt Solar Storage & Casablanca Seawater Desalination PPP',
    sourceCategory: 'National Official Agency',
    authorityName: 'MASEN · Moroccan Ministry of Equipment & Water',
    officialUrl: 'https://www.masen.ma/en',
    country: 'Morocco',
    jurisdictionKey: 'za-nat',
    rec: 'North Africa',
    sector: 'Water & sanitation',
    stage: 'transaction',
    capexUsdM: 1150,
    financingGap: 'USD 290m long-tenor hybrid concession debt & municipal off-take hedge',
    summary:
      'Landmark solar-powered urban and agricultural desalination PPP offsetting multi-year drought stress through private-operator tariffs.',
    agendaAlignment: 'Morocco National Water Plan 2020–2050',
    recommendedOverlookedCapital: ['Ithmar Capital', 'CIF', 'KfW', 'AFD', 'OPEC Fund'],
    lastVerified: '2026-11-04',
  },
  {
    id: 'nat-sn-1',
    name: 'Senegal APIX — Dakar Regional Bus Rapid Transit (BRT) Fleet & Clean Depot Extension',
    sourceCategory: 'National Official Agency',
    authorityName: 'APIX Senegal · CETUD Transport Authority',
    officialUrl: 'https://investinsenegal.sn/',
    country: 'Senegal',
    jurisdictionKey: 'ke-county',
    rec: 'ECOWAS',
    sector: 'Transport / logistics',
    stage: 'structuring',
    capexUsdM: 320,
    financingGap: 'EUR 95m local XOF electric-bus battery lease & depot solar charging facility',
    summary:
      'Phase 2 expansion of Dakar’s all-electric BRT corridors cutting commuting time by 50% with blended IFC/BOAD/carbon financing.',
    agendaAlignment: 'Senegal Vision 2050 · CETUD Clean Urban Mobility',
    recommendedOverlookedCapital: ['BOAD', 'Shell Foundation', 'ACMI Article 6', 'C40 CFF', 'Green Climate Fund'],
    lastVerified: '2026-10-31',
  },
];

const JURISDICTION_LABELS: Record<string, string> = {
  'za-muni': 'South Africa — Local Municipality',
  'za-metro': 'South Africa — Metropolitan',
  'za-nat': 'South Africa — National',
  'drc-prov': 'DRC — Provincial',
  'ke-county': 'Kenya — County',
  'zm-muni': 'Zambia — Local Authority',
};

/**
 * Converts an official AU Agenda 2063 / DFI / National Agency project into a full
 * actionable workspace Project complete with stage checklists and bankability gaps.
 */
export function buildProjectFromOfficial(
  official: OfficialPipelineProject,
  newId: string
): Project {
  const jLabel =
    JURISDICTION_LABELS[official.jurisdictionKey] ||
    `${official.country} — National / Regional`;

  return {
    id: newId,
    name: official.name,
    sector: official.sector,
    jurisdiction: jLabel,
    stage: official.stage,
    capex: official.capexUsdM * 1e6,
    currency: 'USD',
    updated: official.lastVerified,
    readiness:
      official.stage === 'transaction'
        ? 72
        : official.stage === 'structuring'
          ? 56
          : 34,
    desc: `${official.summary} (${official.authorityName} · ${official.agendaAlignment})`,
    stages: [
      {
        name: 'Concept & identification',
        key: 'concept',
        status: 'complete',
        activities: [
          'Official mandate listing',
          'Corridor / site definition',
          'Preliminary capex envelope',
        ],
        completedActivities: [
          'Official mandate listing',
          'Corridor / site definition',
        ],
        outputs: `Listed under ${official.authorityName}.`,
      },
      {
        name: 'Pre-feasibility & feasibility',
        key: 'feasibility',
        status: official.stage === 'feasibility' ? 'active' : 'complete',
        activities: [
          'Technical & E&S scoping',
          'Demand / tariff stress model',
          'Legal authority screening',
          'PPF grant application',
        ],
        completedActivities:
          official.stage === 'feasibility'
            ? ['Technical & E&S scoping']
            : [
                'Technical & E&S scoping',
                'Demand / tariff stress model',
                'Legal authority screening',
              ],
        outputs: `Financing focus: ${official.financingGap}`,
      },
      {
        name: 'Structuring & bankability',
        key: 'structuring',
        status:
          official.stage === 'structuring'
            ? 'active'
            : official.stage === 'transaction'
              ? 'complete'
              : 'pending',
        activities: [
          'Blended stack & FX hedge design',
          'Overlooked capital syndication',
          'Credit enhancement / guarantee lock',
        ],
        completedActivities:
          official.stage === 'transaction'
            ? [
                'Blended stack & FX hedge design',
                'Overlooked capital syndication',
              ]
            : [],
        outputs: `Target windows: ${official.recommendedOverlookedCapital.join(', ')}`,
      },
      {
        name: 'Transaction & close',
        key: 'transaction',
        status: official.stage === 'transaction' ? 'active' : 'pending',
        activities: [
          'Execute Mutual NDA & open data room',
          'Negotiate blended term sheet',
          'Close conditions precedent',
        ],
        completedActivities: [],
        outputs: 'Formal NDA, RFI, and term sheet execution in Deal Rooms.',
      },
      {
        name: 'Construction',
        key: 'construction',
        status: 'pending',
        activities: ['EPC mobilization', 'Disbursement milestones'],
        completedActivities: [],
        outputs: 'Implementation monitoring.',
      },
      {
        name: 'Operations',
        key: 'ops',
        status: 'pending',
        activities: ['Commissioning & revenue tracking', 'Refinancing'],
        completedActivities: [],
        outputs: 'Long-term operating yield.',
      },
    ],
    gaps: [
      {
        gap: `Primary gap: ${official.financingGap}`,
        severity: 'critical',
        stage: official.stage === 'feasibility' ? 'Feasibility' : 'Structuring',
        remedy: `Approach overlooked facilities: ${official.recommendedOverlookedCapital.slice(0, 3).join(', ')}`,
        status: 'Open',
      },
      {
        gap: 'FX revenue-to-debt currency mismatch evaluation',
        severity: 'high',
        stage: 'Structuring',
        remedy: 'Evaluate TCX swap or InfraCredit/GuarantCo/Dhamana local-currency guarantee',
        status: 'Open',
      },
      {
        gap: 'Sub-sovereign / national PPP legal clearance pack',
        severity: 'high',
        stage: 'Feasibility',
        remedy: `Verify statutory authority under ${jLabel} in Legal & fiscal`,
        status: 'In progress',
      },
    ],
  };
}
