import type { Project } from '../types/capital';

export interface SectorImpactProfile {
  label: string;
  /** Job-years per 100m currency unit during peak construction vs steady ops */
  directJobsPer100M: number;
  indirectJobsPer100M: number;
  inducedJobsPer100M: number;
  /** Operational jobs retention factor relative to construction peak */
  opsRetentionFactor: number;
  /** 10-year gross GDP multiplier per 1.0 unit of capex */
  gdpMultiplier10Y: number;
  /** Fiscal / municipal tax & tariff recovery share of GDP value added */
  fiscalReturnShare: number;
  /** Households reached per 1m currency unit */
  householdsPerM: number;
  /** Primary physical/climate outcome label & unit scaling per 1m capex */
  outcomeMetricLabel: string;
  outcomeUnit: string;
  outcomePerM: number;
  methodologyNote: string;
}

export interface AnnualImpactPoint {
  year: number;
  yearLabel: string;
  phase: 'Construction' | 'Operations';
  directJobs: number;
  indirectJobs: number;
  inducedJobs: number;
  totalJobs: number;
  annualGdpM: number;
  cumulativeGdpM: number;
  fiscalReturnM: number;
}

export interface ProjectImpactProjection {
  profile: SectorImpactProfile;
  horizonYears: 5 | 10;
  series: AnnualImpactPoint[];
  totalJobYears: number;
  directJobYears: number;
  indirectJobYears: number;
  inducedJobYears: number;
  peakAnnualJobs: number;
  permanentOpsJobs: number;
  cumulativeGdpM: number;
  effectiveGdpMultiplier: number;
  cumulativeFiscalReturnM: number;
  householdsReached: number;
  primaryOutcomeValue: number;
  primaryOutcomeFormatted: string;
}

const SECTOR_PROFILES: Record<string, SectorImpactProfile> = {
  water: {
    label: 'Water & sanitation',
    directJobsPer100M: 145,
    indirectJobsPer100M: 110,
    inducedJobsPer100M: 85,
    opsRetentionFactor: 0.34,
    gdpMultiplier10Y: 2.35,
    fiscalReturnShare: 0.19,
    householdsPerM: 92,
    outcomeMetricLabel: 'Treated capacity & NRW saved',
    outcomeUnit: 'ML/day',
    outcomePerM: 0.085,
    methodologyNote:
      'Calibrated to municipal bulk-water & NRW reduction benchmarks: high civil-works labor intensity in Years 1–3 followed by tariff stabilization and commercial continuity.',
  },
  energy: {
    label: 'Renewable energy',
    directJobsPer100M: 95,
    indirectJobsPer100M: 135,
    inducedJobsPer100M: 105,
    opsRetentionFactor: 0.28,
    gdpMultiplier10Y: 2.68,
    fiscalReturnShare: 0.21,
    householdsPerM: 140,
    outcomeMetricLabel: 'Emissions avoided annually',
    outcomeUnit: 'ktCO₂e/yr',
    outcomePerM: 0.145,
    methodologyNote:
      'Calibrated to utility-scale solar PV + BESS grid programmes: industrial manufacturing spillovers in construction plus avoided load-shedding productivity gains across Years 4–10.',
  },
  transport: {
    label: 'Transport / logistics',
    directJobsPer100M: 165,
    indirectJobsPer100M: 125,
    inducedJobsPer100M: 115,
    opsRetentionFactor: 0.42,
    gdpMultiplier10Y: 2.52,
    fiscalReturnShare: 0.18,
    householdsPerM: 115,
    outcomeMetricLabel: 'Commuter & freight trips served',
    outcomeUnit: 'k trips/day',
    outcomePerM: 0.062,
    methodologyNote:
      'Calibrated to BRT & regional freight corridor multipliers: sustained transit operations staffing plus urban land-value and logistics time savings.',
  },
  municipal: {
    label: 'Municipal services',
    directJobsPer100M: 130,
    indirectJobsPer100M: 95,
    inducedJobsPer100M: 80,
    opsRetentionFactor: 0.36,
    gdpMultiplier10Y: 2.15,
    fiscalReturnShare: 0.2,
    householdsPerM: 85,
    outcomeMetricLabel: 'Service reliability uplift',
    outcomeUnit: 'k residents',
    outcomePerM: 0.24,
    methodologyNote:
      'Calibrated to municipal network rehabilitation & civic infrastructure upgrades focusing on local contractor participation and revenue collection recovery.',
  },
  climate: {
    label: 'Climate adaptation',
    directJobsPer100M: 120,
    indirectJobsPer100M: 105,
    inducedJobsPer100M: 90,
    opsRetentionFactor: 0.31,
    gdpMultiplier10Y: 2.4,
    fiscalReturnShare: 0.17,
    householdsPerM: 105,
    outcomeMetricLabel: 'Flood & drought loss avoided',
    outcomeUnit: 'm/yr avoided',
    outcomePerM: 0.18,
    methodologyNote:
      'Calibrated to coastal resilience, stormwater retention, and climate-proofing programmes accounting for avoided municipal disaster losses over a 10-year cycle.',
  },
};

