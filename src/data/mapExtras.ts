export interface MapPoiPin {
  id: string;
  projectId?: string;
  name: string;
  countryKey: string;
  coords: [number, number];
  sector: string;
  stage: string;
  capexLabel: string;
  readiness: number;
  highlight: string;
}

export const MAP_POI_PINS: MapPoiPin[] = [
  {
    id: 'poi-1',
    projectId: 'p1',
    name: 'Water Treatment & NRW Upgrade',
    countryKey: 'ZAF',
    coords: [28.04, -26.2],
    sector: 'Water & sanitation',
    stage: 'Feasibility',
    capexLabel: 'R420m',
    readiness: 42,
    highlight: 'Needs full feasibility study & independent water audit via DBSA PPF / AfDB AWF',
  },
  {
    id: 'poi-2',
    projectId: 'p2',
    name: 'Regional Solar + Storage Programme',
    countryKey: 'ZAF',
    coords: [21.5, -28.4],
    sector: 'Renewable energy',
    stage: 'Structuring',
    capexLabel: 'R1.8bn',
    readiness: 68,
    highlight: 'PPA and GuarantCo municipal offtake wrap under review',
  },
  {
    id: 'poi-3',
    projectId: 'p3',
    name: 'Secondary City BRT Corridor',
    countryKey: 'ZAF',
    coords: [30.9, -29.8],
    sector: 'Transport / logistics',
    stage: 'Concept',
    capexLabel: 'R950m',
    readiness: 22,
    highlight: 'Early concept seeking GIF / DBSA upstream preparation grant',
  },
  {
    id: 'poi-4',
    name: 'Mombasa Port & Geothermal Corridor',
    countryKey: 'Kenya',
    coords: [39.66, -4.04],
    sector: 'Transport & Energy',
    stage: 'Structuring',
    capexLabel: '$280m',
    readiness: 74,
    highlight: 'MDB + bilateral ECA co-financing track active',
  },
  {
    id: 'poi-5',
    name: 'Kinshasa Solar Mini-Grid Cluster',
    countryKey: 'DRC',
    coords: [15.3, -4.32],
    sector: 'Climate & Energy',
    stage: 'Preparation',
    capexLabel: '$60m',
    readiness: 51,
    highlight: 'Results-based climate grant + DFI equity window',
  },
  {
    id: 'poi-6',
    name: 'Lusaka Bulk Water & Interconnector',
    countryKey: 'Zambia',
    coords: [28.28, -15.41],
    sector: 'Water & Grid',
    stage: 'Feasibility',
    capexLabel: '$180m',
    readiness: 61,
    highlight: 'SADC regional DFI & KfW grant TA window',
  },
  {
    id: 'poi-7',
    name: 'Lagos Clean Transit & Port Link',
    countryKey: 'Nigeria',
    coords: [3.38, 6.52],
    sector: 'Transport / logistics',
    stage: 'Transaction',
    capexLabel: '$320m',
    readiness: 77,
    highlight: 'AFC + NSIA local-currency infrastructure equity appetite',
  },
];

export interface CorridorSignalItem {
  id: string;
  country: string;
  countryKey: string;
  headline: string;
  signalType: string;
  impact: string;
  urgency: string;
}

export interface FxTickerRate {
  pair: string;
  rate: string;
  deltaPct: string;
}

export interface CorridorSignalsResponse {
  updatedAt: string;
  fxRates: FxTickerRate[];
  liveWindows: CorridorSignalItem[];
}

export interface AiOptimalRoute {
  fromKey: string;
  toKey: string;
  instrumentType: 'dfi' | 'commercial' | 'eca' | 'grant';
  corridorTitle: string;
  rationale: string;
  estimatedTimeline: string;
}

export interface AiHiddenGem {
  providerName: string;
  category: string;
  whyOverlooked: string;
  actionableNextStep: string;
}

export interface AiMapAdvisorResponse {
  strategySummary: string;
  optimalRoutes: AiOptimalRoute[];
  hiddenGems: AiHiddenGem[];
}

export type MapProjectionMode = 'naturalEarth' | 'mercator' | 'orthographic';
export type MapThemeMode = 'obsidian' | 'maritime' | 'blueprint';
