import React, { useEffect, useRef, useState } from 'react';
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

interface GroundingSource {
  title: string;
  uri: string;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  sources?: GroundingSource[];
  modelUsed?: string;
}

type PersonaKey = 'borrower' | 'provider' | 'legal';
type ChatMode = 'standard' | 'fast';

const PERSONA_OPTIONS: Array<{ value: PersonaKey; label: string }> = [
  { value: 'borrower', label: 'Borrower PMO' },
  { value: 'provider', label: 'Provider Mandate' },
  { value: 'legal', label: 'Legal & Fiscal' },
];

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
  const [persona, setPersona] = useState<PersonaKey>(
    role === 'provider' ? 'provider' : 'borrower'
  );
  const [mode, setMode] = useState<ChatMode>('standard');
  const [useSearch, setUseSearch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Welcome to Capital Intelligence Guide. Ask about project bankability gaps, live AU/DFI funding windows, legal borrowing rules, or mandate matching.',
    },
  ]);

  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPersona((prev) =>
      prev === 'legal' ? 'legal' : role === 'provider' ? 'provider' : 'borrower'
    );
  }, [role]);

  useEffect(() => {
    if (open) {
      threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, open]);

  const sendMessage = async (
    rawText: string,
    optionalNavTab?: TabId
  ) => {
    const clean = rawText.trim();
    if (!clean || loading) return;

    if (optionalNavTab) {
      onNavigate(optionalNavTab);
    }

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: clean,
    };

    const historyPayload = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setErrorMsg(null);
    setLoading(true);

    const openGaps = activeProject.gaps.filter(
      (g) => g.status !== 'Closed'
    ).length;

    try {
      const res = await fetch('/api/capital-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: clean,
          history: historyPayload,
          persona,
          mode,
          useSearch: mode === 'standard' && useSearch,
          context: {
            activeTab,
            role,
            jurisdiction,
            focusedCountry,
            projectName: activeProject.name,
            projectStage: STAGE_LABEL[activeProject.stage] || activeProject.stage,
            projectReadiness: activeProject.readiness,
            openGaps,
            projectCapex: `${activeProject.currency} ${(activeProject.capex / 1e6).toFixed(1)}m`,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data?.error || 'Unable to reach Gemini Capital Guide.');
        return;
      }

      const botMessage: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text:
          data.reply ||
          'No response returned. Please rephrase your question.',
        sources: Array.isArray(data.sources) ? data.sources : [],
        modelUsed: data.modelUsed,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Network error communicating with Capital Guide.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleReset = () => {
    setErrorMsg(null);
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Conversation reset. Ask about project bankability gaps, live AU/DFI funding windows, legal borrowing rules, or mandate matching.',
      },
    ]);
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
          className="fixed bottom-22 right-6 z-40 flex h-[560px] max-h-[calc(100vh-7rem)] w-[390px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-teal-400/25 bg-[#0a1424]/98 shadow-2xl backdrop-blur-xl"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <span className="text-teal-300">✦</span>
                <span>Capital Guide</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded px-2 py-0.5 text-[11px] text-slate-400 hover:bg-white/10 hover:text-slate-100"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close Capital Guide"
                  className="rounded-md px-2 py-0.5 text-lg text-slate-400 hover:bg-white/10 hover:text-slate-100"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {PERSONA_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPersona(opt.value)}
                  className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                    persona === opt.value
                      ? 'bg-teal-400/20 text-teal-200 border border-teal-400/40'
                      : 'bg-white/[0.04] text-slate-400 border border-white/10 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMode('standard')}
                  className={`rounded px-1.5 py-0.5 ${
                    mode === 'standard'
                      ? 'bg-white/10 text-slate-100'
                      : 'hover:text-slate-200'
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => setMode('fast')}
                  className={`rounded px-1.5 py-0.5 ${
                    mode === 'fast'
                      ? 'bg-white/10 text-amber-200'
                      : 'hover:text-slate-200'
                  }`}
                >
                  Fast
                </button>
              </div>
              {mode === 'standard' && (
                <label className="flex cursor-pointer items-center gap-1.5 select-none">
                  <input
                    type="checkbox"
                    checked={useSearch}
                    onChange={(e) => setUseSearch(e.target.checked)}
                    className="h-3 w-3 accent-teal-400"
                  />
                  <span>Live Web Search</span>
                </label>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'bot'
                    ? 'border border-teal-400/20 bg-teal-400/[0.08] text-slate-100'
                    : 'ml-6 border border-white/10 bg-white/[0.04] text-slate-200'
                }`}
              >
                <div>{m.text}</div>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2 border-t border-white/10 pt-2">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-teal-300">
                      Grounded Sources
                    </div>
                    <ul className="space-y-1">
                      {m.sources.map((src) => (
                        <li key={src.uri}>
                          <a
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate text-[11px] text-teal-300 underline decoration-teal-400/40 hover:text-teal-200"
                          >
                            {src.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="rounded-xl border border-teal-400/20 bg-teal-400/[0.06] px-3.5 py-2.5 text-xs text-teal-200">
                Analyzing workspace &amp; institutional data…
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="rounded-xl border border-rose-400/35 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200"
              >
                {errorMsg}
              </div>
            )}

            {messages.length <= 2 && !loading && (
              <div className="flex flex-col gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    void sendMessage(
                      `Analyze "${activeProject.name}" in my current workspace: what are the most urgent bankability gaps and matching capital facilities?`
                    )
                  }
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-slate-300 hover:border-teal-400/40 hover:text-teal-200"
                >
                  Analyze active project bankability gaps
                </button>
                <button
                  type="button"
                  onClick={() =>
                    void sendMessage(
                      'What overlooked concessional grants, preparation facilities, or local-currency guarantee windows currently fit Sub-Saharan water & clean energy infrastructure?'
                    )
                  }
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-slate-300 hover:border-teal-400/40 hover:text-teal-200"
                >
                  Find overlooked DFI &amp; preparation grants
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPersona('legal');
                    void sendMessage(
                      `Summarize key statutory borrowing checks for jurisdiction ${jurisdiction} and how they gate debt structuring.`
                    );
                  }}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-slate-300 hover:border-teal-400/40 hover:text-teal-200"
                >
                  Review jurisdiction borrowing constraints
                </button>
                <button
                  type="button"
                  onClick={() =>
                    void sendMessage(
                      'How should I use the Flows Map layers and AI Route Strategist to compare cross-border vs local-currency capital?',
                      'map'
                    )
                  }
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-slate-300 hover:border-teal-400/40 hover:text-teal-200"
                >
                  Guide me through the Flows Map
                </button>
              </div>
            )}

            <div ref={threadEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-white/10 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Ask about projects, funders, or rules..."
              className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg bg-teal-400 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-teal-300 disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              Send
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