export function resolveSectorProfile(sector: string): SectorImpactProfile {
  const s = (sector || '').toLowerCase();
  if (s.includes('water') || s.includes('sanitation')) return SECTOR_PROFILES.water;
  if (s.includes('energy') || s.includes('solar') || s.includes('power')) {
    return SECTOR_PROFILES.energy;
  }
  if (s.includes('transport') || s.includes('logistics') || s.includes('brt')) {
    return SECTOR_PROFILES.transport;
  }
  if (s.includes('climate') || s.includes('adaptation')) {
    return SECTOR_PROFILES.climate;
  }
  return SECTOR_PROFILES.municipal;
}

// Year-by-year construction-to-operations weighting curves (sum of GDP weights = 1.0 over 10Y)
const JOB_PHASE_WEIGHTS = [0.72, 1.0, 0.85, 0.36, 0.35, 0.35, 0.36, 0.36, 0.37, 0.38];
const GDP_YEAR_SHARES = [0.075, 0.11, 0.105, 0.09, 0.095, 0.1, 0.103, 0.106, 0.108, 0.108];

export function computeProjectImpact(
  project: Pick<Project, 'capex' | 'sector' | 'currency' | 'readiness'>,
  horizonYears: 5 | 10 = 10
): ProjectImpactProjection {
  const profile = resolveSectorProfile(project.sector);
  const safeCapex = Number.isFinite(project.capex) && project.capex > 0 ? project.capex : 0;
  const capexM = safeCapex / 1e6;
  const capexUnits100M = safeCapex / 1e8;

  // Readiness slightly modulates early-stage execution certainty (0.94x to 1.04x) without distorting base scale
  const readinessAdj = 0.96 + Math.min(100, Math.max(0, project.readiness || 0)) * 0.0008;

  const totalGdp10Y = capexM * profile.gdpMultiplier10Y * readinessAdj;

  const fullSeries: AnnualImpactPoint[] = [];
  let runningGdpM = 0;

  for (let i = 0; i < 10; i++) {
    const yearNum = i + 1;
    const isConstruction = yearNum <= 3;
    const phaseFactor = isConstruction
      ? JOB_PHASE_WEIGHTS[i]
      : profile.opsRetentionFactor * (1 + (i - 3) * 0.025);

    const directJobs = Math.round(capexUnits100M * profile.directJobsPer100M * phaseFactor);
    const indirectJobs = Math.round(
      capexUnits100M * profile.indirectJobsPer100M * (isConstruction ? phaseFactor : phaseFactor * 1.15)
    );
    const inducedJobs = Math.round(
      capexUnits100M * profile.inducedJobsPer100M * (isConstruction ? phaseFactor * 0.9 : phaseFactor * 1.35)
    );
    const totalJobs = directJobs + indirectJobs + inducedJobs;

    const annualGdpM = Number((totalGdp10Y * GDP_YEAR_SHARES[i]).toFixed(1));
    runningGdpM = Number((runningGdpM + annualGdpM).toFixed(1));
    const fiscalReturnM = Number((annualGdpM * profile.fiscalReturnShare).toFixed(1));

    fullSeries.push({
      year: yearNum,
      yearLabel: `Y${yearNum}`,
      phase: isConstruction ? 'Construction' : 'Operations',
      directJobs,
      indirectJobs,
      inducedJobs,
      totalJobs,
      annualGdpM,
      cumulativeGdpM: runningGdpM,
      fiscalReturnM,
    });
  }

  const series = fullSeries.slice(0, horizonYears);
  const directJobYears = series.reduce((acc, p) => acc + p.directJobs, 0);
  const indirectJobYears = series.reduce((acc, p) => acc + p.indirectJobs, 0);
  const inducedJobYears = series.reduce((acc, p) => acc + p.inducedJobs, 0);
  const totalJobYears = directJobYears + indirectJobYears + inducedJobYears;

  const peakAnnualJobs = series.reduce((max, p) => Math.max(max, p.totalJobs), 0);
  const permanentOpsJobs =
    series.find((p) => p.phase === 'Operations')?.totalJobs ??
    (series[series.length - 1]?.totalJobs || 0);

  const cumulativeGdpM = series.length > 0 ? series[series.length - 1].cumulativeGdpM : 0;
  const effectiveGdpMultiplier = capexM > 0 ? Number((cumulativeGdpM / capexM).toFixed(2)) : 0;
  const cumulativeFiscalReturnM = Number(
    series.reduce((acc, p) => acc + p.fiscalReturnM, 0).toFixed(1)
  );

  const householdsReached = Math.round(capexM * profile.householdsPerM);
  const primaryOutcomeValue = Number((capexM * profile.outcomePerM).toFixed(1));

  const ccyPrefix = project.currency === 'ZAR' ? 'R' : project.currency === 'USD' ? '$' : `${project.currency} `;
  const primaryOutcomeFormatted =
    profile.outcomeUnit === 'm/yr avoided'
      ? `${ccyPrefix}${primaryOutcomeValue.toFixed(1)}m/yr`
      : `${primaryOutcomeValue.toLocaleString('en-US', { maximumFractionDigits: 1 })} ${profile.outcomeUnit}`;

  return {
    profile,
    horizonYears,
    series,
    totalJobYears,
    directJobYears,
    indirectJobYears,
    inducedJobYears,
    peakAnnualJobs,
    permanentOpsJobs,
    cumulativeGdpM,
    effectiveGdpMultiplier,
    cumulativeFiscalReturnM,
    householdsReached,
    primaryOutcomeValue,
    primaryOutcomeFormatted,
  };
}
