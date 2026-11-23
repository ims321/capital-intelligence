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

/**
 * Curated database of real continental, DFI, and national public infrastructure
 * pipelines sourced from AUDA-NEPAD PIDA PAP-2, AfDB, World Bank IBRD/IDA, DBSA,
 * EIB Global Gateway, Infrastructure South Africa (ISA), Kenya PPP Directorate,
 * Nigeria ICRC, Zambia PPA, Ghana GIPC, Egypt SCZONE, Morocco MASEN, and Senegal APIX.
 */
export const OFFICIAL_PIPELINE_PROJECTS: OfficialPipelineProject[] = [
  // --- AU AGENDA 2063 & AUDA-NEPAD PIDA PAP-2 FLAGSHIPS ---
  {
    id: 'au-pida-1',
    name: 'Lobito Corridor Port & Open-Access Railway Modernization (AIHSRN Link)',
    sourceCategory: 'AU Agenda 2063 / PIDA',
    authorityName: 'African Union · AUDA-NEPAD PIDA PAP-2 (S3B/S4A)',
    country: 'Angola, DRC & Zambia',
    jurisdictionKey: 'zm-muni',
    rec: 'SADC',
    sector: 'Transport / logistics',
    stage: 'structuring',
    capexUsdM: 4500,
    financingGap:
      'USD 1.8bn blended concession equity, rolling-stock ECA tranches & Zambia greenfield branch line link',
    summary:
      'Sourced from AUDA-NEPAD PIDA PAP-2: Priority Agenda 2063 integrated railway & Atlantic port corridor connecting Copperbelt critical minerals and agricultural hubs to Benguela/Lobito.',
    agendaAlignment: 'Agenda 2063 Flagship #1 (AIHSRN) · PIDA Priority Action Plan 2',
    recommendedOverlookedCapital: ['NEPAD-IPPF', 'ATIDI', 'US DFC', 'SADC PPDF', 'InfraZamin Zambia'],
    lastVerified: '2026-11-10',
  },
  {
    id: 'au-pida-2',
    name: 'Grand Inga Hydropower Phase 1 & SAPP–EAPP Continental Power Pool',
    sourceCategory: 'AU Agenda 2063 / PIDA',
    authorityName: 'African Union Agenda 2063 · AUDA-NEPAD PIDA PAP-2 (S2B)',
    country: 'DRC & South Africa',
    jurisdictionKey: 'drc-prov',
    rec: 'Continental',
    sector: 'Renewable energy',
    stage: 'feasibility',
    capexUsdM: 14250,
    financingGap:
      'USD 85m updated technical/E&S bankability preparation & cross-border wheeling escrow guarantees',
    summary:
      'Sourced from AU Agenda 2063 & PIDA PAP-2: Continental baseload renewable hydro generation (~$14.25bn Phase 1) linking Congo River clean power to SAPP industrial load centers.',
    agendaAlignment: 'Agenda 2063 Flagship #2 (Grand Inga) · Continental Power Systems Master Plan',
    recommendedOverlookedCapital: ['NEPAD-IPPF', 'SADC PPDF', 'AfDB SEFA', 'TCX', 'GEAPP'],
    lastVerified: '2026-11-08',
  },
  {
    id: 'au-pida-3',
    name: 'Abidjan–Lagos Six-Lane Coastal Corridor Highway & Smart Border Posts',
    sourceCategory: 'AU Agenda 2063 / PIDA',
    authorityName: 'AUDA-NEPAD PIDA PAP-2 (S3A) · ECOWAS PPDU',
    country: 'Côte d’Ivoire, Ghana, Togo, Benin & Nigeria',
    jurisdictionKey: 'za-nat',
    rec: 'ECOWAS',
    sector: 'Transport / logistics',
    stage: 'structuring',
    capexUsdM: 15620,
    financingGap:
      'USD 620m public-private bridge/viaduct concessions & digitized One-Stop Border Post ICT tranches',
    summary:
      'Sourced from AUDA-NEPAD PIDA PAP-2 (~$15.62bn programme): Five-nation transnational highway spine anchoring West African AfCFTA trade and industrial port integration.',
    agendaAlignment: 'PIDA PAP-2 Anchor Transport Corridor · AfCFTA Priority Spine',
    recommendedOverlookedCapital: ['ECOWAS PPDU', 'EBID', 'Afreximbank', 'BADEA', 'IsDB'],
    lastVerified: '2026-11-05',
  },
  {
    id: 'au-pida-4',
    name: 'Mambilla 3,050 MW Hydroelectric Power Complex & Grid Evacuation',
    sourceCategory: 'AU Agenda 2063 / PIDA',
    authorityName: 'AUDA-NEPAD PIDA PAP-2 (S3A) · Federal Power Ministry',
    country: 'Nigeria',
    jurisdictionKey: 'za-nat',
    rec: 'ECOWAS',
    sector: 'Renewable energy',
    stage: 'structuring',
    capexUsdM: 5850,
    financingGap:
      'USD 1.4bn concessional civil-works debt, sovereign partial risk guarantee & resettlement escrow',
    summary:
      'Sourced from AUDA-NEPAD PIDA PAP-2 (~$5.85bn PIDA energy register): Flagship 3,050 MW multi-dam hydropower project on the Donga River adding firm renewable baseload to Nigeria & WAPP.',
    agendaAlignment: 'PIDA PAP-2 West Africa Clean Baseload Energy Programme',
    recommendedOverlookedCapital: ['InfraCredit Nigeria', 'IsDB', 'Saudi Fund (SFD)', 'OPEC Fund', 'Afreximbank'],
    lastVerified: '2026-11-12',
  },
  {
    id: 'au-pida-5',
    name: 'Mombasa–Nairobi–Malaba–Kampala–Kigali SGR Regional Freight Backbone',
    sourceCategory: 'AU Agenda 2063 / PIDA',
    authorityName: 'AUDA-NEPAD PIDA PAP-2 · Northern Corridor Transit Authority',
    country: 'Kenya, Uganda & Rwanda',
    jurisdictionKey: 'ke-county',
    rec: 'EAC',
    sector: 'Transport / logistics',
    stage: 'structuring',
    capexUsdM: 5200,
    financingGap:
      'USD 1.1bn cross-border Naivasha–Malaba–Kampala rail gap & intermodal inland container depots',
    summary:
      'Sourced from AUDA-NEPAD PIDA PAP-2: Standard Gauge Railway extension completing seamless Indian Ocean-to-Great Lakes freight rail interoperability.',
    agendaAlignment: 'Agenda 2063 Flagship #1 (AIHSRN) · East African Railway Master Plan',
    recommendedOverlookedCapital: ['EADB', 'TDB', 'ATIDI', 'BADEA', 'Japan NEXI'],
    lastVerified: '2026-11-04',
  },
  {
    id: 'au-pida-6',
    name: 'VICMED Lake Victoria–Mediterranean Sea Navigational & Port Spine',
    sourceCategory: 'AU Agenda 2063 / PIDA',
    authorityName: 'African Union PICI · AUDA-NEPAD PIDA PAP-2',
    country: 'Egypt, Sudan & Uganda',
    jurisdictionKey: 'ke-county',
    rec: 'COMESA',
    sector: 'Transport / logistics',
    stage: 'feasibility',
    capexUsdM: 12000,
    financingGap:
      'USD 65m Phase 2 hydrographic, environmental & multimodal river-port feasibility grant',
    summary:
      'Sourced from AUDA-NEPAD PICI / PIDA PAP-2 (~$12bn lifecycle): Presidential Infrastructure Champion Initiative creating an integrated Nile–Lake Victoria waterborne freight & passenger corridor.',
    agendaAlignment: 'African Union PICI Presidential Champion Initiative · Agenda 2063',
    recommendedOverlookedCapital: ['NEPAD-IPPF', 'AfDB AWF', 'ADFD', 'Kuwait Fund', 'Afreximbank'],
    lastVerified: '2026-11-01',
  },
  {
    id: 'au-pida-7',
    name: 'Praia–Dakar–Abidjan Multimodal Maritime & Highway Corridor',
    sourceCategory: 'AU Agenda 2063 / PIDA',
    authorityName: 'AUDA-NEPAD PIDA PAP-2 (S2B) · ECOWAS PPDU',
    country: 'Cabo Verde, Senegal, Guinea & Côte d’Ivoire',
    jurisdictionKey: 'ke-county',
    rec: 'ECOWAS',
    sector: 'Transport / logistics',
    stage: 'feasibility',
    capexUsdM: 21070,
    financingGap:
      'USD 48m maritime cabotage feeder study & priority border-bridge PPP structuring grant',
    summary:
      'Sourced from AUDA-NEPAD PIDA PAP-2 (~$21.07bn multi-phase programme): Combines West African coastal shipping modernization with Senegal–Guinea–Abidjan road corridor completion.',
    agendaAlignment: 'PIDA PAP-2 West Africa Multimodal Corridor',
    recommendedOverlookedCapital: ['ECOWAS PPDU', 'EBID', 'BOAD', 'EIB Global Gateway', 'Invest International D2B'],
    lastVerified: '2026-10-30',
  },
  {
    id: 'au-pida-8',
    name: 'Palambo Transboundary Multi-Purpose Dam & Congo Basin Water Scheme',
    sourceCategory: 'AU Agenda 2063 / PIDA',
    authorityName: 'AUDA-NEPAD PIDA PAP-2 (S2A/S2B) · CICOS / AIP Water',
    country: 'Central African Republic & DRC',
    jurisdictionKey: 'drc-prov',
    rec: 'ECCAS',
    sector: 'Water & sanitation',
    stage: 'feasibility',
    capexUsdM: 380,
    financingGap:
      'USD 15m transboundary hydrology update, dam safety feasibility & climate-resilience grant',
    summary:
      'Sourced from AUDA-NEPAD PIDA PAP-2 & AIP Water Register: Multi-purpose dam on the Ubangi River combining climate-resilient bulk water regulation, navigation support, and clean hydro.',
    agendaAlignment: 'PIDA PAP-2 Transboundary Water · Continental Africa Water Investment Programme',
    recommendedOverlookedCapital: ['AfDB AWF', 'BDEAC', 'GEF-8', 'Adaptation Fund', 'NEPAD-IPPF'],
    lastVerified: '2026-10-28',
  },

  // --- MULTILATERAL & DFI OFFICIAL PROJECT REGISTRIES ---
  {
    id: 'dfi-afdb-1',
    name: 'AfDB African Water Facility — Secondary Cities NRW & Sanitation Programme',
    sourceCategory: 'Multilateral / DFI',
    authorityName: 'African Development Bank · African Water Facility (2026 Strategy)',
    country: 'Kenya, Tanzania, Uganda & Cameroon',
    jurisdictionKey: 'ke-county',
    rec: 'COMESA',
    sector: 'Water & sanitation',
    stage: 'feasibility',
    capexUsdM: 215,
    financingGap:
      'USD 42m grant/concessional DMA smart metering capex & county utility credit wrap',
    summary:
      'Sourced from AfDB / AWF 2026–2030 Operations: Multi-utility turnaround programme cutting non-revenue water losses below 22% with resilient bulk intakes and faecal sludge treatment.',
    agendaAlignment: 'AfDB High-5s · African Water Facility 2026–2030 Pipeline',
    recommendedOverlookedCapital: ['AfDB AWF', 'AfDB UMDF', 'Invest International DRIVE', 'WaterEquity', 'Dhamana'],
    lastVerified: '2026-11-12',
  },
  {
    id: 'dfi-afdb-2',
    name: 'AfDB Infrastructure Governance & Green Freight Reform Package',
    sourceCategory: 'Multilateral / DFI',
    authorityName: 'African Development Bank Board Approval (2026)',
    country: 'South Africa',
    jurisdictionKey: 'za-nat',
    rec: 'SADC',
    sector: 'Transport / logistics',
    stage: 'transaction',
    capexUsdM: 504,
    financingGap:
      'R3.2bn private third-party freight rail rolling-stock debt & grid wheeling SPV equity',
    summary:
      'Sourced from AfDB Board Approvals (Oct/Nov 2026, USD 503.75m): Unlocks private-sector participation across electricity transmission, open-access rail corridors, and bulk water governance.',
    agendaAlignment: 'AfDB Green Growth & Private Infrastructure Reform Compact',
    recommendedOverlookedCapital: ['DBSA Green Fund', 'Old Mutual IDEAS', 'Futuregrowth', 'STANLIB Infrastructure'],
    lastVerified: '2026-11-18',
  },
  {
    id: 'dfi-wb-1',
    name: 'World Bank ASCENT / Mission 300 — Regional Solar Microgrids & BESS Scale-Up',
    sourceCategory: 'Multilateral / DFI',
    authorityName: 'World Bank Group IDA · ASCENT Regional MPA',
    country: 'DRC, Zambia & Kenya',
    jurisdictionKey: 'drc-prov',
    rec: 'COMESA',
    sector: 'Renewable energy',
    stage: 'structuring',
    capexUsdM: 680,
    financingGap:
      'USD 190m local-currency private developer debt, TCX FX hedges & results-based grants',
    summary:
      'Sourced from World Bank Group Operations: Accelerates productive-use solar mini-grids and peri-urban storage with standardized performance-based connection subsidies.',
    agendaAlignment: 'World Bank + AfDB Mission 300 Target (300m People Connected)',
    recommendedOverlookedCapital: ['GEAPP', 'Acumen H2R', 'IKEA Foundation', 'TCX', 'EDFI ElectriFI'],
    lastVerified: '2026-11-15',
  },
  {
    id: 'dfi-wb-2',
    name: 'World Bank Douala–Bangui Economic Corridor Road & Trade Package (P513683)',
    sourceCategory: 'Multilateral / DFI',
    authorityName: 'World Bank Group Board Approval (P513683 · Phase 1)',
    country: 'Cameroon & Central African Republic',
    jurisdictionKey: 'drc-prov',
    rec: 'ECCAS',
    sector: 'Transport / logistics',
    stage: 'transaction',
    capexUsdM: 420,
    financingGap:
      'USD 115m climate-resilient pavement strengthening, border logistics dry port & axle weighbridges',
    summary:
      'Sourced from World Bank Approved Pipeline (P513683): Rehabilitates and upgrades critical Central African regional freight links from Douala port into landlocked CEMAC markets.',
    agendaAlignment: 'World Bank Central Africa Corridor Resilience · CEMAC',
    recommendedOverlookedCapital: ['BDEAC', 'BADEA', 'OPEC Fund', 'EIB Global Gateway', 'AFD'],
    lastVerified: '2026-11-14',
  },
  {
    id: 'dfi-wb-3',
    name: 'World Bank RETRADE-SA Zambia–Malawi Power Interconnector (MPA Phase 4)',
    sourceCategory: 'Multilateral / DFI',
    authorityName: 'World Bank IDA · Southern African Power Pool RETRADE-SA',
    country: 'Zambia & Malawi',
    jurisdictionKey: 'zm-muni',
    rec: 'SADC',
    sector: 'Renewable energy',
    stage: 'structuring',
    capexUsdM: 395,
    financingGap:
      'USD 92m 400kV cross-border transmission EPC tranche & SAPP wheeling security escrow',
    summary:
      'Sourced from World Bank Procurement & Operations Portal: Links Zambian & East/Southern power grids to balance seasonal hydro shortfalls via clean regional electricity trade.',
    agendaAlignment: 'World Bank RETRADE-SA Multi-Phase Programmatic Approach',
    recommendedOverlookedCapital: ['SADC PPDF', 'InfraZamin Zambia', 'ATIDI', 'Norfund', 'DBSA'],
    lastVerified: '2026-11-11',
  },
  {
    id: 'dfi-dbsa-1',
    name: 'DBSA Municipal Water Reuse & Biogas Embedded Generation Facility',
    sourceCategory: 'Multilateral / DFI',
    authorityName: 'Development Bank of Southern Africa (DBSA Infrastructure Fund)',
    country: 'South Africa',
    jurisdictionKey: 'za-muni',
    rec: 'SADC',
    sector: 'Water & sanitation',
    stage: 'structuring',
    capexUsdM: 310,
    financingGap:
      'R1.4bn blended first-loss grant + DBSA concessional tranche to protect municipal tariffs',
    summary:
      'Sourced from DBSA Municipal Portfolio: Industrial effluent reclamation paired with wastewater anaerobic biogas cogeneration across secondary South African municipalities.',
    agendaAlignment: 'DBSA Infrastructure Fund · Just Energy & Water Transition',
    recommendedOverlookedCapital: ['DBSA Green Fund', 'National Treasury BFI', 'SA Mining SLP', 'Mahlako', 'Futuregrowth'],
    lastVerified: '2026-11-14',
  },
  {
    id: 'dfi-eib-1',
    name: 'EIB Team Europe Global Gateway — Green Hydrogen & Coastal Desalination Hub',
    sourceCategory: 'Multilateral / DFI',
    authorityName: 'European Investment Bank · EU Global Gateway Africa',
    country: 'South Africa & Egypt',
    jurisdictionKey: 'za-nat',
    rec: 'Continental',
    sector: 'Renewable energy',
    stage: 'feasibility',
    capexUsdM: 1450,
    financingGap:
      'USD 340m common-user seawater desalination, port export jetty & high-voltage collector grid',
    summary:
      'Sourced from EIB Global Gateway Registry: Common-user water and export port infrastructure de-risking private-sector green ammonia production along African coastal SEZs.',
    agendaAlignment: 'EU–Africa Global Gateway Flagship Investment Package',
    recommendedOverlookedCapital: ['EIB Global Gateway', 'Invest International DRIVE', 'CDP Italy', 'CIF', 'TCX'],
    lastVerified: '2026-11-09',
  },

  // --- NATIONAL OFFICIAL INFRASTRUCTURE AGENCIES ACROSS AFRICA ---
  {
    id: 'nat-za-1',
    name: 'Infrastructure SA / DWS — uMkhomazi Water Project Phase 1 (uMWP-1 SIP)',
    sourceCategory: 'National Official Agency',
    authorityName: 'Infrastructure South Africa (ISA) · Dept. of Water & Sanitation',
    country: 'South Africa',
    jurisdictionKey: 'za-nat',
    rec: 'SADC',
    sector: 'Water & sanitation',
    stage: 'transaction',
    capexUsdM: 1540,
    financingGap:
      'R9.2bn off-budget commercial institutional debt + BFI co-funding for raw-water transfer tunnel',
    summary:
      'Sourced from Infrastructure SA Gazetted SIP Register (est. R27.5bn): Smithfield Dam and 33km bulk tunnel securing KwaZulu-Natal coastal industrial and municipal water supply.',
    agendaAlignment: 'South Africa NIP 2050 · Gazetted Strategic Integrated Project (SIP)',
    recommendedOverlookedCapital: ['Futuregrowth', 'GIPF', 'National Treasury BFI', 'AfDB AWF', 'JSE Green Bonds'],
    lastVerified: '2026-11-17',
  },
  {
    id: 'nat-za-2',
    name: 'Infrastructure SA / Transnet — Boegoebaai Green Hydrogen Port & Rail SEZ (SIP)',
    sourceCategory: 'National Official Agency',
    authorityName: 'Infrastructure South Africa (ISA) · Northern Cape Economic Agency',
    country: 'South Africa',
    jurisdictionKey: 'za-nat',
    rec: 'SADC',
    sector: 'Renewable energy',
    stage: 'feasibility',
    capexUsdM: 2900,
    financingGap:
      'R450m port breakwater & heavy-haul rail feasibility + sovereign climate-blending tranche',
    summary:
      'Sourced from Infrastructure SA National Register: Deep-water port, dedicated solar/wind transmission corridor, and Northern Cape Special Economic Zone supporting export green hydrogen.',
    agendaAlignment: 'South Africa Green Hydrogen Commercialization Strategy · NIP 2050',
    recommendedOverlookedCapital: ['Invest International D2B', 'EIB Global Gateway', 'KfW', 'CIF', 'ARM-Harith'],
    lastVerified: '2026-11-16',
  },
  {
    id: 'nat-ke-1',
    name: 'Kenya PPP Directorate — Rironi–Nakuru–Mau Summit Highway DBFO',
    sourceCategory: 'National Official Agency',
    authorityName: 'National Treasury Kenya · PPP Directorate · KeNHA',
    country: 'Kenya',
    jurisdictionKey: 'ke-county',
    rec: 'EAC',
    sector: 'Transport / logistics',
    stage: 'transaction',
    capexUsdM: 1350,
    financingGap:
      'USD 380m KES-indexed annuity tranche, toll revenue guarantee & long-dated local pension debt',
    summary:
      'Sourced from Kenya PPP Directorate Official Pipeline: Upgrading 175km of Kenya’s primary Northern Corridor A8 highway into a dual-carriageway under a Design-Build-Finance-Operate concession.',
    agendaAlignment: 'Kenya PPP Act 2021 · Vision 2030 Trunk Highway Spine',
    recommendedOverlookedCapital: ['KEPFIC', 'Dhamana', 'ATIDI', 'EADB', 'Meridiam'],
    lastVerified: '2026-11-15',
  },
  {
    id: 'nat-ke-2',
    name: 'Kenya PPP Directorate — Menengai Geothermal IPPs & Mzima II Bulk Water Pipeline',
    sourceCategory: 'National Official Agency',
    authorityName: 'National Treasury Kenya · PPP Directorate',
    country: 'Kenya',
    jurisdictionKey: 'ke-county',
    rec: 'EAC',
    sector: 'Water & sanitation',
    stage: 'structuring',
    capexUsdM: 490,
    financingGap:
      'USD 135m KES-denominated senior project debt + county off-take liquidity guarantee',
    summary:
      'Sourced from Kenya PPP Directorate Pipeline: Combines Mzima II bulk coastal water security expansion with Menengai 35MW clean baseload geothermal IPP expansion phases.',
    agendaAlignment: 'Kenya Vision 2030 · PPP Directorate Priority Water & Steam Bundle',
    recommendedOverlookedCapital: ['KEPFIC', 'Dhamana', 'ATIDI', 'Frontier Energy', 'OPEC Fund'],
    lastVerified: '2026-11-11',
  },
  {
    id: 'nat-ke-3',
    name: 'Kenya PPP Directorate — Galana Kulalu Food Security & Bulk Irrigation PPP',
    sourceCategory: 'National Official Agency',
    authorityName: 'National Treasury Kenya · PPP Directorate · NIA',
    country: 'Kenya',
    jurisdictionKey: 'ke-county',
    rec: 'EAC',
    sector: 'Climate adaptation',
    stage: 'structuring',
    capexUsdM: 285,
    financingGap:
      'USD 95m bulk canal storage civil capex + solar pumping concessional tranche',
    summary:
      'Sourced from Kenya PPP Directorate Active Pipeline: Large-scale climate-resilient bulk irrigation infrastructure structuring private agro-logistics operators alongside public water works.',
    agendaAlignment: 'Kenya Bottom-Up Economic Transformation Agenda · PPP Pipeline',
    recommendedOverlookedCapital: ['EDFI AgriFI', 'KCB Green', 'Hilton Foundation', 'IFAD / Adaptation Fund', 'TDB'],
    lastVerified: '2026-11-09',
  },
  {
    id: 'nat-ng-1',
    name: 'Nigeria ICRC / NSIA — Lagos–Abuja Green Rail Hub & Captive Solar SEZ',
    sourceCategory: 'National Official Agency',
    authorityName: 'Infrastructure Concession Regulatory Commission (ICRC) · NSIA',
    country: 'Nigeria',
    jurisdictionKey: 'za-nat',
    rec: 'ECOWAS',
    sector: 'Transport / logistics',
    stage: 'feasibility',
    capexUsdM: 980,
    financingGap:
      'USD 310m Naira-guaranteed infrastructure bonds (InfraCredit) & captive solar substation debt',
    summary:
      'Sourced from Nigeria ICRC Outline Business Case (OBC) Register: Federal PPP intermodal dry-port logistics nodes paired with dedicated commercial solar mini-grid power.',
    agendaAlignment: 'Nigeria NIIMP · ICRC Federal Concession Pipeline',
    recommendedOverlookedCapital: ['InfraCredit Nigeria', 'ARM-Harith', 'IsDB', 'Afreximbank', 'Access Bank'],
    lastVerified: '2026-11-06',
  },
  {
    id: 'nat-zm-1',
    name: 'Zambia MoF / PPA — Kafue Gorge Hydro Optimization & Lusaka Bulk Water PPP',
    sourceCategory: 'National Official Agency',
    authorityName: 'Ministry of Finance & National Planning · Zambia PPP Agency',
    country: 'Zambia',
    jurisdictionKey: 'zm-muni',
    rec: 'SADC',
    sector: 'Water & sanitation',
    stage: 'structuring',
    capexUsdM: 2000,
    financingGap:
      'USD 185m ZMW local-currency debt wrap (InfraZamin), solar drought diversification & water distribution capex',
    summary:
      'Sourced from Zambia MoF / Kafue Gorge Infrastructure Registry (~$2bn Upper/Lower ecosystem): Stabilizes drought-exposed hydro output with complementary utility solar and urban bulk water.',
    agendaAlignment: 'Zambia 8th National Development Plan · Energy & Water Diversification',
    recommendedOverlookedCapital: ['InfraZamin Zambia', 'BADEA', 'InfraCo Africa', 'SADC PPDF', 'PIDG TA'],
    lastVerified: '2026-11-03',
  },
  {
    id: 'nat-gh-1',
    name: 'Ghana GIPC / MoF — Greater Accra Coastal Sanitation & Drainage Resilience',
    sourceCategory: 'National Official Agency',
    authorityName: 'Ghana Investment Promotion Centre · Ministry of Finance PID',
    country: 'Ghana',
    jurisdictionKey: 'za-muni',
    rec: 'ECOWAS',
    sector: 'Climate adaptation',
    stage: 'feasibility',
    capexUsdM: 240,
    financingGap:
      'USD 65m grant/concessional coastal retention basins + municipal waste-to-biogas equity',
    summary:
      'Sourced from Ghana GIPC / National Investment Register: Urban flood attenuation channels, nature-based mangrove buffers, and automated faecal sludge valorization.',
    agendaAlignment: 'Ghana Infrastructure Plan · Greater Accra Climate Resilience',
    recommendedOverlookedCapital: ['Adaptation Fund', 'Hilton Foundation', 'IUCN BNCFF', 'EBID', 'Invest International DRIVE'],
    lastVerified: '2026-10-27',
  },
  {
    id: 'nat-eg-1',
    name: 'Egypt SCZONE / TSFE — Ain Sokhna Green Ammonia & Solar Desalination Package',
    sourceCategory: 'National Official Agency',
    authorityName: 'Suez Canal Economic Zone (SCZONE) · Sovereign Fund of Egypt',
    country: 'Egypt',
    jurisdictionKey: 'za-nat',
    rec: 'North Africa',
    sector: 'Renewable energy',
    stage: 'transaction',
    capexUsdM: 2100,
    financingGap:
      'USD 550m shared industrial seawater desalination & green fuel export jetty capex',
    summary:
      'Sourced from Egypt SCZONE Official Pipeline: Ain Sokhna renewable-powered desalination and green ammonia export berths co-anchored by the Sovereign Fund of Egypt (TSFE).',
    agendaAlignment: 'Egypt Vision 2030 · National Desalination & Green Hydrogen Strategy',
    recommendedOverlookedCapital: ['TSFE', 'ADFD', 'IsDB', 'CDP Italy', 'EIB Global Gateway'],
    lastVerified: '2026-11-07',
  },
  {
    id: 'nat-ma-1',
    name: 'Morocco MASEN — Noor Midelt II & III Solar Storage + Casablanca Desalination',
    sourceCategory: 'National Official Agency',
    authorityName: 'MASEN · Moroccan Ministry of Equipment & Water',
    country: 'Morocco',
    jurisdictionKey: 'za-nat',
    rec: 'North Africa',
    sector: 'Water & sanitation',
    stage: 'transaction',
    capexUsdM: 2150,
    financingGap:
      'USD 290m long-tenor concession debt & agricultural/municipal desalination off-take wrap',
    summary:
      'Sourced from MASEN National Pipeline (>€2bn multi-phase programme): Pairs high-capacity Solar PV + BESS dispatchable power with large-scale seawater desalination combating multi-year drought.',
    agendaAlignment: 'Morocco National Water Plan 2020–2050 & Renewable Strategy',
    recommendedOverlookedCapital: ['Ithmar Capital', 'CIF', 'KfW', 'AFD', 'OPEC Fund'],
    lastVerified: '2026-11-04',
  },
  {
    id: 'nat-sn-1',
    name: 'Senegal APIX / CETUD — Dakar All-Electric BRT Phase 2 & Clean Depot Extension',
    sourceCategory: 'National Official Agency',
    authorityName: 'APIX Senegal · CETUD Urban Mobility Authority',
    country: 'Senegal',
    jurisdictionKey: 'ke-county',
    rec: 'ECOWAS',
    sector: 'Transport / logistics',
    stage: 'structuring',
    capexUsdM: 148,
    financingGap:
      'EUR 45m local XOF electric-bus battery lease facility & solar microgrid depot extension',
    summary:
      'Sourced from APIX / CETUD Registry (€135m baseline Phase 1/2): Expands Sub-Saharan Africa’s flagship all-electric 18.3km Dakar BRT network with blended EAIF/FONSIS/carbon revenues.',
    agendaAlignment: 'Senegal Vision 2050 · CETUD Clean Urban Mobility',
    recommendedOverlookedCapital: ['BOAD', 'Shell Foundation', 'ACMI Article 6', 'C40 CFF', 'FONSIS'],
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
 * Resolves a human-readable jurisdiction label preserving regional/country context
 * while linking to statutory profiles where applicable.
 */
function resolveJurisdictionLabel(official: OfficialPipelineProject): string {
  if (official.country === 'South Africa') {
    return JURISDICTION_LABELS[official.jurisdictionKey] || 'South Africa — National';
  }
  if (official.country === 'Kenya') return 'Kenya — County';
  if (official.country === 'Zambia') return 'Zambia — Local Authority';
  if (official.country.startsWith('DRC')) return 'DRC — Provincial';
  return `${official.country} — ${
    official.sourceCategory === 'AU Agenda 2063 / PIDA'
      ? 'Cross-Border / PIDA'
      : official.sourceCategory === 'Multilateral / DFI'
        ? 'Regional / DFI'
        : 'National PPP'
  }`;
}

/**
 * Converts an official AU Agenda 2063 / DFI / National Agency project into our
 * platform's native Project format complete with lifecycle stages, readiness score,
 * and structured bankability gaps.
 */
export function buildProjectFromOfficial(
  official: OfficialPipelineProject,
  newId: string = official.id
): Project {
  const jLabel = resolveJurisdictionLabel(official);

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
        ? 74
        : official.stage === 'structuring'
          ? 58
          : 36,
    desc: official.summary,
    sourceCategory: official.sourceCategory,
    authorityName: official.authorityName,
    rec: official.rec,
    agendaAlignment: official.agendaAlignment,
    financingGap: official.financingGap,
    recommendedOverlookedCapital: official.recommendedOverlookedCapital,
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
          'Preliminary capex envelope',
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
        gap: 'Statutory & national PPP legal clearance pack',
        severity: 'high',
        stage: 'Feasibility',
        remedy: `Verify statutory authority under ${jLabel} in Legal & fiscal`,
        status: 'In progress',
      },
    ],
  };
}

/**
 * Pre-built native Project dictionary containing all 26 sourced AU Agenda 2063,
 * Multilateral DFI, and National Official Agency projects stored directly in the
 * Capital Intelligence Project format.
 */
export const SOURCED_OFFICIAL_PROJECT_MAP: Record<string, Project> = Object.fromEntries(
  OFFICIAL_PIPELINE_PROJECTS.map((item) => [item.id, buildProjectFromOfficial(item, item.id)])
);
