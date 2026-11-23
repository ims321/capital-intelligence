import React from 'react';
import { SectionHeader } from './SharedUI';

export function GuideView() {
  const sections = [
    {
      num: '01',
      title: 'Getting started',
      body: 'Use the role switch in the workspace ribbon to choose Borrower or Capital provider. Tabs and available tools adapt immediately. Select your jurisdiction to load the relevant statutory borrowing and fiscal rules.',
    },
    {
      num: '02',
      title: 'Borrower journey',
      items: [
        'My projects — Register a new project or open an existing one. Start from a simple concept; the platform structures it.',
        'Workspace — Walk through the six lifecycle stages, check off stage deliverables, inspect stage-matched capital, and update the bankability gap register.',
        'Legal & fiscal — Check borrowing authority, approval paths, foreign-currency rules and guarantee constraints for your jurisdiction.',
        'Scenarios — Compare whole-of-life financing structures under interactive FX depreciation and interest-rate stress.',
        'Matches — Review scored capital matches, filter by instrument or category, and express interest or request an NDA.',
        'Deal rooms — Open populated Mutual NDA, RFI Pack, Indicative Blended Term Sheet, Financial Close Memo, and Data Room drafts; customize governing law & signatories, download .txt packs, and execute instruments directly into the immutable audit trail.',
      ],
    },
    {
      num: '03',
      title: 'Capital provider journey',
      items: [
        'My mandate — Define instruments, ticket size, target geographies, and sector preferences to drive opportunity matching.',
        'Opportunities — Browse African projects that fit your mandate with readiness scores and legal status visible.',
        'Pipeline — Track active borrower counterparties from initial interest through NDA and financial close.',
        'Deal rooms — Review executed NDAs, inspect permissioned data room drafts, and issue term sheets.',
      ],
    },
    {
      num: '04',
      title: 'Capital intelligence, official pipelines & interactive map',
      items: [
        'Capital explorer — Search 160+ providers across DFIs, ECAs, Arab/Gulf funds, sub-sovereign PPFs, local-currency guarantors (TCX, InfraCredit, InfraZamin), climate/carbon blending facilities, and African pension consortia, plus live grounded funding-call discovery.',
        'AU & DFI pipelines — Browse AU Agenda 2063 / AUDA-NEPAD PIDA, multilateral DFI, and national official agency projects (SA ISA, Kenya PPPD, Nigeria ICRC, etc.), run live official portal searches, and clone any project straight into your Workspace.',
        'Flows & Flows map — Customizable interactive world map (Natural Earth, Mercator, or 3D Globe) with live corridor signals, project POI pins, instrument layer filters, and Gemini AI optimal routing.',
      ],
    },
    {
      num: '05',
      title: 'Evidence labels',
      body: 'Every material claim carries an explicit provenance status: Verified current, Published programme, Open funding call, Historical precedent, Mandate match, or Inferred / analytical. Treat inferred and precedent items as leads rather than committed capital.',
    },
    {
      num: '06',
      title: 'Capital Guide assistant',
      body: 'Click the Capital Guide button (bottom-right) for context-aware help tailored to your current screen, active project readiness, and selected jurisdiction.',
    },
    {
      num: '07',
      title: 'Important limitations',
      items: [
        'All project figures, transaction volumes, and provider allocations in this prototype are illustrative.',
        'Legal authority checks provide structured decision support, not a formal legal opinion.',
        'Match scores are transparent heuristics for workflow demonstration.',
      ],
    },
  ];

  return (
    <section aria-labelledby="guide-heading" className="space-y-6">
      <SectionHeader
        title="User guide"
        hint="How borrowers and capital providers use Capital Intelligence from concept to close"
      />

      <div className="grid gap-5 md:grid-cols-2">
        {sections.map((s) => (
          <article
            key={s.num}
            className="rounded-xl border border-white/10 bg-[#0b1424] p-6"
          >
            <div className="font-mono-num text-xs font-semibold text-teal-300">
              {s.num}
            </div>
            <h3 className="mt-1.5 text-lg font-semibold text-slate-100">
              {s.title}
            </h3>
            {s.body && (
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {s.body}
              </p>
            )}
            {s.items && (
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
                {s.items.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
