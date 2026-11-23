import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { motion, useScroll, useTransform } from 'motion/react';
import countries110m from 'world-atlas/countries-110m.json';
import {
  CENTROIDS,
  CONF_META,
  FLOW_DATA,
  TYPE_COLOR,
} from '../data/capitalData';
import type { Role, TabId } from '../types/capital';
import { EvidenceText } from './SharedUI';

const HERO_IMG = '/src/assets/images/hero_africa_infra_1795347519043.jpg';
const WATER_IMG = '/src/assets/images/corridor_water_plant_1795347519114.jpg';
const SOLAR_IMG = '/src/assets/images/corridor_solar_grid_1795347519558.jpg';

interface LandingViewProps {
  projectCount: number;
  providerCount: number;
  engagementCount: number;
  onNavigate: (tab: TabId) => void;
  onEnterRole: (role: Role, tab: TabId) => void;
  onFocusMapCountry: (countryKey: string) => void;
  onOpenProjectWorkspace: (projectId: string) => void;
  onOpenTutorial: () => void;
}

const PRINCIPLES = [
  {
    num: '01',
    title: 'Legal authority first',
    text: 'A willing lender is irrelevant if the borrower cannot lawfully borrow. Statutory borrowing powers, FX approvals, and security limits are checked before matching.',
  },
  {
    num: '02',
    title: 'Stage-aware capital',
    text: 'Preparation grants and technical assistance are treated as first-class capital. Construction debt is surfaced only when bankability gaps are ready to close.',
  },
  {
    num: '03',
    title: 'Evidence over claims',
    text: 'Mandate does not equal committed money. Every capital facility carries source attribution, verification date, confidence classification, and eligibility constraints.',
  },
  {
    num: '04',
    title: 'Two-sided liquidity',
    text: 'Government borrowers structure projects and bankability gaps while capital providers configure institutional mandates. Matching is bidirectional and transparent.',
  },
  {
    num: '05',
    title: 'End-to-end workflow',
    text: 'Move seamlessly from project discovery through interest expression, mutual NDA, permissioned data room, Q&A log, term sheets, and close.',
  },
  {
    num: '06',
    title: 'Neutrality by design',
    text: 'No paid ranking or sponsored placement. Scoring reflects stage compatibility, sector alignment, legal feasibility, and verified mandate fit.',
  },
];

const FEATURED_HUBS: Array<{
  key: string;
  label: string;
  volume: string;
}> = [
  { key: 'ZAF', label: 'South Africa', volume: '$1.12bn inbound' },
  { key: 'Kenya', label: 'Kenya', volume: '$1.14bn inbound' },
  { key: 'DRC', label: 'DRC', volume: '$475m inbound' },
  { key: 'Nigeria', label: 'Nigeria', volume: '$695m inbound' },
];

