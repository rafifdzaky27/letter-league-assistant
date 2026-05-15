"use client";

import Link from "next/link";
import Tile from "@/components/Tile";
import MobileBottomNav from "@/components/MobileBottomNav";

const wordData = {
  word: "ZEPHY R",
  tiles: [
    { letter: "Z", pts: 10, variant: "default" as const },
    { letter: "E", pts: 1, variant: "default" as const },
    { letter: "P", pts: 3, variant: "active" as const, badge: "NEW" },
    { letter: "H", pts: 4, variant: "default" as const },
    { letter: "Y", pts: 4, variant: "default" as const },
    { letter: "R", pts: 0, variant: "wild" as const },
  ],
  totalScore: 68,
  baseValue: 22,
  placementBonus: 46,
  classicScore: 68,
  wildScore: 93,
  definition:
    "Extravagantly chivalrous or romantic; visionary, impractical, or impracticable.",
};

export default function WordDetailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      {/* Desktop Header */}
      <header className="hidden border-b border-border-subtle bg-bg-primary px-8 py-4 md:block">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.88px] text-text-secondary no-underline hover:text-text-primary"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 12L6 8l4-4" />
            </svg>
            BACK TO SOLVER
          </Link>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-text-primary">
            Word Detail
          </h1>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="flex items-center justify-between border-b border-border-subtle bg-bg-primary px-4 py-3 md:hidden">
        <Link href="/" className="text-text-secondary no-underline">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 15l-5-5 5-5" />
          </svg>
        </Link>
        <h1 className="text-sm font-bold uppercase tracking-[1.8px] text-text-primary">
          WORD DETAIL
        </h1>
        <button className="text-text-secondary">
          <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor">
            <circle cx="2" cy="2" r="2" />
            <circle cx="2" cy="8" r="2" />
            <circle cx="2" cy="14" r="2" />
          </svg>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-24 md:px-32 md:pb-8">
        <div className="mx-auto max-w-4xl pb-20 pt-6 md:pt-10">
          {/* Game Tiles Display */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative inline-flex gap-2 rounded-lg border border-[rgba(69,70,85,0.2)] bg-bg-secondary p-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
              {/* Mobile: horizontal scroll tiles */}
              <div className="flex gap-2 overflow-x-auto md:gap-2">
                {wordData.tiles.map((t, i) => (
                  <Tile
                    key={i}
                    letter={t.letter}
                    points={t.pts}
                    variant={t.variant}
                    size="lg"
                    badge={t.badge}
                  />
                ))}
              </div>
            </div>

            {/* Status Chips */}
            <div className="flex gap-2">
              <span className="rounded-sm border border-[rgba(67,225,121,0.3)] bg-accent-green-muted px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[1.1px] text-accent-green">
                6 LETTERS
              </span>
              <span className="rounded-sm border border-[rgba(69,70,85,0.5)] bg-bg-tertiary px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[1.1px] text-text-secondary">
                HIGH VALUE
              </span>
            </div>

            {/* Mobile base points */}
            <div className="border-t border-border-subtle pt-3 text-center text-xs font-bold uppercase tracking-[1.1px] text-text-secondary md:hidden">
              BASE POINTS: {wordData.baseValue}
            </div>
          </div>

          {/* Mobile Definition */}
          <div className="mt-6 border-t border-border-subtle pt-4 md:hidden">
            <h3 className="text-xs font-bold uppercase tracking-[0.88px] text-accent-indigo-light">
              Definition
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {wordData.definition}
            </p>
          </div>

          {/* Scoring Bento Grid */}
          <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-12">
            {/* Hero Stat Panel */}
            <div className="relative overflow-hidden rounded-lg border border-[rgba(190,194,255,0.2)] bg-accent-indigo-bg-hover p-6 md:col-span-8">
              {/* Decorative element */}
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-20 rounded-full bg-accent-indigo opacity-10 blur-2xl" />

              <div className="relative">
                <h3 className="text-[11px] font-bold uppercase tracking-[1.1px] text-accent-indigo-light">
                  EST. TOTAL SCORE
                </h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[32px] font-extrabold tracking-tight text-text-primary">
                    {wordData.totalScore}
                  </span>
                  <span className="font-mono text-sm uppercase text-[rgba(190,194,255,0.7)]">
                    PTS
                  </span>
                </div>
              </div>

              <div className="mt-16 flex flex-col gap-4 md:mt-28 md:flex-row">
                <button className="flex items-center justify-center gap-2 rounded-sm bg-accent-indigo px-6 py-2 font-mono text-sm font-medium uppercase tracking-[0.7px] text-white shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition-all hover:brightness-110 md:flex-1">
                  <svg width="17" height="20" viewBox="0 0 17 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="5" y="1" width="11" height="14" rx="2" />
                    <path d="M1 5v12a2 2 0 0 0 2 2h9" />
                  </svg>
                  COPY WORD
                </button>
                <button className="flex items-center justify-center gap-2 rounded-sm border border-border-default px-6 py-2 font-mono text-sm font-medium uppercase tracking-[0.7px] text-text-primary transition-colors hover:bg-bg-tile md:flex-1">
                  <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 18V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16l-5-3-5 3z" />
                  </svg>
                  SAVE TO RACK
                </button>
              </div>
            </div>

            {/* Right panels */}
            <div className="flex flex-col gap-4 md:col-span-4">
              {/* Base Score */}
              <div className="rounded-lg border border-border-subtle bg-bg-secondary p-4">
                <div className="flex items-center justify-between border-b border-[rgba(69,70,85,0.2)] pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.88px] text-text-secondary">
                    BASE VALUE
                  </span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-text-secondary">
                    <rect x="1" y="1" width="12" height="12" rx="2" />
                    <path d="M4 4h6M4 7h6M4 10h4" />
                  </svg>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-semibold text-text-primary">
                    {wordData.baseValue}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.55px] text-text-secondary">
                    pts
                  </span>
                </div>
                <p className="mt-3 border-t border-[rgba(69,70,85,0.2)] pt-2 text-xs text-text-secondary">
                  Raw sum of active tiles
                </p>
              </div>

              {/* Placement Bonus */}
              <div className="relative overflow-hidden rounded-lg border border-border-subtle bg-bg-secondary p-4">
                <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-xl bg-[rgba(67,225,121,0.1)]" />
                <div className="relative">
                  <div className="flex items-center justify-between border-b border-[rgba(69,70,85,0.2)] pb-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.88px] text-text-secondary">
                      EST. PLACEMENT
                    </span>
                    <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="#43e179" strokeWidth="1.5">
                      <path d="M1 8l6-6 7 4" />
                    </svg>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-semibold text-accent-green">
                      +{wordData.placementBonus}
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.55px] text-[rgba(67,225,121,0.7)]">
                      pts
                    </span>
                  </div>
                  <p className="mt-3 border-t border-[rgba(69,70,85,0.2)] pt-2 text-xs text-text-secondary">
                    Based on 2x Word multiplier
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Scoring Potential */}
          <div className="mt-6 md:hidden">
            <h3 className="text-xs font-bold uppercase tracking-[0.88px] text-accent-indigo-light">
              Scoring Potential
            </h3>
            <div className="mt-3 flex flex-col gap-3">
              <div className="rounded-lg border border-border-subtle bg-bg-secondary p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">
                    Classic Mode
                  </span>
                  <span className="rounded-sm bg-bg-tile px-2 py-0.5 text-[10px] font-bold uppercase text-text-secondary">
                    Standard
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-sm bg-bg-tile px-1.5 py-0.5 text-[10px] font-bold text-text-secondary">
                    DW
                  </span>
                  <span className="rounded-sm bg-bg-tile px-1.5 py-0.5 text-[10px] font-bold text-text-secondary">
                    TL
                  </span>
                </div>
                <p className="mt-2 text-right text-3xl font-bold text-accent-green">
                  84
                </p>
              </div>
              <div className="rounded-lg border border-accent-indigo bg-accent-indigo-bg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">
                    Wild Mode
                  </span>
                  <span className="rounded-sm bg-accent-indigo px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    Max Multiplier
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-sm bg-accent-indigo px-1.5 py-0.5 text-[10px] font-bold text-white">
                    TW
                  </span>
                  <span className="rounded-sm bg-accent-indigo px-1.5 py-0.5 text-[10px] font-bold text-white">
                    TW
                  </span>
                </div>
                <p className="mt-2 text-right text-3xl font-bold text-accent-yellow">
                  234
                </p>
              </div>
            </div>
          </div>

          {/* Mode Comparison - Desktop */}
          <section className="mt-8 hidden overflow-hidden rounded-lg border border-border-subtle bg-[#181c1f] md:block">
            <div className="flex items-center gap-2 border-b border-border-subtle bg-bg-secondary px-4 py-2">
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-primary">
                <path d="M1 8h18M7 1l-6 7 6 7M13 1l6 7-6 7" />
              </svg>
              <h2 className="text-xl font-semibold text-text-primary">
                Ruleset Comparison
              </h2>
            </div>
            <div className="grid grid-cols-2">
              {/* Classic */}
              <div className="flex flex-col gap-2 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-text-primary">
                      <rect x="1" y="1" width="9" height="11" rx="1.5" />
                    </svg>
                    <span className="font-mono text-sm font-medium uppercase tracking-[0.7px] text-text-primary">
                      CLASSIC MODE
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold text-text-primary">
                      {wordData.classicScore}
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.55px] text-text-secondary">
                      pts
                    </span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary">
                  Standard dictionary scoring. Length bonuses are not applied in
                  this ruleset.
                </p>
              </div>

              {/* Wild */}
              <div className="relative flex flex-col gap-2 border-l border-border-subtle bg-accent-indigo-bg-hover p-6">
                <div className="absolute bottom-0 left-0 top-0 w-1 bg-accent-indigo-light" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg width="13" height="9" viewBox="0 0 13 9" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-accent-indigo-light">
                      <path d="M1 5a5 5 0 0 1 5-4 5 5 0 0 1 5 4" />
                    </svg>
                    <span className="font-mono text-sm font-bold uppercase tracking-[0.7px] text-accent-indigo-light">
                      WILD MODE
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-accent-indigo-light">
                      {wordData.wildScore}
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.55px] text-[rgba(190,194,255,0.7)]">
                      pts
                    </span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary">
                  Includes a +25 point length bonus for exceeding 5 letters under
                  Wild rules.
                </p>
              </div>
            </div>
          </section>

          {/* Dictionary Link - Desktop */}
          <div className="mt-8 hidden justify-center md:flex">
            <Link
              href="/dictionary"
              className="flex items-center gap-1 rounded-sm px-4 py-2 font-mono text-sm text-text-secondary no-underline transition-colors hover:text-text-primary"
            >
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="1" y="1" width="15" height="10" rx="1.5" />
                <path d="M5 4h7M5 7h4" />
              </svg>
              <span className="border-b border-dashed border-[rgba(69,70,85,0.5)] pb-px">
                Check in Dictionary
              </span>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M1 5h12M9 1l4 4-4 4" />
              </svg>
            </Link>
          </div>

          {/* Mobile action buttons */}
          <div className="mt-6 flex gap-3 md:hidden">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-bg-secondary py-3 font-mono text-xs font-medium uppercase tracking-[0.88px] text-text-primary shadow-sm">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="1" width="9" height="10" rx="1.5" />
                <path d="M1 4v8a1.5 1.5 0 0 0 1.5 1.5H9" />
              </svg>
              COPY WORD
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-accent-indigo py-3 font-mono text-xs font-medium uppercase tracking-[0.88px] text-white shadow-sm">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 13V1.5A.5.5 0 0 1 1.5 1h11a.5.5 0 0 1 .5.5V13l-6-3-6 3z" />
              </svg>
              SAVE TO RACK
            </button>
          </div>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
