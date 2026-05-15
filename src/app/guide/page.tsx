"use client";

import { useState } from "react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const letterValues = [
  { letter: "A", pts: 1, count: 9 },
  { letter: "B", pts: 3, count: 2 },
  { letter: "C", pts: 3, count: 2 },
  { letter: "D", pts: 2, count: 4 },
  { letter: "E", pts: 1, count: 12 },
  { letter: "F", pts: 4, count: 2 },
  { letter: "G", pts: 2, count: 3 },
  { letter: "H", pts: 4, count: 2 },
  { letter: "I", pts: 1, count: 9 },
  { letter: "J", pts: 8, count: 1 },
  { letter: "K", pts: 5, count: 1 },
  { letter: "L", pts: 1, count: 4 },
  { letter: "M", pts: 3, count: 2 },
  { letter: "N", pts: 1, count: 6 },
  { letter: "O", pts: 1, count: 8 },
  { letter: "P", pts: 3, count: 2 },
  { letter: "Q", pts: 10, count: 1 },
  { letter: "R", pts: 1, count: 6 },
  { letter: "S", pts: 1, count: 4 },
  { letter: "T", pts: 1, count: 6 },
  { letter: "U", pts: 1, count: 4 },
  { letter: "V", pts: 4, count: 2 },
  { letter: "W", pts: 4, count: 2 },
  { letter: "X", pts: 8, count: 1 },
  { letter: "Y", pts: 4, count: 2 },
  { letter: "Z", pts: 10, count: 1 },
  { letter: "BLANK", pts: 0, count: 2 },
];

const faqItems = [
  {
    q: "Which dictionary is used?",
    a: "We use a bundled wordlist based on standard tournament word lists. The dictionary is loaded locally — no internet required for solving.",
  },
  {
    q: "Why was my word rejected in-game?",
    a: "Live games may use a different or updated dictionary version. Our solver operates on a snapshot basis. Check the Dictionary Checker page to verify words.",
  },
  {
    q: "Are proper nouns allowed?",
    a: "No. Standard rules prohibit proper nouns, abbreviations, and hyphenated words. Our solver filters these out by default.",
  },
  {
    q: "What do the tile colors mean?",
    a: "Green/active tiles come from your rack. Gray/default tiles are board letters already placed. Outlined tiles are blank/wildcard tiles (score 0 points).",
  },
];

