import { CAT_DEF, CATS, KEY_TO_DISPLAY, NAME_TO_KEY, STAGE_LABEL } from '../data/capitalData';
import type {
  CapitalProvider,
  FinancingScenario,
  FlowArc,
  FlowInstrumentType,
  Project,
  ScenarioResult,
  StageKey,
} from '../types/capital';

export function fmtM(n: number): string {
  return (n / 1e6).toFixed(1);
}

export function annuity(p: number, r: number, n: number): number {
  if (n <= 0) return 0;
  if (r === 0) return p / n;
  return (p * r) / (1 - Math.pow(1 + r, -n));
}

export function computeScenario(
  sc: FinancingScenario,
  shockPct = 0,
  bps = 0
): ScenarioResult {
  let annual = 0;
  let total = 0;
  let fxExposed = 0;
  let debt = 0;
  let grant = 0;
  let interest = 0;

  sc.components.forEach((c) => {
    if (c.grant) {
      grant += c.amount;
      return;
    }
    const isUsd = c.ccy !== 'ZAR';
    const amt = c.amount * (isUsd ? 1 + shockPct / 100 : 1);
    const rate = c.rate + ((c.fl || 0) * bps) / 10000;
    debt += amt;
    if (isUsd) fxExposed += amt;
    const g = c.grace || 0;
    const n = c.years - g;
    const io = amt * rate * g;
    const ann = annuity(amt, rate, n);
    annual += ann;
    total += io + ann * n;
    interest += io + ann * n - amt;
  });

  return { annual, total, fxExposed, debt, grant, interest };
}

export function scoreMatch(project: Project, capital: CapitalProvider): number {
  let score = 40;
  if (capital.stages.includes(project.stage)) score += 25;
  const sec = project.sector.toLowerCase();
  if (
    capital.sectors.some(
      (s) =>
        sec.includes(s.toLowerCase()) ||
        (s.toLowerCase().includes('water') && sec.includes('water')) ||
        (s.toLowerCase().includes('energy') && sec.includes('energy')) ||
        (s.toLowerCase().includes('transport') && sec.includes('transport'))
    )
  ) {
    score += 15;
  }
  if (
    capital.geographies.some((g) =>
      ['Africa', 'Global', 'South Africa', 'SADC'].includes(g)
    )
  ) {
    score += 10;
  }
  if (['verified', 'open'].includes(capital.confidence)) score += 8;
  if (capital.confidence === 'published') score += 5;
  if (
    project.stage === 'feasibility' &&
    (capital.type.includes('Grant') || capital.type.includes('preparation'))
  ) {
    score += 10;
  }
  return Math.min(98, score);
}

export function csvEsc(v: unknown): string {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export function serializeCapitalCSV(providers: CapitalProvider[]): string {
  const cols = [
    'name',
    'category',
    'type',
    'ticket',
    'currency',
    'geographies',
    'sectors',
    'stages',
    'description',
    'eligibility',
    'source',
  ];
  const rows = providers.map((c) =>
    [
      c.name,
      c.category,
      c.type,
      c.ticket,
      c.currency,
      c.geographies.join('; '),
      c.sectors.join('; '),
      c.stages.join('; '),
      c.desc,
      c.legal,
      c.source,
    ]
      .map(csvEsc)
      .join(',')
  );
  return [cols.join(','), ...rows].join('\n');
}

export function parseCSV(t: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let f = '';
  let q = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) {
      if (ch === '"' && t[i + 1] === '"') {
        f += '"';
        i++;
      } else if (ch === '"') {
        q = false;
      } else {
        f += ch;
      }
    } else if (ch === '"') {
      q = true;
    } else if (ch === ',') {
      row.push(f);
      f = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && t[i + 1] === '\n') i++;
      row.push(f);
      f = '';
      if (row.some((x) => x.trim())) out.push(row);
      row = [];
    } else {
      f += ch;
    }
  }
  if (f || row.length) {
    row.push(f);
    if (row.some((x) => x.trim())) out.push(row);
  }
  return out;
}

