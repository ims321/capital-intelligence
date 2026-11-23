import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import countries110m from 'world-atlas/countries-110m.json';
import {
  CENTROIDS,
  COUNTRY_JURISDICTION_LINK,
  FLOW_DATA,
  REGION_PRESETS,
  TRANSACTIONS,
  TYPE_COLOR,
  TYPE_LABEL,
} from '../data/capitalData';
import {
  MAP_POI_PINS,
  type AiMapAdvisorResponse,
  type CorridorSignalsResponse,
  type MapPoiPin,
  type MapProjectionMode,
  type MapThemeMode,
} from '../data/mapExtras';
import type {
  CapitalProvider,
  FlowArc,
  FlowInstrumentType,
  TabId,
} from '../types/capital';
import {
  computeCorridorStats,
  displayOfCountryKey,
  keyOfCountryName,
  matchesCountryKey,
} from '../utils/finance';

interface FlowsMapViewProps {
  providers: CapitalProvider[];
  focusedCountry: string | null;
  onFocusCountry: (key: string | null) => void;
  onExploreProvidersForCountry: (countryName: string) => void;
  onInspectLegalForJurisdiction: (jurisdictionKey: string) => void;
  onOpenProjectWorkspace: (projectId: string) => void;
  onNavigate?: (tab: TabId) => void;
}

const ALL_TYPES: FlowInstrumentType[] = ['dfi', 'commercial', 'eca', 'grant'];

const QUICK_MARKETS: Array<{ key: string; label: string }> = [
  { key: 'ZAF', label: 'South Africa' },
  { key: 'Kenya', label: 'Kenya' },
  { key: 'Nigeria', label: 'Nigeria' },
  { key: 'DRC', label: 'DRC' },
  { key: 'Ghana', label: 'Ghana' },
  { key: 'Zambia', label: 'Zambia' },
  { key: 'USA', label: 'USA' },
  { key: 'CHN', label: 'China' },
  { key: 'DEU', label: 'Germany' },
];

const MAP_THEMES: Record<
  MapThemeMode,
  {
    bg: string;
    land: string;
    landConnected: string;
    landFocused: string;
    landDim: string;
    stroke: string;
    grid: string;
    label: string;
  }
> = {
  obsidian: {
    bg: '#050b14',
    land: '#17283e',
    landConnected: '#1c3a57',
    landFocused: '#0f766e',
    landDim: '#101c2d',
    stroke: '#09111d',
    grid: 'rgba(255,255,255,0.045)',
    label: 'Obsidian',
  },
  maritime: {
    bg: '#04121c',
    land: '#133144',
    landConnected: '#1b4965',
    landFocused: '#0d9488',
    landDim: '#0c202e',
    stroke: '#071a26',
    grid: 'rgba(56,189,248,0.07)',
    label: 'Maritime',
  },
  blueprint: {
    bg: '#081024',
    land: '#172554',
    landConnected: '#1e3a8a',
    landFocused: '#14b8a6',
    landDim: '#0f172a',
    stroke: '#3b82f6',
    grid: 'rgba(96,165,250,0.1)',
    label: 'Blueprint',
  },
};

