import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_CAPITAL, INITIAL_PROJECTS } from '../data/capitalData';
import {
  buildProjectFromOfficial,
  OFFICIAL_PIPELINE_PROJECTS,
} from '../data/continentalProjects';
import {
  defaultGoverningLawForJurisdiction,
  filterOfficialPipelines,
  generateDealDocument,
  matchesOverlookedSegment,
} from './templates';

test('generateDealDocument populates jurisdiction-specific NDA, Term Sheet, and Close Memo', () => {
  const proj = INITIAL_PROJECTS.p1;
  const prov = INITIAL_CAPITAL.find((c) => c.id === 'c1')!;

  const nda = generateDealDocument('nda', {
    project: proj,
    provider: prov,
    signatory: 'T. Mokoena',
    signatoryTitle: 'Municipal CFO',
  });
  assert.equal(nda.targetNextStatus, 'nda');
  assert.ok(nda.plainText.includes('T. Mokoena'));
  assert.ok(nda.plainText.includes('MFMA'));
  assert.ok(nda.plainText.includes(prov.name));

  const ts = generateDealDocument('termsheet', { project: proj, provider: prov });
  assert.equal(ts.targetNextStatus, 'terms');
  assert.ok(ts.clauses.some((c) => c.body.includes(prov.ticket)));

  const closeMemo = generateDealDocument('closememo', { project: proj, provider: prov });
  assert.equal(closeMemo.targetNextStatus, 'closed');
});

test('defaultGoverningLawForJurisdiction resolves African statutory regimes', () => {
  assert.ok(defaultGoverningLawForJurisdiction('Kenya — County').includes('PFMA 2012'));
  assert.ok(defaultGoverningLawForJurisdiction('DRC — Provincial').includes('OHADA'));
});

test('matchesOverlookedSegment filters non-traditional capital pockets accurately', () => {
  const allOverlooked = INITIAL_CAPITAL.filter((c) =>
    matchesOverlookedSegment(c, 'overlooked')
  );
  assert.ok(allOverlooked.length >= 70);

  const gulf = INITIAL_CAPITAL.filter((c) =>
    matchesOverlookedSegment(c, 'gulf_south_south')
  );
  assert.ok(gulf.some((c) => c.name.includes('BADEA')));
  assert.ok(gulf.some((c) => c.name.includes('Islamic Development Bank')));

  const localCcy = INITIAL_CAPITAL.filter((c) =>
    matchesOverlookedSegment(c, 'local_ccy')
  );
  assert.ok(localCcy.some((c) => c.name.includes('TCX')));
  assert.ok(localCcy.some((c) => c.name.includes('InfraCredit')));
});

test('filterOfficialPipelines and buildProjectFromOfficial cover AU Agenda 2063, DFI & National pipelines', () => {
  const auOnly = filterOfficialPipelines(OFFICIAL_PIPELINE_PROJECTS, {
    sourceCategory: 'AU Agenda 2063 / PIDA',
  });
  assert.ok(auOnly.length >= 4);

  const nationalOnly = filterOfficialPipelines(OFFICIAL_PIPELINE_PROJECTS, {
    sourceCategory: 'National Official Agency',
  });
  assert.ok(nationalOnly.length >= 5);

  const imported = buildProjectFromOfficial(auOnly[0], 'p-imported');
  assert.equal(imported.id, 'p-imported');
  assert.equal(imported.name, auOnly[0].name);
  assert.ok(imported.stages.length === 6);
  assert.ok(imported.gaps.length >= 2);
});