export function importProvidersFromCSV(
  csvText: string,
  existingCount: number
): CapitalProvider[] {
  const rows = parseCSV(csvText);
  if (rows.length < 2) return [];
  const head = (rows.shift() || []).map((h) => h.trim().toLowerCase());
  const g = (r: string[], k: string) => {
    const idx = head.indexOf(k);
    return idx >= 0 ? (r[idx] || '').trim() : '';
  };
  const list = (s: string) =>
    s
      .split(/[;,]/)
      .map((x) => x.trim())
      .filter(Boolean);

  const imported: CapitalProvider[] = [];
  rows.forEach((r, idx) => {
    const name = g(r, 'name');
    if (!name) return;
    const rawCat = g(r, 'category');
    const cat = CATS.includes(rawCat) ? rawCat : CATS[3];
    const D =
      Object.values(CAT_DEF).find((d) => d.c === CATS.indexOf(cat)) ||
      CAT_DEF.PE;
    const stg = list(g(r, 'stages')).filter(
      (s): s is StageKey => s in STAGE_LABEL
    );
    const secs = list(g(r, 'sectors'));
    const geos = list(g(r, 'geographies'));

    imported.push({
      id: `c${existingCount + idx + 1}i`,
      name,
      category: cat,
      type: g(r, 'type') || 'Equity',
      desc: g(r, 'description') || D.d,
      ticket: g(r, 'ticket') || 'Case-by-case',
      currency: g(r, 'currency') || 'Multi',
      stages: stg.length ? stg : D.stg,
      sectors: secs.length ? secs : ['Energy'],
      confidence: 'mandate',
      legal: g(r, 'eligibility') || D.legal,
      source: g(r, 'source') || 'CSV import — pending verification',
      verified: '2026-11-20',
      geographies: geos.length ? geos : ['Africa'],
    });
  });
  return imported;
}

export function keyOfCountryName(name: string): string {
  return NAME_TO_KEY[name] || name;
}

export function displayOfCountryKey(key: string): string {
  return KEY_TO_DISPLAY[key] || key;
}

export function matchesCountryKey(flowCountry: string, key: string): boolean {
  if (flowCountry === key) return true;
  if (key === 'ZAF' && flowCountry === 'South Africa') return true;
  if (key === 'South Africa' && flowCountry === 'ZAF') return true;
  return false;
}

export interface CorridorStats {
  outbound: FlowArc[];
  inbound: FlowArc[];
  outVol: number;
  inVol: number;
  netFlow: number;
  byInstrument: Record<FlowInstrumentType, number>;
}

export function computeCorridorStats(
  flows: FlowArc[],
  countryKey: string | null,
  direction: 'all' | 'inbound' | 'outbound' = 'all',
  activeTypes: Set<FlowInstrumentType> = new Set([
    'dfi',
    'commercial',
    'eca',
    'grant',
  ])
): CorridorStats {
  const filteredByType = flows.filter((f) => activeTypes.has(f.type));
  if (!countryKey) {
    const byInstrument: Record<FlowInstrumentType, number> = {
      dfi: 0,
      commercial: 0,
      eca: 0,
      grant: 0,
    };
    filteredByType.forEach((f) => {
      byInstrument[f.type] += f.vol;
    });
    const totalVol = filteredByType.reduce((s, f) => s + f.vol, 0);
    return {
      outbound: filteredByType,
      inbound: [],
      outVol: totalVol,
      inVol: totalVol,
      netFlow: 0,
      byInstrument,
    };
  }

  const outbound =
    direction === 'inbound'
      ? []
      : filteredByType
          .filter((f) => matchesCountryKey(f.from, countryKey))
          .sort((a, b) => b.vol - a.vol);
  const inbound =
    direction === 'outbound'
      ? []
      : filteredByType
          .filter((f) => matchesCountryKey(f.to, countryKey))
          .sort((a, b) => b.vol - a.vol);

  const outVol = outbound.reduce((s, f) => s + f.vol, 0);
  const inVol = inbound.reduce((s, f) => s + f.vol, 0);
  const byInstrument: Record<FlowInstrumentType, number> = {
    dfi: 0,
    commercial: 0,
    eca: 0,
    grant: 0,
  };
  [...outbound, ...inbound].forEach((f) => {
    byInstrument[f.type] += f.vol;
  });

  return {
    outbound,
    inbound,
    outVol,
    inVol,
    netFlow: inVol - outVol,
    byInstrument,
  };
}

export function filterProviders(
  providers: CapitalProvider[],
  filters: {
    search?: string;
    category?: string;
    type?: string;
    stage?: string;
    confidence?: string;
  }
): CapitalProvider[] {
  const q = (filters.search || '').trim().toLowerCase();
  const cat = filters.category || 'all';
  const type = filters.type || 'all';
  const stg = filters.stage || 'all';
  const conf = filters.confidence || 'all';

  return providers.filter((c) => {
    const hay = (
      c.name +
      ' ' +
      c.desc +
      ' ' +
      c.type +
      ' ' +
      c.category +
      ' ' +
      c.sectors.join(' ') +
      ' ' +
      c.geographies.join(' ')
    ).toLowerCase();
    return (
      (!q || hay.includes(q)) &&
      (cat === 'all' || c.category === cat) &&
      (type === 'all' || c.type === type) &&
      (stg === 'all' || c.stages.includes(stg as StageKey)) &&
      (conf === 'all' || c.confidence === conf)
    );
  });
}