export function FlowsMapView({
  providers,
  focusedCountry,
  onFocusCountry,
  onExploreProvidersForCountry,
  onInspectLegalForJurisdiction,
  onOpenProjectWorkspace,
}: FlowsMapViewProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(
    null
  );
  const animFrameRef = useRef<number | null>(null);

  // Map view & customization state
  const [projectionMode, setProjectionMode] =
    useState<MapProjectionMode>('naturalEarth');
  const [mapTheme, setMapTheme] = useState<MapThemeMode>('obsidian');
  const [showGraticule, setShowGraticule] = useState<boolean>(true);
  const [showPoiPins, setShowPoiPins] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [globeRotation, setGlobeRotation] = useState<[number, number]>([-20, -4]);

  // Corridor filter state
  const [activeRegion, setActiveRegion] = useState<string>('global');
  const [showAllCorridors, setShowAllCorridors] = useState<boolean>(false);
  const [direction, setDirection] = useState<'all' | 'inbound' | 'outbound'>(
    'all'
  );
  const [activeTypes, setActiveTypes] = useState<Set<FlowInstrumentType>>(
    () => new Set(ALL_TYPES)
  );
  const [animationEnabled, setAnimationEnabled] = useState<boolean>(false);

  // Interactive inspection state
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    title: string;
    subtitle: string;
  } | null>(null);
  const [hoveredArc, setHoveredArc] = useState<FlowArc | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<MapPoiPin | null>(null);

  // Real-time signals state
  const [signals, setSignals] = useState<CorridorSignalsResponse | null>(null);
  const [signalsLoading, setSignalsLoading] = useState<boolean>(false);
  const [signalsError, setSignalsError] = useState<string | null>(null);

  // AI Optimal Route & Hidden Gems Strategist state
  const [aiCountry, setAiCountry] = useState<string>('South Africa');
  const [aiSector, setAiSector] = useState<string>('Water & sanitation');
  const [aiStage, setAiStage] = useState<string>('feasibility');
  const [aiPriority, setAiPriority] = useState<string>('Lowest Cost / Blended');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AiMapAdvisorResponse | null>(null);

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

  const fetchSignals = useCallback(async () => {
    setSignalsLoading(true);
    setSignalsError(null);
    try {
      const res = await fetch('/api/corridor-signals');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as CorridorSignalsResponse;
      setSignals(data);
    } catch (err) {
      setSignalsError(
        err instanceof Error ? err.message : 'Unable to refresh live signals'
      );
    } finally {
      setSignalsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  const handleRunAiAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    setAiError(null);
    try {
      const historicalFlows = FLOW_DATA.slice(0, 24);
      const candidateProviders = providers
        .slice(0, 35)
        .map((p) => ({
          name: p.name,
          category: p.category,
          type: p.type,
          ticket: p.ticket,
          stages: p.stages,
          sectors: p.sectors,
          geographies: p.geographies,
        }));

      const res = await fetch('/api/map-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCountry: aiCountry,
          sector: aiSector,
          stage: aiStage,
          priority: aiPriority,
          historicalFlows,
          candidateProviders,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || `Request failed (${res.status})`);
      }
      setAiResult(payload as AiMapAdvisorResponse);
      const targetKey = aiCountry === 'South Africa' ? 'ZAF' : aiCountry;
      onFocusCountry(targetKey);
    } catch (err) {
      setAiError(
        err instanceof Error ? err.message : 'Failed to run AI route advisor'
      );
    } finally {
      setAiLoading(false);
    }
  };

  const corridorStats = useMemo(
    () =>
      computeCorridorStats(FLOW_DATA, focusedCountry, direction, activeTypes),
    [focusedCountry, direction, activeTypes]
  );

  const matchedProviders = useMemo(() => {
    if (!focusedCountry) return [];
    const disp = displayOfCountryKey(focusedCountry).toLowerCase();
    return providers
      .filter((p) =>
        p.geographies.some(
          (g) =>
            g.toLowerCase() === disp ||
            (focusedCountry === 'ZAF' && g.toLowerCase() === 'south africa') ||
            g.toLowerCase() === 'africa'
        )
      )
      .slice(0, 4);
  }, [focusedCountry, providers]);

  const countryTxns = useMemo(() => {
    if (!focusedCountry) return [];
    const disp = displayOfCountryKey(focusedCountry).toLowerCase();
    return TRANSACTIONS.filter(
      (t) =>
        t.country.toLowerCase() === disp ||
        (focusedCountry === 'ZAF' && t.country.toLowerCase() === 'south africa')
    );
  }, [focusedCountry]);

  const toggleType = (type: FlowInstrumentType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const buildProjection = useCallback(
    (width: number, height: number) => {
      if (projectionMode === 'mercator') {
        return d3
          .geoMercator()
          .scale(width / 6.3)
          .translate([width / 2, height / 2 + 45]);
      }
      if (projectionMode === 'orthographic') {
        return d3
          .geoOrthographic()
          .scale(250)
          .translate([width / 2, height / 2])
          .rotate([globeRotation[0], globeRotation[1], 0])
          .clipAngle(90);
      }
      return d3
        .geoNaturalEarth1()
        .scale(width / 5.75)
        .translate([width / 2, height / 2 + 12]);
    },
    [projectionMode, globeRotation]
  );

  // Render map geometry + interactive layers whenever projection, theme, or filters change
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const width = 1120;
    const height = 580;
    const theme = MAP_THEMES[mapTheme];
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const projection = buildProjection(width, height);
    const path = d3.geoPath().projection(projection);
    const rootG = svg.append('g').attr('class', 'map-root');

    // Sphere outline in Orthographic mode
    if (projectionMode === 'orthographic') {
      rootG
        .append('path')
        .datum({ type: 'Sphere' } as d3.GeoPermissibleObjects)
        .attr('d', path)
        .attr('fill', '#071323')
        .attr('stroke', 'rgba(45, 212, 191, 0.25)')
        .attr('stroke-width', 1.2);
    }

    // Graticule
    if (showGraticule) {
      rootG
        .append('path')
        .datum(d3.geoGraticule()() as d3.GeoPermissibleObjects)
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', theme.grid)
        .attr('stroke-width', 0.6);
    }

    // Determine visible corridors
    const connectedSet = new Set<string>();
    const visibleFlows = FLOW_DATA.filter((f) => {
      if (!activeTypes.has(f.type)) return false;
      if (focusedCountry) {
        const isOut = matchesCountryKey(f.from, focusedCountry);
        const isIn = matchesCountryKey(f.to, focusedCountry);
        if (direction === 'outbound') return isOut;
        if (direction === 'inbound') return isIn;
        return isOut || isIn;
      }
      return showAllCorridors;
    });

    visibleFlows.forEach((f) => {
      connectedSet.add(f.from === 'South Africa' ? 'ZAF' : f.from);
      connectedSet.add(f.to === 'South Africa' ? 'ZAF' : f.to);
    });

    // Countries layer
    rootG
      .append('g')
      .attr('class', 'countries')
      .selectAll('path')
      .data(worldGeo.features)
      .join('path')
      .attr('class', 'country-shape')
      .attr('d', (d) => path(d as d3.GeoPermissibleObjects) || '')
      .attr('fill', (d) => {
        const name = (d.properties as { name?: string })?.name || '';
        const k = keyOfCountryName(name);
        if (focusedCountry && matchesCountryKey(k, focusedCountry)) {
          return theme.landFocused;
        }
        if (focusedCountry && connectedSet.has(k)) {
          return theme.landConnected;
        }
        if (focusedCountry) {
          return theme.landDim;
        }
        return theme.land;
      })
      .attr('fill-opacity', (d) => {
        if (!focusedCountry) return 1;
        const name = (d.properties as { name?: string })?.name || '';
        const k = keyOfCountryName(name);
        return matchesCountryKey(k, focusedCountry) || connectedSet.has(k)
          ? 1
          : 0.48;
      })
      .attr('stroke', theme.stroke)
      .attr('stroke-width', mapTheme === 'blueprint' ? 0.7 : 0.55)
      .style('cursor', 'pointer')
      .on('click', (_event, d) => {
        const name = (d.properties as { name?: string })?.name || '';
        const k = keyOfCountryName(name);
        setSelectedPoi(null);
        onFocusCountry(k);
      })
      .on('mousemove', (event, d) => {
        const name = (d.properties as { name?: string })?.name || 'Market';
        const k = keyOfCountryName(name);
        const stats = computeCorridorStats(FLOW_DATA, k, 'all', activeTypes);
        const hasFlows = stats.inbound.length > 0 || stats.outbound.length > 0;
        const rect = svgEl.getBoundingClientRect();
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          title: name,
          subtitle: hasFlows
            ? `Inbound: $${stats.inVol}m · Outbound: $${stats.outVol}m`
            : 'Click to inspect market corridors',
        });
      })
      .on('mouseleave', () => setTooltip(null));

    const arcsLayer = rootG.append('g').attr('class', 'arcs-layer');
    const aiArcsLayer = rootG.append('g').attr('class', 'ai-arcs-layer');
    const hubsLayer = rootG.append('g').attr('class', 'hubs-layer');
    const poiLayer = rootG.append('g').attr('class', 'poi-layer');
    const particlesLayer = rootG.append('g').attr('class', 'particles-layer');

    const particles: Array<{
      path: SVGPathElement;
      len: number;
      offset: number;
      speed: number;
      color: string;
      r: number;
      circle: d3.Selection<SVGCircleElement, unknown, null, undefined>;
    }> = [];

    const createArcD = (fromKey: string, toKey: string): string | null => {
      const a = CENTROIDS[fromKey];
      const b = CENTROIDS[toKey];
      if (!a || !b) return null;
      if (projectionMode === 'orthographic') {
        const line: GeoJSON.LineString = {
          type: 'LineString',
          coordinates: [a, b],
        };
        return path(line as d3.GeoPermissibleObjects) || null;
      }
      const s = projection(a);
      const t = projection(b);
      if (!s || !t) return null;
      const dx = t[0] - s[0];
      const dy = t[1] - s[1];
      const dr = Math.sqrt(dx * dx + dy * dy) * 1.45;
      const sweep = s[0] < t[0] ? 1 : 0;
      return `M${s[0]},${s[1]}A${dr},${dr} 0 0,${sweep} ${t[0]},${t[1]}`;
    };

    // Draw standard flow arcs
    visibleFlows.forEach((f) => {
      const dStr = createArcD(f.from, f.to);
      if (!dStr) return;
      const color = TYPE_COLOR[f.type];
      const strokeW = Math.max(1.4, Math.min(4.8, f.vol / 88));

      const pathEl = arcsLayer
        .append('path')
        .attr('d', dStr)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', strokeW)
        .attr('stroke-opacity', focusedCountry ? 0.82 : 0.48)
        .attr('stroke-linecap', 'round')
        .style('cursor', 'pointer')
        .on('mouseenter', () => setHoveredArc(f))
        .on('mouseleave', () => {
          setHoveredArc(null);
          setTooltip(null);
        })
        .on('mousemove', (event) => {
          const rect = svgEl.getBoundingClientRect();
          setTooltip({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            title: `${f.from} → ${f.to}`,
            subtitle: `~$${f.vol}m · ${TYPE_LABEL[f.type]}${
              f.sector ? ` · ${f.sector}` : ''
            }`,
          });
        })
        .on('click', (event) => {
          event.stopPropagation();
          const targetKey =
            focusedCountry && matchesCountryKey(f.to, focusedCountry)
              ? f.from === 'South Africa'
                ? 'ZAF'
                : f.from
              : f.to === 'South Africa'
                ? 'ZAF'
                : f.to;
          onFocusCountry(targetKey);
        });

      const node = pathEl.node();
      if (animationEnabled && node) {
        const len = node.getTotalLength();
        const count = Math.max(1, Math.round(f.vol / 140));
        for (let i = 0; i < count; i++) {
          const r = 2.1 + f.vol / 320;
          const circle = particlesLayer
            .append('circle')
            .attr('r', r)
            .attr('fill', color)
            .attr('opacity', 0.92);
          particles.push({
            path: node,
            len,
            offset: i / count,
            speed: 0.0022 + (f.vol / 420) * 0.0012,
            color,
            r,
            circle,
          });
        }
      }
    });

    // Draw AI Recommended Optimal Routes (dashed luminous gold highlight arcs)
    if (aiResult?.optimalRoutes?.length) {
      aiResult.optimalRoutes.forEach((route) => {
        const dStr = createArcD(route.fromKey, route.toKey);
        if (!dStr) return;
        const aiPath = aiArcsLayer
          .append('path')
          .attr('d', dStr)
          .attr('fill', 'none')
          .attr('stroke', '#facc15')
          .attr('stroke-width', 2.6)
          .attr('stroke-dasharray', '6 4')
          .attr('stroke-opacity', 0.95)
          .style('cursor', 'pointer')
          .on('mousemove', (event) => {
            const rect = svgEl.getBoundingClientRect();
            setTooltip({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              title: `AI Optimal Route: ${route.corridorTitle}`,
              subtitle: `${route.fromKey} → ${route.toKey} · ${route.estimatedTimeline}`,
            });
          })
          .on('mouseleave', () => setTooltip(null));

        const node = aiPath.node();
        if (animationEnabled && node) {
          const len = node.getTotalLength();
          const circle = particlesLayer
            .append('circle')
            .attr('r', 3.4)
            .attr('fill', '#fde047')
            .attr('opacity', 0.95);
          particles.push({
            path: node,
            len,
            offset: 0,
            speed: 0.0032,
            color: '#fde047',
            r: 3.4,
            circle,
          });
        }
      });
    }

    // Active market hubs & optional labels
    const hubKeys = new Set<string>();
    FLOW_DATA.forEach((f) => {
      hubKeys.add(f.from === 'South Africa' ? 'ZAF' : f.from);
      hubKeys.add(f.to === 'South Africa' ? 'ZAF' : f.to);
    });

    hubKeys.forEach((k) => {
      const coords = CENTROIDS[k];
      if (!coords) return;
      if (projectionMode === 'orthographic') {
        const dist = d3.geoDistance(coords, [-globeRotation[0], -globeRotation[1]]);
        if (dist > Math.PI / 2) return;
      }
      const proj = projection(coords);
      if (!proj) return;
      const isFocused = focusedCountry && matchesCountryKey(k, focusedCountry);
      const isConnected = focusedCountry && connectedSet.has(k);

      hubsLayer
        .append('circle')
        .attr('cx', proj[0])
        .attr('cy', proj[1])
        .attr('r', isFocused ? 6 : isConnected ? 4.5 : 3.4)
        .attr('fill', isFocused ? '#e8c36a' : '#2dd4bf')
        .attr('fill-opacity', 0.85)
        .attr('stroke', '#060c16')
        .attr('stroke-width', 1)
        .style('cursor', 'pointer')
        .on('click', (event) => {
          event.stopPropagation();
          setSelectedPoi(null);
          onFocusCountry(k);
        });

      if (showLabels && (isFocused || isConnected || (!focusedCountry && ['ZAF', 'Kenya', 'Nigeria', 'DRC', 'USA', 'CHN', 'DEU'].includes(k)))) {
        const LABEL_OFFSETS: Record<string, [number, number]> = {
          GBR: [-26, -7],
          NLD: [-6, -13],
          DEU: [9, 3],
          FRA: [-22, 10],
          SWE: [8, -8],
          ZAF: [9, 14],
          Kenya: [9, -5],
          Zambia: [9, -4],
          DRC: [9, -4],
        };
        const [dx, dy] = LABEL_OFFSETS[k] ?? [7, 3];
        hubsLayer
          .append('text')
          .attr('x', proj[0] + dx)
          .attr('y', proj[1] + dy)
          .attr('fill', isFocused ? '#fde68a' : '#cbd5e1')
          .attr('font-size', '9.5px')
          .attr('font-weight', isFocused ? '700' : '500')
          .attr('paint-order', 'stroke')
          .attr('stroke', MAP_THEMES[mapTheme].bg)
          .attr('stroke-width', 3)
          .attr('stroke-linejoin', 'round')
          .attr('pointer-events', 'none')
          .text(k === 'ZAF' ? 'South Africa' : k);
      }
    });

    // Infrastructure POI Pins Layer
    if (showPoiPins) {
      MAP_POI_PINS.forEach((poi) => {
        if (projectionMode === 'orthographic') {
          const dist = d3.geoDistance(poi.coords, [-globeRotation[0], -globeRotation[1]]);
          if (dist > Math.PI / 2) return;
        }
        const proj = projection(poi.coords);
        if (!proj) return;
        const isSel = selectedPoi?.id === poi.id;
        const gPin = poiLayer
          .append('g')
          .attr('transform', `translate(${proj[0]}, ${proj[1]})`)
          .style('cursor', 'pointer')
          .on('click', (event) => {
            event.stopPropagation();
            setSelectedPoi(poi);
            onFocusCountry(poi.countryKey);
          })
          .on('mousemove', (event) => {
            const rect = svgEl.getBoundingClientRect();
            setTooltip({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              title: `POI: ${poi.name}`,
              subtitle: `${poi.stage} · ${poi.capexLabel} · Readiness ${poi.readiness}/100`,
            });
          })
          .on('mouseleave', () => setTooltip(null));

        gPin
          .append('rect')
          .attr('x', isSel ? -5.5 : -4)
          .attr('y', isSel ? -5.5 : -4)
          .attr('width', isSel ? 11 : 8)
          .attr('height', isSel ? 11 : 8)
          .attr('rx', 2)
          .attr('transform', 'rotate(45)')
          .attr('fill', isSel ? '#fde047' : '#f59e0b')
          .attr('stroke', '#060c16')
          .attr('stroke-width', 1.2);
      });
    }

    // Zoom or Orthographic Drag
    if (projectionMode === 'orthographic') {
      const drag = d3
        .drag<SVGSVGElement, unknown>()
        .on('drag', (event) => {
          setGlobeRotation(([lon, lat]) => [
            lon + event.dx * 0.35,
            Math.max(-60, Math.min(60, lat - event.dy * 0.35)),
          ]);
        });
      svg.on('.zoom', null);
      svg.call(drag);
    } else {
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 6])
        .on('zoom', (event) => {
          rootG.attr('transform', event.transform.toString());
        });
      zoomBehaviorRef.current = zoom;
      svg.on('.drag', null);
      svg.call(zoom);
    }

    if (animationEnabled && particles.length > 0) {
      const tick = () => {
        particles.forEach((p) => {
          p.offset = (p.offset + p.speed) % 1;
          const pt = p.path.getPointAtLength(p.offset * p.len);
          p.circle.attr('cx', pt.x).attr('cy', pt.y);
        });
        animFrameRef.current = requestAnimationFrame(tick);
      };
      animFrameRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    worldGeo,
    projectionMode,
    mapTheme,
    showGraticule,
    showPoiPins,
    showLabels,
    globeRotation,
    focusedCountry,
    showAllCorridors,
    direction,
    activeTypes,
    animationEnabled,
    selectedPoi,
    aiResult,
    buildProjection,
    onFocusCountry,
  ]);

  const applyRegionPreset = (presetId: string) => {
    setActiveRegion(presetId);
    const preset =
      REGION_PRESETS.find((r) => r.id === presetId) || REGION_PRESETS[0];

    if (projectionMode === 'orthographic') {
      setGlobeRotation([-preset.center[0], -preset.center[1]]);
      return;
    }

    const svgEl = svgRef.current;
    const zoom = zoomBehaviorRef.current;
    if (!svgEl || !zoom) return;

    const width = 1120;
    const height = 580;
    if (preset.id === 'global') {
      d3.select(svgEl)
        .transition()
        .duration(450)
        .call(zoom.transform, d3.zoomIdentity);
      return;
    }

    const projection = buildProjection(width, height);
    const pt = projection(preset.center);
    if (!pt) return;

    const k = preset.scaleFactor;
    const tx = width / 2 - k * pt[0];
    const ty = height / 2 - k * pt[1];
    d3.select(svgEl)
      .transition()
      .duration(500)
      .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(k));
  };

  const handleZoomBy = (factor: number) => {
    if (projectionMode === 'orthographic') return;
    const svgEl = svgRef.current;
    const zoom = zoomBehaviorRef.current;
    if (!svgEl || !zoom) return;
    d3.select(svgEl).transition().duration(240).call(zoom.scaleBy, factor);
  };

  const handleResetAll = () => {
    onFocusCountry(null);
    setSelectedPoi(null);
    setShowAllCorridors(false);
    setDirection('all');
    setAiResult(null);
    setGlobeRotation([-20, -4]);
    applyRegionPreset('global');
  };

  const linkedJurisdiction = focusedCountry
    ? COUNTRY_JURISDICTION_LINK[focusedCountry]
    : undefined;

  const totalByInstrument =
    corridorStats.byInstrument.dfi +
    corridorStats.byInstrument.commercial +
    corridorStats.byInstrument.eca +
    corridorStats.byInstrument.grant;

  return (
    <section aria-labelledby="map-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-3">
        <div>
          <h2
            id="map-heading"
            className="font-display text-3xl font-normal tracking-tight text-slate-100"
          >
            Global capital flows map
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Interactive projections, project POIs, live corridor signals, and AI optimal routing
          </p>
        </div>

        {/* Compact Live FX & Signal Refresh Strip */}
        <div className="flex flex-wrap items-center gap-3">
          {signals?.fxRates.map((fx) => (
            <div key={fx.pair} className="font-mono-num text-xs text-slate-300">
              <span className="text-slate-500">{fx.pair}</span>{' '}
              <strong className="text-slate-100">{fx.rate}</strong>{' '}
              <span
                className={
                  fx.deltaPct.startsWith('+')
                    ? 'text-amber-300'
                    : 'text-teal-300'
                }
              >
                {fx.deltaPct}
              </span>
            </div>
          ))}
          {signalsError && (
            <span className="text-xs text-rose-300">{signalsError}</span>
          )}
          <button
            type="button"
            onClick={fetchSignals}
            disabled={signalsLoading}
            className="rounded-md border border-white/15 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-white/5 disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            {signalsLoading ? 'Refreshing...' : 'Refresh signals'}
          </button>
        </div>
      </div>

      {/* UNIFIED COMPACT MAP CONTROL BAR */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl border border-white/10 bg-[#0b1424] px-3.5 py-2.5">
        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-1 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
            View
          </span>
          {(
            [
              { id: 'naturalEarth', label: 'Natural Earth' },
              { id: 'mercator', label: 'Mercator' },
              { id: 'orthographic', label: '3D Globe' },
            ] as const
          ).map((proj) => (
            <button
              key={proj.id}
              type="button"
              onClick={() => setProjectionMode(proj.id)}
              className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                projectionMode === proj.id
                  ? 'bg-teal-400/20 text-teal-300'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {proj.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-1 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
            Theme
          </span>
          {(Object.keys(MAP_THEMES) as MapThemeMode[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setMapTheme(t)}
              className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                mapTheme === t
                  ? 'bg-amber-300/20 text-amber-200'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {MAP_THEMES[t].label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-1 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
            Region
          </span>
          {REGION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyRegionPreset(preset.id)}
              className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeRegion === preset.id
                  ? 'bg-teal-400/20 text-teal-300'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {ALL_TYPES.map((t) => {
            const active = activeTypes.has(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleType(t)}
                className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'border-white/20 bg-white/[0.06] text-slate-100'
                    : 'border-white/5 text-slate-500 hover:text-slate-300'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: active ? TYPE_COLOR[t] : '#475569',
                  }}
                />
                {t === 'dfi'
                  ? 'DFI'
                  : t === 'commercial'
                    ? 'Commercial'
                    : t === 'eca'
                      ? 'ECA'
                      : 'Grant'}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setShowPoiPins((v) => !v)}
            className={`rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
              showPoiPins
                ? 'border-amber-300/40 bg-amber-300/15 text-amber-200'
                : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            POIs ({MAP_POI_PINS.length})
          </button>
          <button
            type="button"
            onClick={() => setShowGraticule((v) => !v)}
            className={`rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
              showGraticule
                ? 'border-white/25 bg-white/10 text-slate-100'
                : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setShowLabels((v) => !v)}
            className={`rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
              showLabels
                ? 'border-white/25 bg-white/10 text-slate-100'
                : 'border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            Labels
          </button>
          <button
            type="button"
            onClick={() => {
              if (focusedCountry) onFocusCountry(null);
              setShowAllCorridors((v) => !v);
            }}
            className={`rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
              showAllCorridors && !focusedCountry
                ? 'border-amber-300/40 bg-amber-300/15 text-amber-200'
                : 'border-white/10 text-slate-300 hover:bg-white/5'
            }`}
          >
            {showAllCorridors && !focusedCountry ? 'All arcs' : 'Show all'}
          </button>
          <button
            type="button"
            onClick={() => setAnimationEnabled((a) => !a)}
            className={`rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
              animationEnabled
                ? 'border-teal-400/50 bg-teal-400/15 text-teal-200'
                : 'border-white/10 text-slate-300 hover:bg-white/5'
            }`}
          >
            {animationEnabled ? 'Pause' : 'Animate'}
          </button>
        </div>
      </div>

      {/* MAIN MAP CANVAS — ABOVE THE FOLD */}
      <div
        data-testid="flows-map-container"
        style={{ backgroundColor: MAP_THEMES[mapTheme].bg }}
        className="relative overflow-hidden rounded-2xl border border-white/10"
      >
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox="0 0 1120 580"
            className="block h-[360px] w-full select-none md:h-[540px]"
            aria-label="Interactive global infrastructure capital flows map"
          />

          {!focusedCountry && !showAllCorridors && (
            <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-lg border border-teal-400/25 bg-[#070f1a]/90 px-3.5 py-1.5 text-[11px] font-medium text-slate-200 backdrop-blur-md whitespace-nowrap max-w-[92%] truncate">
              {projectionMode === 'orthographic'
                ? 'Drag to rotate the 3D globe · Click any market or amber project POI'
                : 'Click any country (teal hubs) or amber project POI diamond to reveal flows'}
            </div>
          )}

          {hoveredArc && (
            <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-white/15 bg-[#070f1a]/92 px-3.5 py-2 text-xs text-slate-100 backdrop-blur-md">
              <span className="font-semibold">
                {hoveredArc.from} → {hoveredArc.to}
              </span>
              <span className="mx-2 text-slate-500">·</span>
              <span className="font-mono-num text-teal-300">
                ~${hoveredArc.vol}m
              </span>
              <span className="mx-2 text-slate-500">·</span>
              <span className="text-slate-300">{TYPE_LABEL[hoveredArc.type]}</span>
            </div>
          )}

          {tooltip && (
            <div
              className="pointer-events-none absolute z-20 max-w-[280px] rounded-lg border border-teal-400/30 bg-[#070f1a]/95 px-3 py-2 text-xs text-slate-100 shadow-xl"
              style={{
                left: Math.min(tooltip.x + 14, 780),
                top: Math.max(tooltip.y + 14, 12),
              }}
            >
              <div className="font-semibold text-slate-100">{tooltip.title}</div>
              <div className="mt-0.5 text-slate-300">{tooltip.subtitle}</div>
            </div>
          )}

          {/* Bottom-Left Zoom Controls */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5">
            {projectionMode !== 'orthographic' && (
              <>
                <button
                  type="button"
                  onClick={() => handleZoomBy(1.4)}
                  aria-label="Zoom in map"
                  className="rounded-lg border border-white/15 bg-[#0a1424]/90 px-3 py-1.5 font-mono-num text-xs font-semibold text-slate-100 backdrop-blur-md hover:bg-white/10"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => handleZoomBy(0.7)}
                  aria-label="Zoom out map"
                  className="rounded-lg border border-white/15 bg-[#0a1424]/90 px-3 py-1.5 font-mono-num text-xs font-semibold text-slate-100 backdrop-blur-md hover:bg-white/10"
                >
                  −
                </button>
              </>
            )}
            <button
              type="button"
              onClick={handleResetAll}
              className="rounded-lg border border-white/15 bg-[#0a1424]/90 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur-md hover:bg-white/10"
            >
              Reset view
            </button>
          </div>
        </div>

        {/* Selected POI Floating Card */}
        {selectedPoi && (
          <div className="m-3 rounded-xl border border-amber-300/35 bg-[#091322]/95 p-4 shadow-2xl backdrop-blur-xl md:absolute md:bottom-14 md:left-4 md:z-10 md:m-0 md:max-w-[340px]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                  Infrastructure POI · {selectedPoi.stage}
                </div>
                <h4 className="mt-0.5 text-sm font-semibold text-slate-100">
                  {selectedPoi.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPoi(null)}
                className="text-slate-400 hover:text-slate-100"
              >
                ×
              </button>
            </div>
            <div className="mt-2 flex gap-4 font-mono-num text-xs text-slate-300">
              <span>Capex: {selectedPoi.capexLabel}</span>
              <span>Readiness: {selectedPoi.readiness}/100</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              {selectedPoi.highlight}
            </p>
            {selectedPoi.projectId && (
              <button
                type="button"
                onClick={() => onOpenProjectWorkspace(selectedPoi.projectId!)}
                className="mt-3 rounded-lg bg-amber-300 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-200"
              >
                Open project workspace →
              </button>
            )}
          </div>
        )}

        {/* Corridor Intelligence Side Panel */}
        {focusedCountry && (
          <aside
            aria-label="Corridor intelligence panel"
            className="m-3 rounded-xl border border-white/15 bg-[#091322]/95 p-5 shadow-2xl backdrop-blur-xl md:absolute md:right-4 md:top-4 md:z-10 md:m-0 md:max-h-[508px] md:w-[330px] md:overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-teal-300">
                  Corridor Intelligence
                </div>
                <h3 className="font-display mt-0.5 text-xl font-medium text-slate-100">
                  {displayOfCountryKey(focusedCountry)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onFocusCountry(null)}
                aria-label="Close corridor panel"
                className="rounded-md px-2 py-1 text-base text-slate-400 hover:bg-white/10 hover:text-slate-100"
              >
                ×
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
              {(['all', 'inbound', 'outbound'] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => setDirection(dir)}
                  className={`rounded-md py-1 text-[11px] font-semibold capitalize transition-colors ${
                    direction === dir
                      ? 'bg-teal-400/20 text-teal-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-y border-white/10 py-3">
              <div>
                <div className="text-[10px] font-semibold uppercase text-slate-500">
                  Inbound
                </div>
                <div className="font-mono-num mt-0.5 text-sm font-bold text-teal-300">
                  ${corridorStats.inVol}m
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase text-slate-500">
                  Outbound
                </div>
                <div className="font-mono-num mt-0.5 text-sm font-bold text-amber-300">
                  ${corridorStats.outVol}m
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase text-slate-500">
                  Net
                </div>
                <div className="font-mono-num mt-0.5 text-sm font-bold text-slate-100">
                  {corridorStats.netFlow >= 0 ? '+' : ''}
                  ${corridorStats.netFlow}m
                </div>
              </div>
            </div>

            {totalByInstrument > 0 && (
              <div className="mt-3">
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Instrument mix
                </div>
                <div className="flex h-2 overflow-hidden rounded-full bg-white/10">
                  {ALL_TYPES.map((t) => {
                    const pct =
                      (corridorStats.byInstrument[t] / totalByInstrument) * 100;
                    if (pct <= 0) return null;
                    return (
                      <div
                        key={t}
                        style={{
                          width: `${pct}%`,
                          backgroundColor: TYPE_COLOR[t],
                        }}
                        title={`${TYPE_LABEL[t]}: $${corridorStats.byInstrument[t]}m`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {direction !== 'inbound' && (
              <div className="mt-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Outbound ({corridorStats.outbound.length})
                </div>
                <div className="mt-1.5 divide-y divide-white/6">
                  {corridorStats.outbound.length > 0 ? (
                    corridorStats.outbound.map((f, i) => (
                      <button
                        key={`${f.to}-${f.type}-${i}`}
                        type="button"
                        onClick={() =>
                          onFocusCountry(
                            f.to === 'South Africa' ? 'ZAF' : f.to
                          )
                        }
                        className="flex w-full items-center justify-between py-2 text-left text-xs hover:bg-white/[0.04]"
                      >
                        <div>
                          <div className="font-medium text-slate-200">
                            → {f.to}
                          </div>
                          {f.sector && (
                            <div className="text-[11px] text-slate-500">
                              {f.sector}
                            </div>
                          )}
                        </div>
                        <span
                          className="font-mono-num font-semibold"
                          style={{ color: TYPE_COLOR[f.type] }}
                        >
                          ${f.vol}m
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="py-2 text-xs text-slate-500">
                      None in illustrative sample
                    </div>
                  )}
                </div>
              </div>
            )}

            {direction !== 'outbound' && (
              <div className="mt-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Inbound ({corridorStats.inbound.length})
                </div>
                <div className="mt-1.5 divide-y divide-white/6">
                  {corridorStats.inbound.length > 0 ? (
                    corridorStats.inbound.map((f, i) => (
                      <button
                        key={`${f.from}-${f.type}-${i}`}
                        type="button"
                        onClick={() =>
                          onFocusCountry(
                            f.from === 'South Africa' ? 'ZAF' : f.from
                          )
                        }
                        className="flex w-full items-center justify-between py-2 text-left text-xs hover:bg-white/[0.04]"
                      >
                        <div>
                          <div className="font-medium text-slate-200">
                            {f.from} →
                          </div>
                          {f.sector && (
                            <div className="text-[11px] text-slate-500">
                              {f.sector}
                            </div>
                          )}
                        </div>
                        <span
                          className="font-mono-num font-semibold"
                          style={{ color: TYPE_COLOR[f.type] }}
                        >
                          ${f.vol}m
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="py-2 text-xs text-slate-500">
                      None in illustrative sample
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Active Capital Facilities
              </div>
              <ul className="mt-1.5 space-y-1.5 text-xs text-slate-300">
                {matchedProviders.map((p) => (
                  <li key={p.id} className="truncate">
                    · <strong className="text-slate-100">{p.name}</strong> ({p.ticket})
                  </li>
                ))}
              </ul>

              {countryTxns.length > 0 && (
                <div className="mt-3 text-xs text-slate-400">
                  Precedent deals:{' '}
                  {countryTxns
                    .map((t) => `${t.project} (${t.amount})`)
                    .join(', ')}
                </div>
              )}

              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onExploreProvidersForCountry(
                      displayOfCountryKey(focusedCountry)
                    )
                  }
                  className="w-full rounded-lg bg-teal-400 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-300"
                >
                  Explore providers for {displayOfCountryKey(focusedCountry)}
                </button>
                {linkedJurisdiction && (
                  <button
                    type="button"
                    onClick={() =>
                      onInspectLegalForJurisdiction(linkedJurisdiction)
                    }
                    className="w-full rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5"
                  >
                    Inspect local legal authority
                  </button>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Quick Market Selector Row */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-400">Quick focus:</span>
        {QUICK_MARKETS.map((m) => {
          const active = focusedCountry === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => {
                setSelectedPoi(null);
                onFocusCountry(active ? null : m.key);
              }}
              className={`rounded-md border px-2.5 py-1 font-medium transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'border-teal-400 bg-teal-400/15 text-teal-200'
                  : 'border-white/10 bg-[#0b1424] text-slate-300 hover:border-white/25'
              }`}
            >
              {m.label}
            </button>
          );
        })}
        {(focusedCountry || aiResult) && (
          <button
            type="button"
            onClick={handleResetAll}
            className="ml-auto font-semibold text-amber-300 hover:text-amber-200 whitespace-nowrap shrink-0"
          >
            Reset map &amp; routes
          </button>
        )}
      </div>

      {/* LIVE REGIONAL FUNDING WINDOWS */}
      {signals?.liveWindows && (
        <div className="rounded-xl border border-white/10 bg-[#0b1424] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              Active Regional Funding Windows
            </span>
            {signals.updatedAt && (
              <span className="font-mono-num text-[11px] text-slate-500">
                Signal feed synced {new Date(signals.updatedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {signals.liveWindows.map((win) => (
              <button
                key={win.id}
                type="button"
                onClick={() => onFocusCountry(win.countryKey)}
                className="rounded-lg border border-white/8 bg-white/[0.02] p-3 text-left transition-colors hover:border-teal-400/40 hover:bg-teal-400/[0.04]"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-amber-300">
                    {win.country}
                  </span>
                  <span className="text-slate-400">{win.signalType}</span>
                </div>
                <div className="mt-1 text-xs font-semibold text-slate-100">
                  {win.headline}
                </div>
                <div className="mt-1 text-[11px] leading-snug text-slate-400">
                  {win.impact}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI OPTIMAL CORRIDOR & HIDDEN GEMS STRATEGIST */}
      <div className="rounded-2xl border border-teal-400/25 bg-[#0b1424] p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              AI Corridor Strategist
            </p>
            <h3 className="font-display mt-1 text-2xl font-medium text-slate-100">
              Suggest optimal capital routes &amp; overlooked facilities
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Powered by server-side Gemini analysis over historical corridors &amp; mandate fit
          </span>
        </div>

        <form
          onSubmit={handleRunAiAdvisor}
          className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          <div>
            <label
              htmlFor="ai-country"
              className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
            >
              Target Market
            </label>
            <select
              id="ai-country"
              value={aiCountry}
              onChange={(e) => setAiCountry(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
            >
              <option>South Africa</option>
              <option>Kenya</option>
              <option>Nigeria</option>
              <option>DRC</option>
              <option>Zambia</option>
              <option>Ghana</option>
              <option>Senegal</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="ai-sector"
              className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
            >
              Sector
            </label>
            <select
              id="ai-sector"
              value={aiSector}
              onChange={(e) => setAiSector(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
            >
              <option>Water &amp; sanitation</option>
              <option>Renewable energy</option>
              <option>Transport / logistics</option>
              <option>Climate adaptation</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="ai-stage"
              className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
            >
              Project Stage
            </label>
            <select
              id="ai-stage"
              value={aiStage}
              onChange={(e) => setAiStage(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
            >
              <option value="concept">Concept</option>
              <option value="feasibility">Feasibility</option>
              <option value="structuring">Structuring</option>
              <option value="transaction">Transaction</option>
              <option value="construction">Construction</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="ai-priority"
              className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
            >
              Routing Priority
            </label>
            <select
              id="ai-priority"
              value={aiPriority}
              onChange={(e) => setAiPriority(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
            >
              <option>Lowest Cost / Blended</option>
              <option>FX Protection (Local Currency)</option>
              <option>Early Preparation Grants</option>
              <option>Fastest Time to Close</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={aiLoading}
              className="w-full rounded-lg bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-teal-300 disabled:opacity-60 whitespace-nowrap shrink-0"
            >
              {aiLoading ? 'Analyzing routes...' : 'Suggest Optimal Routes'}
            </button>
          </div>
        </form>

        {aiError && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200"
          >
            <strong className="font-semibold">AI Advisor Error:</strong> {aiError}
          </div>
        )}

        {aiResult && (
          <div className="mt-6 space-y-6 border-t border-white/10 pt-5">
            <div className="rounded-xl border border-white/10 bg-[#07101d] p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Routing Synthesis (highlighted in gold dashed arcs on the map)
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
                {aiResult.strategySummary}
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-teal-300">
                  Recommended Optimal Corridors
                </h4>
                <div className="space-y-3">
                  {aiResult.optimalRoutes?.map((r, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-sm font-semibold text-slate-100">
                          {r.corridorTitle}
                        </strong>
                        <span className="font-mono-num text-xs text-amber-300">
                          {r.fromKey} → {r.toKey}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                        {r.rationale}
                      </p>
                      <div className="mt-2 font-mono-num text-[11px] text-slate-400">
                        Timeline: {r.estimatedTimeline}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Under-Tapped &ldquo;Hidden Gem&rdquo; Facilities
                </h4>
                <div className="space-y-3">
                  {aiResult.hiddenGems?.map((g, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-sm font-semibold text-slate-100">
                          {g.providerName}
                        </strong>
                        <span className="text-xs text-violet-300">
                          {g.category}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                        {g.whyOverlooked}
                      </p>
                      <p className="mt-2 text-xs font-medium text-teal-300">
                        Next step: {g.actionableNextStep}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
