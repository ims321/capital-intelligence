import React, { useState } from 'react';
import { STAGE_LABEL } from '../data/capitalData';
import type { Project, Role, TabId } from '../types/capital';

interface CapitalGuideWidgetProps {
  activeTab: TabId;
  role: Role;
  activeProject: Project;
  jurisdiction: string;
  focusedCountry: string | null;
  onNavigate: (tab: TabId) => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

const STATIC_ANSWERS: Record<string, string> = {
  start:
    'As a borrower: 1) Open My projects to register or select a project. 2) Open Workspace to inspect your lifecycle stage and close critical bankability gaps. 3) Verify borrowing powers in Legal & fiscal. 4) Stress-test structures in Scenarios and shortlist funders in Matches.',
  provider:
    'As a capital provider: 1) Configure ticket size, sectors, and geographies in My mandate. 2) Filter Opportunities by readiness score and country. 3) Express interest to initiate an NDA-gated Deal room.',
  legal:
    'The Legal & fiscal authority check maps who may borrow, in what currency, with whose Treasury/Council approval, and under what guarantee limits (such as MFMA ss 46–50 or Kenyan PFMA). It is decision support only — verify every rule with local counsel.',
  map:
    'In the Flows map you can switch between Natural Earth, Mercator, and a draggable 3D Globe; toggle live corridor signals and project POI diamonds; filter DFI, Commercial, ECA, or Grant layers; and run the AI Route Strategist for optimal corridors and hidden-gem facilities.',
  stage:
    'For Feasibility-stage projects, prioritize Project Preparation Facilities (DBSA PPF, GIF) and Grants / Technical Assistance (AfDB Water Facility, GCF PPF) to close engineering and E&S gaps before approaching construction lenders.',
};

export function CapitalGuideWidget({
  activeTab,
  role,
  activeProject,
  jurisdiction,
  focusedCountry,
  onNavigate,
}: CapitalGuideWidgetProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Welcome to the Capital Guide. Ask about borrower workflows, provider mandates, legal checks, scenario stress-testing, or the interactive flows map.',
    },
  ]);

  const contextReply = (): string => {
    const openGaps = activeProject.gaps.filter(
      (g) => g.status !== 'Closed'
    ).length;
    if (activeTab === 'map' && focusedCountry) {
      return `You are inspecting ${focusedCountry} on the Flows Map. Use the Corridor Intelligence panel on the right to jump straight into active capital providers or inspect local legal rules.`;
    }
    if (role === 'provider') {
      return `You are in Capital Provider mode on the ${activeTab} view. Review Opportunities or refine your Mandate preferences to surface aligned African infrastructure deals.`;
    }
    return `Active project: "${activeProject.name}" (${STAGE_LABEL[activeProject.stage]}, readiness ${activeProject.readiness}/100, ${openGaps} open gaps) under jurisdiction ${jurisdiction}.`;
  };

  const pushResponse = (key: string, userLabel?: string) => {
    const next: ChatMessage[] = [];
    if (userLabel) {
      next.push({
        id: `u-${Date.now()}`,
        sender: 'user',
        text: userLabel,
      });
    }
    const text =
      key === 'context'
        ? contextReply()
        : STATIC_ANSWERS[key] || STATIC_ANSWERS.start;
    next.push({
      id: `b-${Date.now() + 1}`,
      sender: 'bot',
      text,
    });
    setMessages((prev) => [...prev, ...next]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput('');
    const lower = q.toLowerCase();
    let key = 'context';
    if (lower.includes('borrow') || lower.includes('start') || lower.includes('project')) {
      key = 'start';
    } else if (lower.includes('provider') || lower.includes('mandate') || lower.includes('investor')) {
      key = 'provider';
    } else if (lower.includes('legal') || lower.includes('mfma') || lower.includes('pfma')) {
      key = 'legal';
    } else if (lower.includes('map') || lower.includes('flow') || lower.includes('route')) {
      key = 'map';
    } else if (lower.includes('feasibility') || lower.includes('grant') || lower.includes('stage')) {
      key = 'stage';
    }
    pushResponse(key, q);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Capital Guide assistant"
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-40 flex h-13 w-13 items-center justify-center rounded-full border border-white/20 bg-teal-400 text-lg font-bold text-slate-950 shadow-2xl transition-transform hover:scale-105 hover:bg-teal-300"
      >
        ✦
      </button>

      {open && (
        <aside
          aria-label="Capital Guide assistant"
          className="fixed bottom-22 right-6 z-40 flex max-h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-teal-400/25 bg-[#0a1424]/98 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
              <span className="text-teal-300">✦</span>
              <span>Capital Guide</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Capital Guide"
              className="rounded-md px-2 py-0.5 text-lg text-slate-400 hover:bg-white/10 hover:text-slate-100"
            >
              ×
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.sender === 'bot'
                    ? 'border border-teal-400/20 bg-teal-400/[0.08] text-slate-100'
                    : 'ml-6 border border-white/10 bg-white/[0.04] text-slate-300'
                }`}
              >
                {m.text}
              </div>
            ))}

            <div className="flex flex-col gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => pushResponse('context', 'Where am I right now?')}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-slate-300 hover:border-teal-400/40 hover:text-teal-200"
              >
                Check my current workspace context
              </button>
              <button
                type="button"
                onClick={() => pushResponse('start', 'Borrower start guide')}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-slate-300 hover:border-teal-400/40 hover:text-teal-200"
              >
                I’m a borrower — where do I start?
              </button>
              <button
                type="button"
                onClick={() => pushResponse('legal', 'Explain legal authority check')}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-slate-300 hover:border-teal-400/40 hover:text-teal-200"
              >
                Explain the legal authority check
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('map');
                  pushResponse('map', 'How does the flows map work?');
                }}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-slate-300 hover:border-teal-400/40 hover:text-teal-200"
              >
                How does the flows map work?
              </button>
              <button
                type="button"
                onClick={() => pushResponse('stage', 'Feasibility funding')}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-slate-300 hover:border-teal-400/40 hover:text-teal-200"
              >
                What funding exists for feasibility stage?
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-white/10 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-teal-400 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-teal-300 whitespace-nowrap shrink-0"
            >
              Send
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
