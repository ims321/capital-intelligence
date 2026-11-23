import test from 'node:test';
import assert from 'node:assert/strict';
import { computeProjectImpact, resolveSectorProfile } from './impact';
import { INITIAL_PROJECTS } from '../data/capitalData';

test('computeProjectImpact handles zero capex gracefully', () => {
  const res = computeProjectImpact(
    { capex: 0, sector: 'Water & sanitation', currency: 'ZAR', readiness: 50 },
    10
  );
  assert.equal(res.series.length, 10);
  assert.equal(res.totalJobYears, 0);
  assert.equal(res.cumulativeGdpM, 0);
  assert.equal(res.householdsReached, 0);
});

test('computeProjectImpact scales proportionally with capex and respects 5Y vs 10Y horizon', () => {
  const base = computeProjectImpact(
    { capex: 400e6, sector: 'Water & sanitation', currency: 'ZAR', readiness: 42 },
    10
  );
  const doubled = computeProjectImpact(
    { capex: 800e6, sector: 'Water & sanitation', currency: 'ZAR', readiness: 42 },
    10
  );

  assert.equal(base.series.length, 10);
  assert.ok(Math.abs(doubled.cumulativeGdpM - base.cumulativeGdpM * 2) <= 0.5);
  assert.ok(doubled.householdsReached === base.householdsReached * 2);

  const fiveYear = computeProjectImpact(
    { capex: 400e6, sector: 'Water & sanitation', currency: 'ZAR', readiness: 42 },
    5
  );
  assert.equal(fiveYear.series.length, 5);
  assert.ok(fiveYear.cumulativeGdpM < base.cumulativeGdpM);
  assert.ok(fiveYear.totalJobYears < base.totalJobYears);
});

test('computeProjectImpact differentiates sector multipliers and tracks monotonic cumulative GDP', () => {
  const water = computeProjectImpact(INITIAL_PROJECTS.p1, 10);
  const solar = computeProjectImpact(INITIAL_PROJECTS.p2, 10);
  const brt = computeProjectImpact(INITIAL_PROJECTS.p3, 10);

  assert.equal(resolveSectorProfile('Water & sanitation').outcomeUnit, 'ML/day');
  assert.equal(resolveSectorProfile('Renewable energy').outcomeUnit, 'ktCO₂e/yr');
  assert.equal(resolveSectorProfile('Transport / logistics').outcomeUnit, 'k trips/day');

  assert.ok(solar.effectiveGdpMultiplier > water.effectiveGdpMultiplier);
  assert.ok(brt.series[0].phase === 'Construction');
  assert.ok(brt.series[3].phase === 'Operations');

  for (let i = 1; i < water.series.length; i++) {
    assert.ok(
      water.series[i].cumulativeGdpM > water.series[i - 1].cumulativeGdpM,
      'Expected cumulative GDP to increase monotonically'
    );
  }
});