export function LandingView({
  projectCount,
  providerCount,
  engagementCount,
  onNavigate,
  onEnterRole,
  onFocusMapCountry,
  onOpenProjectWorkspace,
  onOpenTutorial,
}: LandingViewProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredHub, setHoveredHub] = useState<string | null>(null);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [waterImgFailed, setWaterImgFailed] = useState(false);
  const [solarImgFailed, setSolarImgFailed] = useState(false);

  // Subtle GPU-composited scroll parallax on hero backdrop
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroBgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const heroBgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.1]);

  const worldGeo = useMemo(() => {
    const topo = countries110m as unknown as Parameters<
      typeof topojson.feature
    >[0];
    const obj = (
      countries110m as unknown as {
        objects: { countries: Parameters<typeof topojson.feature>[1] };
      }
    ).objects.countries;
    return topojson.feature(topo, obj) as unknown as GeoJSON.FeatureCollection;
  }, []);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const width = 520;
    const height = 470;
    const projection = d3
      .geoOrthographic()
      .scale(215)
      .translate([width / 2, height / 2])
      .rotate([-20, -4, 0])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection);
    const graticule = d3.geoGraticule().step([20, 20]);

    const defs = svg.append('defs');
    const globeGrad = defs
      .append('radialGradient')
      .attr('id', 'heroGlobeFill')
      .attr('cx', '40%')
      .attr('cy', '35%')
      .attr('r', '65%');
    globeGrad
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgba(18, 38, 63, 0.92)');
    globeGrad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(7, 15, 28, 0.96)');

    svg
      .append('path')
      .datum({ type: 'Sphere' } as d3.GeoPermissibleObjects)
      .attr('d', path)
      .attr('fill', 'url(#heroGlobeFill)')
      .attr('stroke', 'rgba(45, 212, 191, 0.3)')
      .attr('stroke-width', 1.2);

    svg
      .append('path')
      .datum(graticule() as d3.GeoPermissibleObjects)
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255, 255, 255, 0.06)')
      .attr('stroke-width', 0.6);

    svg
      .append('g')
      .selectAll('path')
      .data(worldGeo.features)
      .join('path')
      .attr('d', (d) => path(d as d3.GeoPermissibleObjects) || '')
      .attr('fill', (d) => {
        const name = (d.properties as { name?: string })?.name || '';
        if (
          [
            'South Africa',
            'Kenya',
            'Nigeria',
            'Ghana',
            'Zambia',
            'Senegal',
            'Dem. Rep. Congo',
            'Ethiopia',
            'Egypt',
            'Morocco',
            'Mozambique',
            'Angola',
            "Côte d'Ivoire",
          ].includes(name)
        ) {
          return '#184054';
        }
        return '#101f33';
      })
      .attr('stroke', 'rgba(255, 255, 255, 0.09)')
      .attr('stroke-width', 0.5);

    const arcGroup = svg.append('g');
    FLOW_DATA.slice(0, 18).forEach((f) => {
      const a = CENTROIDS[f.from];
      const b = CENTROIDS[f.to];
      if (!a || !b) return;
      const line: GeoJSON.LineString = {
        type: 'LineString',
        coordinates: [a, b],
      };
      const dStr = path(line as d3.GeoPermissibleObjects);
      if (!dStr) return;
      const isHighlighted =
        hoveredHub &&
        (f.to === hoveredHub ||
          f.from === hoveredHub ||
          (hoveredHub === 'ZAF' && f.to === 'South Africa'));
      arcGroup
        .append('path')
        .attr('d', dStr)
        .attr('fill', 'none')
        .attr('stroke', TYPE_COLOR[f.type])
        .attr('stroke-width', isHighlighted ? 2.5 : 1.15)
        .attr('stroke-opacity', hoveredHub ? (isHighlighted ? 0.95 : 0.16) : 0.6)
        .attr('stroke-linecap', 'round');
    });

    const hubGroup = svg.append('g');
    Object.entries(CENTROIDS).forEach(([key, coords]) => {
      if (key === 'South Africa') return;
      const proj = projection(coords);
      if (!proj) return;
      const dist = d3.geoDistance(coords, [20, 4]);
      if (dist > Math.PI / 2) return;
      const active = hoveredHub === key;
      hubGroup
        .append('circle')
        .attr('cx', proj[0])
        .attr('cy', proj[1])
        .attr('r', active ? 6 : 3.6)
        .attr('fill', active ? '#e8c36a' : '#2dd4bf')
        .attr('stroke', '#060c16')
        .attr('stroke-width', 1.2)
        .style('cursor', 'pointer')
        .on('mouseenter', () => setHoveredHub(key))
        .on('mouseleave', () => setHoveredHub(null))
        .on('click', () => onFocusMapCountry(key));
    });
  }, [worldGeo, hoveredHub, onFocusMapCountry]);

  return (
    <div className="space-y-24 pb-16">
      {/* CINEMATIC FULL-BLEED PARALLAX HERO */}
      <section
        ref={heroRef}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#07101d]"
      >
        {/* Parallax Infrastructure Photography Backdrop */}
        <motion.div
          aria-hidden="true"
          style={{ y: heroBgY, scale: heroBgScale }}
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {!heroImgFailed ? (
            <img
              src={HERO_IMG}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setHeroImgFailed(true)}
              className="h-full w-full object-cover opacity-50"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#0d2238] via-[#07101d] to-[#122a3a]" />
          )}
        </motion.div>

        {/* Measured Contrast Scrim (>=4.5:1 text legibility across all frames) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#060c16]/95 via-[#060c16]/82 to-[#060c16]/55"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060c16] via-transparent to-[#060c16]/40"
        />

        <div className="relative px-8 py-12 lg:px-14 lg:py-16">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 lg:col-span-7"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Infrastructure Capital Intelligence · Sub-Saharan Africa
              </p>
              <h1
                className="font-display font-normal tracking-tight text-slate-50"
                style={{
                  fontSize: 'clamp(2.35rem, 4.1vw, 3.75rem)',
                  lineHeight: 1.07,
                  textWrap: 'balance',
                }}
              >
                Connect African projects to global capital.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-slate-200">
                Government borrowers bring capital projects and municipal priorities.
                Institutional capital providers bring deployment mandates. Capital
                Intelligence verifies borrowing authority, sizes stage-appropriate
                funding, surfaces bankability gaps, and structures NDA-gated execution
                through to financial close.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onEnterRole('borrower', 'workspace')}
                  className="rounded-lg bg-teal-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-teal-300 whitespace-nowrap shrink-0"
                >
                  Enter Capital Workspace
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('map')}
                  className="rounded-lg border border-white/20 bg-[#060c16]/60 px-5 py-3 text-sm font-semibold text-slate-100 backdrop-blur-md transition-colors hover:bg-white/10 whitespace-nowrap shrink-0"
                >
                  Explore Flows Map
                </button>
                <button
                  type="button"
                  onClick={onOpenTutorial}
                  className="px-3 py-3 text-sm font-medium text-slate-200 underline decoration-white/30 underline-offset-4 transition-colors hover:text-teal-300 whitespace-nowrap shrink-0"
                >
                  Platform walkthrough
                </button>
              </div>
            </motion.div>

            {/* Interactive Orthographic Meridian Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center lg:col-span-5"
            >
              <div className="relative w-full max-w-[440px]">
                <svg
                  ref={svgRef}
                  viewBox="0 0 520 470"
                  className="h-auto w-full drop-shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
                  aria-label="Interactive orthographic map of African infrastructure capital corridors"
                />
                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-300">
                  {FEATURED_HUBS.map((hub) => (
                    <button
                      key={hub.key}
                      type="button"
                      onMouseEnter={() => setHoveredHub(hub.key)}
                      onMouseLeave={() => setHoveredHub(null)}
                      onClick={() => onFocusMapCountry(hub.key)}
                      className={`transition-colors whitespace-nowrap shrink-0 ${
                        hoveredHub === hub.key
                          ? 'text-amber-300 underline underline-offset-4'
                          : 'hover:text-teal-300'
                      }`}
                    >
                      {hub.label} · <span className="font-mono-num">{hub.volume}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Full-Width 4-Column Quantitative Proof Strip */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/15 pt-8 sm:grid-cols-4">
            <div className="border-r border-white/10 pr-4 last:border-r-0">
              <div className="font-mono-num text-3xl font-semibold text-slate-50">
                {projectCount}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-300">
                Active pipeline projects
              </div>
            </div>
            <div className="border-r border-white/10 pr-4 last:border-r-0">
              <div className="font-mono-num text-3xl font-semibold text-teal-300">
                {providerCount}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-300">
                Global capital providers
              </div>
            </div>
            <div className="border-r border-white/10 pr-4 last:border-r-0">
              <div className="font-mono-num text-3xl font-semibold text-slate-50">
                {engagementCount + 4}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-300">
                Live NDA &amp; term engagements
              </div>
            </div>
            <div>
              <div className="font-mono-num text-3xl font-semibold text-amber-300">
                R2.1bn
              </div>
              <div className="mt-1 text-xs font-medium text-slate-300">
                Illustrative tracked pipeline
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDITORIAL CASE-STUDY SHOWCASE (CLAIM-TO-PROOF ADJACENCY) */}
      <section aria-labelledby="showcase-heading">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">
              Live Pipeline Benchmarks
            </p>
            <h2
              id="showcase-heading"
              className="font-display mt-2 text-3xl font-medium tracking-tight text-slate-100"
            >
              From municipal water works to grid-scale solar storage
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onEnterRole('borrower', 'scenarios')}
            className="text-sm font-semibold text-teal-300 hover:text-teal-200 whitespace-nowrap shrink-0"
          >
            Open FX &amp; Rate Stress Engine →
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="group overflow-hidden rounded-xl border border-white/10 bg-[#0b1424]"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0e1c30]">
              {!waterImgFailed ? (
                <img
                  src={WATER_IMG}
                  alt="Municipal water treatment clarifier basins and piping infrastructure at dawn"
                  referrerPolicy="no-referrer"
                  onError={() => setWaterImgFailed(true)}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0e2238] to-[#081322] text-sm text-slate-400">
                  Municipal Water Treatment &amp; NRW Benchmark
                </div>
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1424] via-transparent to-transparent"
              />
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>South Africa — Local Municipality · Water &amp; sanitation</span>
                <span className="font-mono-num font-semibold text-teal-300">
                  R420.0m Capex
                </span>
              </div>
              <h3 className="font-display mt-2 text-2xl font-medium text-slate-100">
                Water Treatment Plant Upgrade &amp; NRW Reduction
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Feasibility-stage municipal package pairing DBSA PPF &amp; AfDB Water Facility
                grants with MFMA borrowing headroom validation and a R120m blended grant
                scenario.
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
                <span className="font-mono-num text-xs text-slate-400">
                  Readiness 42/100 · 6 bankability gaps tracked
                </span>
                <button
                  type="button"
                  onClick={() => onOpenProjectWorkspace('p1')}
                  className="text-xs font-semibold text-teal-300 hover:text-teal-200 whitespace-nowrap shrink-0"
                >
                  Inspect workspace →
                </button>
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="group overflow-hidden rounded-xl border border-white/10 bg-[#0b1424]"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0e1c30]">
              {!solarImgFailed ? (
                <img
                  src={SOLAR_IMG}
                  alt="Aerial view of utility-scale solar photovoltaic array and battery storage substation at dusk"
                  referrerPolicy="no-referrer"
                  onError={() => setSolarImgFailed(true)}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0e2238] to-[#081322] text-sm text-slate-400">
                  Regional Solar + Storage Programme
                </div>
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1424] via-transparent to-transparent"
              />
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>South Africa — Provincial · Renewable energy</span>
                <span className="font-mono-num font-semibold text-amber-300">
                  R1.8bn Capex
                </span>
              </div>
              <h3 className="font-display mt-2 text-2xl font-medium text-slate-100">
                Regional Solar + Grid-Scale Storage Programme
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Structuring-stage portfolio matching Climate Fund Managers equity, GuarantCo
                local-currency credit enhancements, and commercial ZAR bank tranches.
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
                <span className="font-mono-num text-xs text-slate-400">
                  Readiness 68/100 · Structuring stage
                </span>
                <button
                  type="button"
                  onClick={() => onOpenProjectWorkspace('p2')}
                  className="text-xs font-semibold text-teal-300 hover:text-teal-200 whitespace-nowrap shrink-0"
                >
                  Inspect workspace →
                </button>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* DUAL-SIDED WORKFLOW ENTRY */}
      <section aria-labelledby="dual-entry-heading">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-300">
              Two Sides, One Structured Workflow
            </p>
            <h2
              id="dual-entry-heading"
              className="font-display mt-2 text-3xl font-medium tracking-tight text-slate-100"
            >
              Choose your institutional perspective
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-400">
            Switch seamlessly at any time in the workspace toolbar. Each role unlocks
            tailored decision tools and counterparty visibility.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0b1424] p-7">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono-num text-teal-300">01 · BORROWER SIDE</span>
                <span>Municipalities · Provinces · Utilities</span>
              </div>
              <h3 className="font-display mt-3 text-2xl font-medium text-slate-100">
                Structure projects &amp; verify borrowing authority
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Register early-stage concepts, walk through the six-stage lifecycle,
                stress-test FX and floating interest exposure, resolve bankability gaps
                with preparation grants, and open NDA-gated deal rooms.
              </p>
              <ul className="mt-5 space-y-2 border-t border-white/8 pt-4 text-sm text-slate-300">
                <li>· Statutory check under South African MFMA, Kenyan PFMA &amp; regional codes</li>
                <li>· Whole-of-life blended vs commercial annuity scenario stress testing</li>
                <li>· Stage-matched scoring across 11 institutional capital categories</li>
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onEnterRole('borrower', 'projects')}
                className="rounded-lg bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-teal-300 whitespace-nowrap shrink-0"
              >
                Open Borrower Projects
              </button>
              <button
                type="button"
                onClick={() => onEnterRole('borrower', 'legal')}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/5 whitespace-nowrap shrink-0"
              >
                Check Legal Authority
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0b1424] p-7">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono-num text-amber-300">02 · CAPITAL PROVIDER SIDE</span>
                <span>DFIs · Pension Funds · SWFs · Banks</span>
              </div>
              <h3 className="font-display mt-3 text-2xl font-medium text-slate-100">
                Deploy mandates against verified readiness
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Configure ticket sizes, target geographies, and sector preferences. Discover
                pre-screened African infrastructure opportunities with explicit legal status,
                readiness scores, and blended finance fit.
              </p>
              <ul className="mt-5 space-y-2 border-t border-white/8 pt-4 text-sm text-slate-300">
                <li>· Mandate configuration with sector &amp; currency preferences</li>
                <li>· Filtered opportunity pipeline with legal-compatibility indicators</li>
                <li>· Controlled transition from interest expression to data room &amp; Q&amp;A</li>
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onEnterRole('provider', 'mandate')}
                className="rounded-lg border border-amber-300/40 bg-amber-300/15 px-4 py-2 text-sm font-semibold text-amber-200 hover:bg-amber-300/25 whitespace-nowrap shrink-0"
              >
                Configure Provider Mandate
              </button>
              <button
                type="button"
                onClick={() => onEnterRole('provider', 'opps')}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/5 whitespace-nowrap shrink-0"
              >
                Browse Opportunities
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SIX PLATFORM PRINCIPLES */}
      <section aria-labelledby="principles-heading">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Operating Doctrine
          </p>
          <h2
            id="principles-heading"
            className="font-display mt-2 text-3xl font-medium tracking-tight text-slate-100"
          >
            Platform principles
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, idx) => (
            <motion.article
              key={p.num}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl border border-white/8 bg-[#091220] p-6 transition-colors hover:border-white/16"
            >
              <span className="font-mono-num text-xs font-semibold text-teal-300">
                {p.num}
              </span>
              <h3 className="mt-2 text-base font-semibold text-slate-100">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {p.text}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* EVIDENCE LABELS TAXONOMY */}
      <section aria-labelledby="evidence-heading">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h2
              id="evidence-heading"
              className="font-display text-2xl font-medium tracking-tight text-slate-100"
            >
              Evidence &amp; verification labels
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Every facility and rule carries explicit provenance so teams separate confirmed
              windows from analytical leads.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('capital')}
            className="text-sm font-semibold text-teal-300 hover:text-teal-200 whitespace-nowrap shrink-0"
          >
            Inspect {providerCount} Capital Providers →
          </button>
        </div>

        <div className="grid gap-x-8 gap-y-4 rounded-xl border border-white/10 bg-[#0b1424] p-6 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(CONF_META) as Array<keyof typeof CONF_META>).map((key) => (
            <div
              key={key}
              className="flex flex-col gap-1 border-b border-white/6 pb-3 last:border-b-0 sm:last:border-b"
            >
              <EvidenceText level={key} />
              <p className="text-xs text-slate-400">
                {CONF_META[key].description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