export default function GuidePage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <TopNav />
      <main className="flex-1 overflow-y-auto px-6 pb-24 md:px-16 md:pb-8">
        <div className="mx-auto max-w-5xl py-8 md:py-12">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
              How to Play & Solver Guide
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary md:text-base">
              Learn how the solver works, understand the three input modes, and master the board mechanics.
            </p>
          </div>

          {/* ── THREE SOLVER MODES ── */}
          <h2 className="mt-10 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">
            <span className="text-accent-indigo-light">&lt;&gt;</span> SOLVER MODES
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {/* Mode 1: Board Letters */}
            <div className="rounded-lg border border-accent-green-border bg-[rgba(67,225,121,0.03)] p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold text-accent-green">Board Letters</h3>
                <span className="rounded bg-accent-green-bg px-2 py-0.5 font-mono text-[10px] font-bold text-accent-green">RECOMMENDED</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-text-secondary">
                Type the letters visible on the board. The solver finds words using your rack + any subset of those board letters.
              </p>
              <div className="mt-4 rounded border border-border-subtle bg-bg-input p-3">
                <div className="font-mono text-xs text-text-secondary">
                  <div>Rack: <span className="float-right font-bold text-text-primary">OU</span></div>
                  <div className="mt-1">Pattern: <span className="float-right font-bold text-accent-green">BGHTL</span></div>
                  <div className="mt-2 border-t border-border-faint pt-2">Result:</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {["BOUGHT", "BOUGH", "GHOUL", "TOUGH"].map((w) => (
                      <span key={w} className="rounded bg-accent-green px-2 py-0.5 text-[10px] font-bold text-bg-primary">{w}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mode 2: Positional Pattern */}
            <div className="rounded-lg border border-[rgba(88,101,242,0.3)] bg-[rgba(88,101,242,0.03)] p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold text-accent-indigo-light">Positional Pattern</h3>
                <span className="rounded bg-accent-indigo-bg px-2 py-0.5 font-mono text-[10px] font-bold text-accent-indigo-light">ADVANCED</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-text-secondary">
                Use dots (<code className="text-accent-indigo-light">.</code>) for positions to fill from rack. Letters mark fixed board positions.
              </p>
              <div className="mt-4 rounded border border-border-subtle bg-bg-input p-3">
                <div className="font-mono text-xs text-text-secondary">
                  <div>Rack: <span className="float-right font-bold text-text-primary">ADELRT?</span></div>
                  <div className="mt-1">Pattern: <span className="float-right font-bold text-accent-indigo-light">.E..R</span></div>
                  <div className="mt-2 border-t border-border-faint pt-2">Result:</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {["DETER", "CEDAR", "ELDER"].map((w) => (
                      <span key={w} className="rounded bg-accent-indigo px-2 py-0.5 text-[10px] font-bold text-white">{w}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mode 3: Rack Only */}
            <div className="rounded-lg border border-accent-yellow-border bg-[rgba(192,172,35,0.03)] p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold text-accent-yellow">Rack Only</h3>
                <span className="rounded bg-accent-yellow-bg px-2 py-0.5 font-mono text-[10px] font-bold text-accent-yellow">SIMPLE</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-text-secondary">
                Leave the pattern empty. The solver finds all words formable from your rack letters alone (anagram search).
              </p>
              <div className="mt-4 rounded border border-border-subtle bg-bg-input p-3">
                <div className="font-mono text-xs text-text-secondary">
                  <div>Rack: <span className="float-right font-bold text-text-primary">ARTIES?</span></div>
                  <div className="mt-1">Pattern: <span className="float-right italic text-text-muted">(empty)</span></div>
                  <div className="mt-2 border-t border-border-faint pt-2">Result:</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {["ARTISTE", "SATIRE", "AIREST"].map((w) => (
                      <span key={w} className="rounded bg-accent-yellow px-2 py-0.5 text-[10px] font-bold text-bg-primary">{w}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RULES COMPARISON ── */}
          <div className="mt-10 grid gap-6 md:grid-cols-12">
            {/* Blank Tiles & Wildcards */}
            <div className="rounded-lg border border-border-subtle bg-bg-secondary p-6 md:col-span-7">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-indigo-light">
                  <rect x="2" y="2" width="12" height="12" rx="2" />
                  <path d="M5 5h6M5 8h6M5 11h4" />
                </svg>
                <h2 className="text-xl font-bold text-text-primary">
                  Blank Tiles & Wildcards
                </h2>
              </div>
              <p className="mt-3 text-sm text-text-secondary">
                Use <code className="rounded bg-bg-tile px-1.5 py-0.5 font-mono text-accent-yellow">?</code> or{" "}
                <code className="rounded bg-bg-tile px-1.5 py-0.5 font-mono text-accent-yellow">*</code> in your rack to represent blank tiles.
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 rounded border border-border-subtle bg-bg-input p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-dashed border-accent-yellow-border bg-[rgba(192,172,35,0.05)] font-mono text-lg font-bold text-accent-yellow">?</div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Blank Tile</p>
                    <p className="text-xs text-text-secondary">Matches any letter but scores 0 points (Classic) or face value (Wild).</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded border border-border-subtle bg-bg-input p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-dashed border-border-default bg-bg-tile font-mono text-lg font-bold text-text-muted">.</div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Position Dot (in pattern)</p>
                    <p className="text-xs text-text-secondary">Represents an empty board position that must be filled from your rack.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specific Rules */}
            <div className="rounded-lg border border-border-subtle bg-bg-secondary p-6 md:col-span-5">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-yellow">
                  <path d="M8 1l2 4 4.5.7-3.25 3.2.8 4.6L8 11.4 3.95 13.5l.8-4.6L1.5 5.7 6 5z" />
                </svg>
                <h2 className="text-xl font-bold text-text-primary">
                  Classic vs Wild
                </h2>
              </div>

              <div className="mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-subtle text-left">
                      <th className="pb-2 font-mono text-xs font-bold uppercase tracking-[0.55px] text-text-secondary">Rule</th>
                      <th className="pb-2 font-mono text-xs font-bold uppercase tracking-[0.55px] text-text-secondary">Classic</th>
                      <th className="pb-2 font-mono text-xs font-bold uppercase tracking-[0.55px] text-accent-indigo-light">Wild</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    <tr>
                      <td className="py-2 font-mono text-xs text-text-primary">Blank Tiles</td>
                      <td className="py-2 text-xs text-text-secondary">Score 0</td>
                      <td className="py-2 text-xs text-accent-indigo-light">Score Face Val</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-xs text-text-primary">Bingo Bonus</td>
                      <td className="py-2 text-xs text-text-secondary">35 pts (7 tiles)</td>
                      <td className="py-2 text-xs text-accent-indigo-light">40 pts (7 tiles)</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-xs text-text-primary">Multipliers</td>
                      <td className="py-2 text-xs text-text-secondary">Standard</td>
                      <td className="py-2 text-xs text-accent-indigo-light">Stackable</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-6 text-xs italic text-text-secondary">
                Toggle &apos;Classic / Wild&apos; in the top navigation to switch modes.
              </p>
            </div>
          </div>

          {/* ── MULTIPLIER TOKENS (mobile) ── */}
          <div className="mt-6 md:hidden">
            <h3 className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">
              ☆ MULTIPLIER TOKENS
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { label: "2x Letter", color: "bg-[#2196F3]" },
                { label: "3x Letter", color: "bg-[#4CAF50]" },
                { label: "2x Word", color: "bg-[#E91E63]" },
                { label: "3x Word", color: "bg-[#FF9800]" },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-2 rounded border border-border-subtle bg-bg-secondary p-3">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-sm ${m.color} text-[10px] font-bold text-white`}>
                    {m.label.slice(0, 2)}
                  </span>
                  <span className="font-mono text-xs text-text-secondary">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── LETTER VALUES ── */}
          <section className="mt-10">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-indigo-light">
                <rect x="1" y="1" width="6" height="6" rx="1" />
                <rect x="9" y="1" width="6" height="6" rx="1" />
                <rect x="1" y="9" width="6" height="6" rx="1" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
              <h2 className="text-xl font-bold text-text-primary">
                Letter Values & Distribution
              </h2>
            </div>

            <div className="mt-4 overflow-x-auto">
              <div className="grid min-w-[640px] grid-cols-9 gap-px rounded-lg border border-border-subtle bg-border-subtle">
                {letterValues.map((lv) => (
                  <div
                    key={lv.letter}
                    className={`flex items-center gap-1 bg-bg-secondary p-2 ${
                      lv.letter === "Q" || lv.letter === "Z"
                        ? "text-accent-yellow"
                        : "text-text-primary"
                    }`}
                  >
                    <span className="font-mono text-sm font-bold">{lv.letter}</span>
                    <div className="flex flex-col text-right text-[10px] text-text-secondary">
                      <span>{lv.pts}pt</span>
                      <span>x{lv.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="mt-10">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-indigo-light">
                <rect x="2" y="1" width="12" height="14" rx="2" />
                <path d="M5 5h6M5 8h6M5 11h3" />
              </svg>
              <h2 className="text-xl font-bold text-text-primary">
                FAQ
              </h2>
            </div>

            {/* Desktop */}
            <div className="mt-4 hidden grid-cols-2 gap-6 md:grid">
              {faqItems.map((item, i) => (
                <div key={i}>
                  <h3 className="font-mono text-sm font-bold text-text-primary">{item.q}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">{item.a}</p>
                </div>
              ))}
            </div>

            {/* Mobile accordion */}
            <div className="mt-4 flex flex-col gap-2 md:hidden">
              {faqItems.map((item, i) => (
                <div key={i} className="rounded-lg border border-border-subtle bg-bg-secondary">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="flex w-full items-center justify-between p-4 text-left text-sm text-text-primary"
                  >
                    {item.q}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className={`shrink-0 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`}
                    >
                      <path d="M2 4l4 4 4-4" />
                    </svg>
                  </button>
                  {expandedFaq === i && (
                    <div className="border-t border-border-subtle px-4 py-3 text-xs leading-relaxed text-text-secondary">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
