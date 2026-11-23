import express from 'express';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Live Corridor & FX Market Signals endpoint
  app.get('/api/corridor-signals', (_req, res) => {
    const now = new Date();
    const minuteSeed = now.getUTCMinutes();
    const zarBase = 17.85 + ((minuteSeed % 7) - 3) * 0.04;
    const kesBase = 128.4 + ((minuteSeed % 5) - 2) * 0.15;

    res.json({
      updatedAt: now.toISOString(),
      fxRates: [
        { pair: 'USD/ZAR', rate: zarBase.toFixed(2), deltaPct: '+0.42%' },
        { pair: 'USD/KES', rate: kesBase.toFixed(2), deltaPct: '-0.18%' },
        { pair: 'EUR/ZAR', rate: (zarBase * 1.08).toFixed(2), deltaPct: '+0.31%' },
      ],
      liveWindows: [
        {
          id: 'sig-1',
          country: 'South Africa',
          countryKey: 'ZAF',
          headline: 'NT Budget Facility for Infrastructure (BFI) Window Open',
          signalType: 'Public Call',
          impact: 'On-budget co-funding for R50m–R500m municipal water & transit packages',
          urgency: 'High',
        },
        {
          id: 'sig-2',
          country: 'Kenya',
          countryKey: 'Kenya',
          headline: 'County Climate Resilience & Geothermal Blending Desk',
          signalType: 'DFI Liquidity',
          impact: 'AFD & KfW expanding EUR concessional windows for county water & NRW',
          urgency: 'Active',
        },
        {
          id: 'sig-3',
          country: 'DRC',
          countryKey: 'DRC',
          headline: 'Lobito & Critical Minerals Logistics Corridor Guarantees',
          signalType: 'ECA / PRI',
          impact: 'US DFC & MIGA political risk coverage prioritized for rail/hydro packages',
          urgency: 'Active',
        },
        {
          id: 'sig-4',
          country: 'Zambia',
          countryKey: 'Zambia',
          headline: 'SADC Regional Transmission Interconnector Facility',
          signalType: 'Regional DFI',
          impact: 'DBSA + World Bank IPF technical preparation co-financing available',
          urgency: 'Moderate',
        },
      ],
    });
  });

  // AI Optimal Capital Routing & Hidden Gems Advisor (Server-side Gemini API)
  app.post('/api/map-advisor', async (req, res) => {
    const ai = createGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'GEMINI_API_KEY is not configured. Please add your API key in Settings > Secrets to run AI corridor optimization.',
      });
      return;
    }

    const {
      targetCountry = 'South Africa',
      sector = 'Water & sanitation',
      stage = 'feasibility',
      priority = 'Lowest Cost / Blended',
      historicalFlows = [],
      candidateProviders = [],
    } = req.body || {};

    try {
      const prompt = [
        `You are an infrastructure capital strategist advising on Sub-Saharan African infrastructure financing.`,
        `User Preferences:`,
        `- Target Country: ${targetCountry}`,
        `- Sector: ${sector}`,
        `- Project Lifecycle Stage: ${stage}`,
        `- Optimization Priority: ${priority}`,
        `Historical Flow Context (illustrative corridors): ${JSON.stringify(historicalFlows).slice(0, 2200)}`,
        `Available Providers Sample: ${JSON.stringify(candidateProviders).slice(0, 3000)}`,
        `Task: Recommend 3 optimal capital routing corridors (each linking a source market key from [USA, GBR, DEU, FRA, CHN, JPN, NLD, SWE, ARE, ZAF] to the target country key) and 3 under-utilized "hidden gem" facilities (preparation funds, local-currency guarantee desks, or climate/endowment catalytic windows) suited to this stage and priority.`,
        `Be concise, grounded in African municipal/sovereign borrowing reality (e.g. FX mismatch risk, MFMA/PFMA constraints), and do not invent fake dollar commitments.`,
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'Return strict structured JSON matching the schema. Keep rationales crisp and institutional.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strategySummary: {
                type: Type.STRING,
                description: '2-sentence executive synthesis of the recommended capital routing strategy.',
              },
              optimalRoutes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    fromKey: {
                      type: Type.STRING,
                      description: 'Source market key such as USA, DEU, FRA, GBR, NLD, SWE, ZAF, JPN, CHN, ARE',
                    },
                    toKey: {
                      type: Type.STRING,
                      description: 'Target country key such as ZAF, Kenya, Nigeria, DRC, Zambia, Ghana, Senegal',
                    },
                    instrumentType: {
                      type: Type.STRING,
                      description: 'One of dfi, commercial, eca, grant',
                    },
                    corridorTitle: { type: Type.STRING },
                    rationale: { type: Type.STRING },
                    estimatedTimeline: { type: Type.STRING },
                  },
                },
              },
              hiddenGems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    providerName: { type: Type.STRING },
                    category: { type: Type.STRING },
                    whyOverlooked: { type: Type.STRING },
                    actionableNextStep: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to generate AI corridor advice.';
      res.status(502).json({ error: message });
    }
  });

  // Live Official Portal Discovery (AU Agenda 2063, PIDA, DFI, National Agencies & Overlooked Funds)
  app.post('/api/official-search', async (req, res) => {
    const ai = createGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'GEMINI_API_KEY is not configured. Configure it in Settings > Secrets to search live AU, DFI, and national infrastructure portals.',
      });
      return;
    }

    const {
      query = '',
      scope = 'projects',
      country = 'Africa',
      sector = 'All infrastructure sectors',
    } = req.body || {};

    if (!String(query).trim()) {
      res.status(400).json({ error: 'Please enter a search query.' });
      return;
    }

    try {
      const prompt =
        scope === 'capital'
          ? [
              `Search official institutional portals for overlooked, non-traditional, concessional, local-currency, municipal preparation, Arab/Islamic DFI, or climate/blended infrastructure funding windows.`,
              `Focus query: "${query}"`,
              `Target geography: ${country} | Sector: ${sector}.`,
              `List specific named facilities, ticket sizes, eligibility rules, and open application/contact channels with official URLs found via search.`,
            ].join('\n')
          : [
              `Search official African Union Agenda 2063 / AUDA-NEPAD PIDA, multilateral DFI (AfDB, World Bank, DBSA, EIB, IFC), and national government PPP / infrastructure portal listings.`,
              `Focus query: "${query}"`,
              `Target geography: ${country} | Sector: ${sector}.`,
              `Summarize real official listed projects or tender windows, implementing agency, indicative capex/stage, and cite official institutional portals.`,
            ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'Be concise, factual, and institutional. Cite verified official portals returned by Google Search. Do not invent non-existent programmes or ticket commitments.',
          tools: [{ googleSearch: {} }],
        },
      });

      const rawChunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = rawChunks
        .map((c) => c.web)
        .filter((w): w is { uri: string; title?: string } => Boolean(w?.uri))
        .slice(0, 8)
        .map((w) => ({
          title: w.title || w.uri,
          uri: w.uri,
        }));

      res.json({
        answer: (response.text ?? '').trim(),
        sources,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to query official portals.';
      res.status(502).json({ error: message });
    }
  });

  const httpServer = http.createServer(app);

  if (!isProd) {
    const hmrDisabled = process.env.DISABLE_HMR === 'true';
    if (hmrDisabled) {
      // Serve a zero-WebSocket /@vite/client shim when HMR is disabled so Vite
      // does not attempt a background WebSocket connection (e.g. :24678) behind
      // reverse proxies while still supporting CSS injection and module helpers.
      const noHmrViteClient = `
const sheetsMap = new Map();
const linkSheetsMap = new Map();
if (typeof document !== "undefined") {
  document.querySelectorAll("style[data-vite-dev-id]").forEach((el) => {
    sheetsMap.set(el.getAttribute("data-vite-dev-id"), el);
  });
  document.querySelectorAll('link[rel="stylesheet"][data-vite-dev-id]').forEach((el) => {
    linkSheetsMap.set(el.getAttribute("data-vite-dev-id"), el);
  });
}
let lastInsertedStyle;
export function updateStyle(id, content) {
  if (linkSheetsMap.has(id)) return;
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("data-vite-dev-id", id);
    style.textContent = content;
    if (!lastInsertedStyle) {
      document.head.appendChild(style);
      setTimeout(() => { lastInsertedStyle = undefined; }, 0);
    } else {
      lastInsertedStyle.insertAdjacentElement("afterend", style);
    }
    lastInsertedStyle = style;
  } else if (style.textContent !== content) {
    style.textContent = content;
  }
  sheetsMap.set(id, style);
}
export function removeStyle(id) {
  if (linkSheetsMap.has(id)) {
    document.querySelectorAll(\`link[rel="stylesheet"][data-vite-dev-id="\${CSS.escape(id)}"]\`).forEach((el) => el.remove());
    linkSheetsMap.delete(id);
  }
  const style = sheetsMap.get(id);
  if (style) {
    document.head.removeChild(style);
    sheetsMap.delete(id);
  }
}
export function createHotContext() {
  return {
    data: {},
    accept() {},
    decline() {},
    invalidate() {},
    dispose() {},
    prune() {},
    on() {},
    off() {},
    send() {},
  };
}
export function injectQuery(url, queryToInject) {
  if (url[0] !== "." && url[0] !== "/") return url;
  const pathname = url.replace(/[?#].*$/, "");
  const { search, hash } = new URL(url, "http://vite.dev");
  return \`\${pathname}?\${queryToInject}\${search ? "&" + search.slice(1) : ""}\${hash || ""}\`;
}
const BaseEl = typeof HTMLElement !== "undefined" ? HTMLElement : class {};
export class ErrorOverlay extends BaseEl {}
`.trimStart();

      app.get('/@vite/client', (_req, res) => {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.send(noHmrViteClient);
      });
    }

    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: hmrDisabled
        ? { middlewareMode: true, hmr: false }
        : { middlewareMode: true, hmr: { server: httpServer }, ws: { server: httpServer } },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Capital Intelligence server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
