import test from 'node:test';
import assert from 'node:assert/strict';
import {
  annuity,
  computeCorridorStats,
  computeScenario,
  filterProviders,
  importProvidersFromCSV,
  parseCSV,
  scoreMatch,
  serializeCapitalCSV,
} from './finance';
import {
  FLOW_DATA,
  INITIAL_CAPITAL,
  INITIAL_PROJECTS,
  SCENARIOS,
} from '../data/capitalData';

test('annuity handles zero rate and standard compounding', () => {
  assert.equal(annuity(100, 0, 10), 10);
  assert.equal(annuity(100, 0.08, 0), 0);
  const a = annuity(420e6, 0.08, 12);
  assert.ok(a > 55e6 && a < 56e6);
});

test('computeScenario calculates blended vs commercial and applies FX + bps stress', () => {
  const blended = SCENARIOS.find((s) => s.id === 'B')!;
  const eca = SCENARIOS.find((s) => s.id === 'D')!;

  const bBase = computeScenario(blended, 0, 0);
  assert.equal(bBase.grant, 120e6);
  assert.equal(bBase.debt, 300e6);
  assert.equal(bBase.fxExposed, 0);

  const bStressed = computeScenario(blended, 25, 200);
  assert.equal(bStressed.debt, 300e6);
  assert.ok(bStressed.total > bBase.total);

  const dBase = computeScenario(eca, 0, 0);
  const dStressed = computeScenario(eca, 30, 100);
  assert.equal(dBase.fxExposed, 180e6);
  assert.ok(dStressed.fxExposed > dBase.fxExposed);
  assert.equal(Math.round(dStressed.fxExposed), Math.round(180e6 * 1.3));
});

test('scoreMatch prioritizes feasibility preparation providers for feasibility project', () => {
  const waterProj = INITIAL_PROJECTS.p1;
  const dbsaPpf = INITIAL_CAPITAL.find((c) => c.id === 'c1')!;
  const pension = INITIAL_CAPITAL.find((c) => c.id === 'c38')!;

  const s1 = scoreMatch(waterProj, dbsaPpf);
  const s2 = scoreMatch(waterProj, pension);
  assert.ok(s1 > s2, `Expected DBSA PPF (${s1}) > Pension (${s2})`);
  assert.ok(s1 <= 98);
});

test('CSV round-trip preserves quoted fields and imports providers', () => {
  const sample = serializeCapitalCSV(INITIAL_CAPITAL.slice(0, 3));
  const parsed = parseCSV(sample);
  assert.equal(parsed.length, 4);

  const imported = importProvidersFromCSV(sample, 100);
  assert.equal(imported.length, 3);
  assert.equal(imported[0].name, INITIAL_CAPITAL[0].name);
  assert.equal(imported[0].confidence, 'mandate');
});

test('computeCorridorStats aggregates South Africa inbound/outbound and respects filters', () => {
  const stats = computeCorridorStats(FLOW_DATA, 'ZAF', 'all');
  assert.ok(stats.inVol > 1000);
  assert.ok(stats.outVol > 100);
  assert.equal(stats.netFlow, stats.inVol - stats.outVol);

  const dfiOnly = computeCorridorStats(
    FLOW_DATA,
    'ZAF',
    'inbound',
    new Set(['dfi'])
  );
  assert.equal(dfiOnly.outbound.length, 0);
  assert.ok(dfiOnly.inbound.every((f) => f.type === 'dfi'));
});

test('filterProviders filters by category, stage, and search term', () => {
  assert.ok(INITIAL_CAPITAL.length >= 155, `Expected >= 155 providers, got ${INITIAL_CAPITAL.length}`);
  const pensions = filterProviders(INITIAL_CAPITAL, {
    category: 'Pension funds',
  });
  assert.ok(pensions.length >= 12);

  const feasibilityGrants = filterProviders(INITIAL_CAPITAL, {
    stage: 'feasibility',
    type: 'Grant / technical assistance',
  });
  assert.ok(feasibilityGrants.length >= 5);
});
