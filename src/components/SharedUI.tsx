import React from 'react';
import { CONF_META, ENGAGEMENT_META, LEGAL_STATUS } from '../data/capitalData';
import type {
  ConfidenceLevel,
  EngagementStatus,
  LegalRuleStatus,
  SeverityLevel,
} from '../types/capital';

export function EvidenceText({ level }: { level: ConfidenceLevel }) {
  const meta = CONF_META[level] || CONF_META.inferred;
  return (
    <span className={`text-xs font-medium tracking-wide ${meta.tone}`}>
      {meta.label}
    </span>
  );
}

export function EngagementText({ status }: { status: EngagementStatus }) {
  const meta = ENGAGEMENT_META[status] || ENGAGEMENT_META.none;
  return (
    <span className={`text-xs font-semibold ${meta.tone}`}>{meta.label}</span>
  );
}

export function LegalStatusText({ status }: { status: LegalRuleStatus }) {
  const meta = LEGAL_STATUS[status] || LEGAL_STATUS.unsettled;
  return (
    <span className={`text-xs font-semibold ${meta.tone}`}>{meta.label}</span>
  );
}

export function SeverityText({ severity }: { severity: SeverityLevel }) {
  const toneMap: Record<SeverityLevel, string> = {
    critical: 'text-rose-300',
    high: 'text-amber-300',
    medium: 'text-sky-300',
    low: 'text-teal-300',
  };
  return (
    <span
      className={`font-mono-num text-xs font-semibold uppercase tracking-wider ${toneMap[severity]}`}
    >
      {severity}
    </span>
  );
}

export function ReadinessMeter({
  score,
  label = 'Readiness',
}: {
  score: number;
  label?: string;
}) {
  const tone =
    score >= 75
      ? 'text-teal-300 border-teal-400/40 bg-teal-400/10'
      : score >= 55
        ? 'text-amber-300 border-amber-400/40 bg-amber-400/10'
        : 'text-rose-300 border-rose-400/40 bg-rose-400/10';
  return (
    <div
      className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border ${tone}`}
      title={`${label}: ${score}`}
    >
      <span className="font-mono-num text-sm font-bold leading-none">
        {score}
      </span>
    </div>
  );
}

export function SectionHeader({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4 border-b border-white/8 pb-3">
      <div>
        <h2 className="font-display text-2xl font-medium tracking-tight text-slate-100">
          {title}
        </h2>
        {hint && <p className="mt-1 text-sm text-slate-400">{hint}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function ToastBanner({
  message,
  onDismiss,
}: {
  message: string | null;
  onDismiss: () => void;
}) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-xl border border-teal-400/30 bg-[#0d192a]/95 px-5 py-3 text-sm text-slate-100 shadow-2xl backdrop-blur-md"
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="text-xs font-semibold text-teal-300 hover:text-teal-200 whitespace-nowrap shrink-0"
      >
        Dismiss
      </button>
    </div>
  );
}
