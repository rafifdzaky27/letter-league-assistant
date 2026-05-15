"use client";

import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Tile from "@/components/Tile";

const mockResults = [
  {
    word: [
      { letter: "Q", pts: 10, variant: "default" as const },
      { letter: "U", pts: 1, variant: "active" as const },
      { letter: "I", pts: 1, variant: "default" as const },
      { letter: "Z", pts: 10, variant: "default" as const },
    ],
    score: 66,
    length: 4,
    selected: true,
  },
  {
    word: [
      { letter: "Z", pts: 10, variant: "default" as const },
      { letter: "A", pts: 1, variant: "default" as const },
      { letter: "P", pts: 3, variant: "default" as const },
    ],
    score: 42,
    length: 3,
    selected: false,
  },
  {
    word: [
      { letter: "J", pts: 8, variant: "default" as const },
      { letter: "O", pts: 0, variant: "blank" as const },
      { letter: "Y", pts: 4, variant: "default" as const },
    ],
    score: 36,
    length: 3,
    selected: false,
  },
];

export default function SolverDashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 pb-24 md:p-8 md:pb-8">
          {/* Mobile Rack Editor - shown only on mobile */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">
                Current Rack
              </h2>
              <button className="flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 2l8 8M10 2L2 10" />
                </svg>
                Clear
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 rounded border border-border-subtle bg-bg-secondary p-3">
              {["A", "R", "T", "I", "E", "S"].map((l, i) => (
                <Tile key={i} letter={l} points={1} size="md" />
              ))}
              <Tile letter="✦" points={0} variant="wild" size="md" />
            </div>
            <div className="mt-2 rounded border border-border-subtle bg-bg-secondary px-3 py-2 font-mono text-sm text-text-secondary">
              ARTIES*
            </div>
          </div>

          {/* Board Pattern Syntax */}
          <section className="relative overflow-hidden rounded bg-bg-secondary border border-[rgba(69,70,85,0.5)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            {/* Decorative blur */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-xl bg-[rgba(88,101,242,0.05)] blur-[32px]" />

            <div className="relative flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text-primary">
                Board Pattern Syntax
              </h2>
              <span className="rounded-sm border border-accent-yellow-border bg-accent-yellow-bg px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.88px] text-accent-yellow">
                Advanced
              </span>
            </div>

            <div className="mt-4">
              {/* Mobile label */}
              <div className="mb-2 flex items-center gap-1 text-xs font-bold uppercase tracking-[0.88px] text-text-secondary md:hidden">
                Board Syntax
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="6" cy="6" r="5" />
                  <path d="M6 8V6M6 4h.01" />
                </svg>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. ?A*E (regex supported)"
                  className="w-full border-b-2 border-border-default bg-bg-input px-4 py-4 font-mono text-lg font-bold text-text-primary placeholder:text-text-placeholder focus:border-accent-indigo focus:outline-none"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                  <svg width="17" height="13" viewBox="0 0 17 13" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M16 1L6 11L1 6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="6" cy="6" r="5" />
                <path d="M6 8V6M6 4h.01" />
              </svg>
              <span className="font-mono text-[11px] tracking-[0.55px] text-text-secondary">
                {`Use '?' for single blank, '*' for multiple wildcards, brackets '[XYZ]' for specific constraints.`}
              </span>
            </div>

            {/* Mobile syntax chips */}
            <div className="mt-3 flex flex-wrap gap-2 md:hidden">
              {["^ Start", "$ End", ". Any", "[ ] Set"].map((c) => (
                <span
                  key={c}
                  className="rounded border border-border-default bg-bg-secondary px-3 py-1.5 font-mono text-xs text-text-secondary"
                >
                  {c}
                </span>
              ))}
            </div>
          </section>

          {/* Action & Filter Row */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button className="flex items-center justify-center gap-2 rounded-sm bg-accent-indigo px-10 py-4 text-xl font-semibold text-white shadow-[0_0_7.5px_rgba(88,101,242,0.2)] transition-all hover:brightness-110 active:scale-[0.98]">
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 1v18M1 8l7-7 7 7" />
              </svg>
              Execute Solve
            </button>
            <div className="flex gap-2 overflow-x-auto">
              {[
                { label: "Score (Desc)", active: true },
                { label: "Length", active: false },
                { label: "Blanks: Allowed", active: false },
              ].map((f) => (
                <button
                  key={f.label}
                  className={`flex shrink-0 items-center gap-1 rounded-sm border border-border-default bg-bg-secondary px-4 py-2 text-[11px] font-bold uppercase tracking-[0.88px] transition-colors hover:bg-bg-tile ${
                    f.active ? "text-text-primary" : "text-text-secondary"
                  }`}
                >
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 1h10M3 4h6M5 7h2" />
                  </svg>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Top Plays Count */}
          <div className="flex items-center justify-between md:hidden">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">
              Top Plays (142)
            </span>
            <span className="font-mono text-xs text-text-secondary">
              Sort: Score ▾
            </span>
          </div>

          {/* Results Data Grid */}
          <section className="flex-1 overflow-hidden rounded border border-[rgba(69,70,85,0.4)] bg-bg-secondary shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            {/* Grid Header - desktop */}
            <div className="hidden border-b border-[rgba(69,70,85,0.5)] bg-bg-tertiary px-4 py-2 md:grid md:grid-cols-12 md:gap-1">
              <span className="col-span-6 text-[11px] font-bold tracking-[0.55px] text-text-secondary">
                Suggested Word
              </span>
              <span className="col-span-2 text-right text-[11px] font-bold tracking-[0.55px] text-text-secondary">
                Est. Score
              </span>
              <span className="col-span-2 text-right text-[11px] font-bold tracking-[0.55px] text-text-secondary">
                Length
              </span>
              <span className="col-span-2 text-right text-[11px] font-bold tracking-[0.55px] text-text-secondary">
                Def
              </span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[rgba(69,70,85,0.1)]">
              {mockResults.map((r, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-12 items-center gap-1 px-4 py-1.5 transition-colors hover:bg-[rgba(255,255,255,0.02)] ${
                    r.selected
                      ? "border-l-2 border-l-accent-indigo-light bg-[rgba(49,53,56,0.2)]"
                      : ""
                  }`}
                >
                  {/* Desktop tile row */}
                  <div className="col-span-6 hidden gap-0.5 md:flex">
                    {r.word.map((t, ti) => (
                      <Tile
                        key={ti}
                        letter={t.letter}
                        points={t.pts}
                        variant={t.variant}
                        size="sm"
                      />
                    ))}
                  </div>

                  {/* Mobile word display */}
                  <div className="col-span-8 md:hidden">
                    <span className="font-mono text-base font-bold uppercase tracking-wider text-text-primary">
                      {r.word.map((t) => t.letter).join("")}
                    </span>
                    <span className="ml-2 text-xs text-text-secondary">
                      Probability: {idx === 0 ? "High" : idx === 1 ? "Med" : "Low"}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="col-span-2 flex justify-end md:col-span-2">
                    <span className="rounded-sm border border-accent-green-border bg-accent-green-bg px-2.5 py-0.5 font-mono text-sm font-medium text-accent-green shadow-[0_0_10px_rgba(67,225,121,0.1)]">
                      {r.score}
                    </span>
                  </div>

                  {/* Length */}
                  <span className="col-span-2 hidden text-right font-mono text-sm text-text-secondary md:block">
                    {r.length}
                  </span>

                  {/* Def button */}
                  <div className="col-span-2 flex justify-end">
                    <button className="text-text-secondary hover:text-text-primary" aria-label="Definition">
                      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <rect x="1" y="1" width="16" height="14" rx="2" />
                        <path d="M5 5h8M5 8h5" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
