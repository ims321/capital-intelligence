import React, { useEffect, useState } from 'react';
import { CATS } from '../data/capitalData';
import type { StageKey } from '../types/capital';

function ModalShell({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#03070f]/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-[#0d1829] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-medium text-slate-100">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-md px-2 py-1 text-lg text-slate-400 hover:bg-white/10 hover:text-slate-100"
          >
            ×
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export function NewProjectModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (input: {
    name: string;
    sector: string;
    stage: StageKey;
    capexM: number;
    desc: string;
  }) => void;
}) {
  const [name, setName] = useState('');
  const [sector, setSector] = useState('Water & sanitation');
  const [stage, setStage] = useState<StageKey>('concept');
  const [capex, setCapex] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a project name.');
      return;
    }
    const parsedCapex = parseFloat(capex);
    if (!capex.trim() || Number.isNaN(parsedCapex) || parsedCapex <= 0) {
      setError('Please enter a valid positive capex estimate in millions.');
      return;
    }
    setError(null);
    onCreate({
      name: name.trim(),
      sector,
      stage,
      capexM: parsedCapex,
      desc: desc.trim() || 'New infrastructure project concept.',
    });
    setName('');
    setCapex('');
    setDesc('');
    onClose();
  };

  return (
    <ModalShell
      open={open}
      title="Register new project"
      subtitle="Start with a concept or existing package. The platform structures it and identifies gaps."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-200"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="np-name"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Project name *
          </label>
          <input
            id="np-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. District water treatment upgrade"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="np-sector"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Sector
            </label>
            <select
              id="np-sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
            >
              <option>Water &amp; sanitation</option>
              <option>Renewable energy</option>
              <option>Transport / logistics</option>
              <option>Municipal services</option>
              <option>Climate adaptation</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="np-stage"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Current stage
            </label>
            <select
              id="np-stage"
              value={stage}
              onChange={(e) => setStage(e.target.value as StageKey)}
              className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
            >
              <option value="concept">Concept</option>
              <option value="feasibility">Feasibility</option>
              <option value="structuring">Structuring</option>
              <option value="transaction">Transaction</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="np-capex"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Indicative capex (local currency millions) *
          </label>
          <input
            id="np-capex"
            type="number"
            min="1"
            step="any"
            value={capex}
            onChange={(e) => setCapex(e.target.value)}
            placeholder="e.g. 420"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="np-desc"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Description
          </label>
          <textarea
            id="np-desc"
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Problem, beneficiaries, location..."
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-teal-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-300"
          >
            Create project
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function AddProviderModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (input: {
    name: string;
    category: string;
    type: string;
    ticket: string;
    geographies: string;
    sectors: string;
    desc: string;
  }) => void;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATS[4]);
  const [type, setType] = useState('Equity');
  const [ticket, setTicket] = useState('');
  const [geographies, setGeographies] = useState('');
  const [sectors, setSectors] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a provider name.');
      return;
    }
    setError(null);
    onAdd({
      name: name.trim(),
      category,
      type,
      ticket: ticket.trim() || 'Case-by-case',
      geographies: geographies.trim() || 'Africa',
      sectors: sectors.trim() || 'Energy',
      desc: desc.trim(),
    });
    setName('');
    setTicket('');
    setGeographies('');
    setSectors('');
    setDesc('');
    onClose();
  };

  return (
    <ModalShell
      open={open}
      title="Add capital provider"
      subtitle="New records enter as “Mandate match” until source verification."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-200"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="ap-name"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Institution name *
          </label>
          <input
            id="ap-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Nordic Municipal Infrastructure Fund"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="ap-cat"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Category
            </label>
            <select
              id="ap-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
            >
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="ap-type"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Instrument
            </label>
            <select
              id="ap-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
            >
              <option>Equity</option>
              <option>Commercial debt</option>
              <option>Concessional debt</option>
              <option>Grant / technical assistance</option>
              <option>Project preparation</option>
              <option>ECA / guarantee</option>
              <option>Guarantee / risk</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="ap-ticket"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Ticket size
          </label>
          <input
            id="ap-ticket"
            type="text"
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
            placeholder="e.g. USD 20m–150m"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="ap-geo"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Geographies (comma-separated)
            </label>
            <input
              id="ap-geo"
              type="text"
              value={geographies}
              onChange={(e) => setGeographies(e.target.value)}
              placeholder="Africa, South Africa"
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="ap-sec"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Sectors (comma-separated)
            </label>
            <input
              id="ap-sec"
              type="text"
              value={sectors}
              onChange={(e) => setSectors(e.target.value)}
              placeholder="Energy, Water, Transport"
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="ap-desc"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Mandate notes
          </label>
          <textarea
            id="ap-desc"
            rows={2}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Mandate, appetite, constraints..."
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-teal-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-300"
          >
            Add provider
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function EngageModal({
  target,
  onClose,
  onSubmit,
}: {
  target: { type: 'capital' | 'project'; id: string; name: string } | null;
  onClose: () => void;
  onSubmit: (action: 'interest' | 'nda' | 'rfi', note: string) => void;
}) {
  const [action, setAction] = useState<'interest' | 'nda' | 'rfi'>('interest');
  const [msg, setMsg] = useState('');

  if (!target) return null;

  return (
    <ModalShell
      open={Boolean(target)}
      title={
        target.type === 'capital'
          ? `Engage: ${target.name}`
          : `Interest: ${target.name}`
      }
      subtitle={
        target.type === 'capital'
          ? 'Logged action. NDA requests notify the counterparty before data-room access.'
          : 'The project owner will be notified in the deal room workflow.'
      }
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(action, msg.trim());
          setMsg('');
          onClose();
        }}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="engage-action"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Workflow action
          </label>
          <select
            id="engage-action"
            value={action}
            onChange={(e) =>
              setAction(e.target.value as 'interest' | 'nda' | 'rfi')
            }
            className="w-full rounded-lg border border-white/10 bg-[#08111e] px-3 py-2 text-sm text-slate-100 focus:border-teal-400/50 focus:outline-none"
          >
            <option value="interest">Express interest (non-binding)</option>
            <option value="nda">Request NDA &amp; data-room access</option>
            <option value="rfi">Submit request for information</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="engage-msg"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Message (optional)
          </label>
          <textarea
            id="engage-msg"
            rows={3}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Brief note for counterparty..."
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/50 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-teal-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-300"
          >
            Submit
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

const TUTORIAL_STEPS = [
  {
    title: 'Welcome to Capital Intelligence',
    paragraphs: [
      'This infrastructure funding platform connects government borrowers with global capital — stage by stage — with legal authority checks and end-to-end engagement workflow.',
      'It is not a static directory. It is a capital strategist and transaction workspace backed by a growing database of providers across eleven capital categories.',
    ],
  },
  {
    title: 'Two sides, one platform',
    paragraphs: [
      'Use the Borrower / Capital provider switch in the workspace ribbon. Tabs and tools update immediately to match your role.',
    ],
    bullets: [
      'Borrowers register projects, verify legal borrowing authority, stress-test FX/interest scenarios, and engage funders.',
      'Providers configure institutional mandates, discover African opportunities, and progress deals under NDA.',
    ],
  },
  {
    title: 'Legal authority first',
    paragraphs: [
      'Before matching capital, the platform checks whether your entity can lawfully borrow, take foreign-currency risk, grant security, or enter PPPs.',
      'Every rule is cited and status-labelled. Treat this as structured decision support — not a formal legal opinion.',
    ],
  },
  {
    title: 'Stage-aware matching & scenarios',
    paragraphs: [
      'Capital is tagged by project stage. Preparation grants and facilities are first-class — not an afterthought.',
      'Use the Workspace, Scenarios, and Matches views to size blended finance and address critical bankability gaps before seeking construction debt.',
    ],
  },
  {
    title: 'Intelligent flows map & AI route strategist',
    paragraphs: [
      'The Flows map integrates live corridor signals, customizable projections (including a draggable 3D globe), project POI pins, and server-side AI optimal route & hidden-gem suggestions.',
      'Open the Capital Guide (bottom-right) or User guide tab anytime for a full walkthrough.',
    ],
  },
];

export function TutorialModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  const current = TUTORIAL_STEPS[step];
  const isLast = step >= TUTORIAL_STEPS.length - 1;

  return (
    <ModalShell
      open={open}
      title={current.title}
      subtitle={`Step ${step + 1} of ${TUTORIAL_STEPS.length}`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="flex gap-1.5">
          {TUTORIAL_STEPS.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 flex-1 rounded-full ${
                idx <= step ? 'bg-teal-400' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
          {current.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {current.bullets && (
            <ul className="space-y-1.5 pl-4">
              {current.bullets.map((b, i) => (
                <li key={i}>· {b}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-3">
          {!isLast && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5"
            >
              Skip
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (isLast) onClose();
              else setStep((s) => s + 1);
            }}
            className="rounded-lg bg-teal-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-300"
          >
            {isLast ? 'Get started' : 'Continue'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
