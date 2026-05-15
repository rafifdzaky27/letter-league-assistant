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
    a: "We aggregate data from standard tournament word lists (TWL/NWL) and international variants (CSW) to ensure maximum coverage. You can filter by specific region in the Settings menu.",
  },
  {
    q: "Why was my word rejected in-game?",
    a: "Live games occasionally push undocumented, silent updates to their dictionaries to remove offensive words or adjust to recent language trends. Our solver operates on a snapshot basis.",
  },
  {
    q: "Are proper nouns allowed?",
    a: "Generally, no. Standard rules strictly prohibit proper nouns, abbreviations, and words requiring hyphens. Our solver filters these out by default.",
  },
  {
    q: "How often is the database updated?",
    a: "The core dictionary is synchronized quarterly with official tournament bodies. Minor patch updates for specific game variants are pushed silently on a monthly basis.",
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
              <span className="hidden md:inline">How-to-Play & Pattern Guide</span>
              <span className="md:hidden">Pattern Guide</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary md:text-base">
              Master the syntax to uncover high-scoring words instantly.
              Understand the board mechanics, letter values, and dictionary
              constraints to optimize your plays.
            </p>
          </div>

          {/* Mobile: Query Syntax label */}
          <h2 className="mt-8 flex items-center gap-1 text-xs font-bold uppercase tracking-[0.88px] text-text-secondary md:hidden">
            <span className="text-accent-indigo-light">&lt;&gt;</span> QUERY SYNTAX
          </h2>

          {/* Bento Grid - Pattern Syntax + Rules */}
          <div className="mt-6 grid gap-6 md:mt-10 md:grid-cols-12">
            {/* Manual Pattern Syntax */}
            <div className="rounded-lg border border-border-subtle bg-bg-secondary p-6 md:col-span-7">
              <div className="hidden items-center gap-2 md:flex">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-indigo-light">
                  <rect x="2" y="2" width="12" height="12" rx="2" />
                  <path d="M5 5h6M5 8h6M5 11h4" />
                </svg>
                <h2 className="text-xl font-bold text-text-primary">
                  Manual Pattern Syntax
                </h2>
              </div>
              <p className="mt-3 text-sm text-text-secondary md:mt-4">
                Use special characters to define specific positions on the board
                when searching for words.
              </p>

              {/* Exact Position Matches */}
              <div className="mt-6 rounded border border-accent-green-border bg-[rgba(67,225,121,0.03)] p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-sm font-bold text-accent-green">
                    <span className="md:hidden">•</span>
                    <span className="hidden md:inline">Exact Position Matches</span>
                    <span className="md:hidden"> Single Missing</span>
                  </h3>
                  <span className="rounded bg-bg-tile px-2 py-0.5 font-mono text-xs text-text-secondary">
                    . (Period)
                  </span>
                </div>
                <p className="mt-2 text-xs text-text-secondary">
                  Use a period to represent exactly one unknown letter. Ideal for
                  building through existing letters.
                </p>
                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                  <div className="flex items-center gap-1.5">
                    {[".", "E", ".", ".", "R"].map((l, i) => (
                      <div
                        key={i}
                        className={`flex h-10 w-10 items-center justify-center rounded-sm border font-mono text-lg font-bold ${
                          l === "."
                            ? "border-dashed border-border-default bg-bg-input text-text-muted"
                            : "border-accent-green-border bg-[rgba(67,225,121,0.1)] text-accent-green"
                        }`}
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                  <span className="hidden text-text-muted md:block">→</span>
                  <div className="flex flex-wrap gap-1">
                    {["ENTER", "EAGER", "EMBER"].map((w) => (
                      <span
                        key={w}
                        className="rounded bg-accent-green px-2 py-0.5 text-xs font-bold text-bg-primary"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mobile example */}
                <div className="mt-3 rounded border border-border-subtle bg-bg-input p-3 font-mono text-xs text-text-secondary md:hidden">
                  <div>Input Pattern: <span className="float-right rounded bg-bg-tile px-2 py-0.5 font-bold text-text-primary">T.ST</span></div>
                  <div className="mt-2">Matches found:</div>
                  <div className="mt-1 flex gap-1">
                    <span className="rounded bg-accent-green px-2 py-0.5 font-bold text-bg-primary">TEST</span>
                    <span className="rounded bg-accent-green px-2 py-0.5 font-bold text-bg-primary">TOST</span>
                  </div>
                </div>
              </div>

              {/* Variable Length Matches */}
              <div className="mt-4 rounded border border-accent-yellow-border bg-[rgba(192,172,35,0.03)] p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-sm font-bold text-accent-yellow">
                    <span className="hidden md:inline">Variable Length Matches</span>
                    <span className="md:hidden">? Wildcard Tile</span>
                  </h3>
                  <span className="rounded bg-bg-tile px-2 py-0.5 font-mono text-xs text-text-secondary">
                    ? (Question Mark)
                  </span>
                </div>
                <p className="mt-2 text-xs text-text-secondary">
                  <span className="hidden md:inline">
                    Use a question mark to represent zero or more unknown letters.
                    Useful for finding prefixes or suffixes.
                  </span>
                  <span className="md:hidden">
                    Represents a blank tile from your rack. Can be mapped to any
                    letter, scoring 0 base points.
                  </span>
                </p>
                <div className="mt-4 hidden items-center gap-4 md:flex">
                  <div className="flex items-center gap-1.5">
                    {["A", "?", "?", "T"].map((l, i) => (
                      <div
                        key={i}
                        className={`flex h-10 w-10 items-center justify-center rounded-sm border font-mono text-lg font-bold ${
                          l === "?"
                            ? "border-dashed border-accent-yellow-border bg-[rgba(192,172,35,0.05)] text-accent-yellow"
                            : "border-accent-green-border bg-[rgba(67,225,121,0.1)] text-accent-green"
                        }`}
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                  <span className="text-text-muted">→</span>
                  <div className="flex flex-wrap gap-1">
                    {["ART", "AUNT", "AIRCRAFT"].map((w) => (
                      <span
                        key={w}
                        className="rounded bg-accent-yellow px-2 py-0.5 text-xs font-bold text-bg-primary"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Mobile example */}
                <div className="mt-3 rounded border border-border-subtle bg-bg-input p-3 font-mono text-xs text-text-secondary md:hidden">
                  <div>Rack Input: <span className="float-right font-bold text-text-primary">A E I ? ?</span></div>
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
                  Specific Rules
                </h2>
              </div>

              <div className="mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-subtle text-left">
                      <th className="pb-2 font-mono text-xs font-bold uppercase tracking-[0.55px] text-text-secondary">
                        Rule
                      </th>
                      <th className="pb-2 font-mono text-xs font-bold uppercase tracking-[0.55px] text-text-secondary">
                        Classic
                      </th>
                      <th className="pb-2 font-mono text-xs font-bold uppercase tracking-[0.55px] text-accent-indigo-light">
                        Wild Mode
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    <tr>
                      <td className="py-2 font-mono text-xs text-text-primary">
                        Blank Tiles
                      </td>
                      <td className="py-2 text-xs text-text-secondary">
                        Score 0
                      </td>
                      <td className="py-2 text-xs text-accent-indigo-light">
                        Score Face Val
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-xs text-text-primary">
                        Bingo Bonus
                      </td>
                      <td className="py-2 text-xs text-text-secondary">
                        35 pts (7 tiles)
                      </td>
                      <td className="py-2 text-xs text-accent-indigo-light">
                        40 pts (7 tiles)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-xs text-text-primary">
                        Multipliers
                      </td>
                      <td className="py-2 text-xs text-text-secondary">
                        Standard
                      </td>
                      <td className="py-2 text-xs text-accent-indigo-light">
                        Stackable
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-6 text-xs italic text-text-secondary">
                Toggle &apos;Wild Mode&apos; in the top navigation to recalculate
                scores automatically.
              </p>
            </div>
          </div>

          {/* Mobile: Multiplier Tokens */}
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
                <div
                  key={m.label}
                  className="flex items-center gap-2 rounded border border-border-subtle bg-bg-secondary p-3"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-sm ${m.color} text-[10px] font-bold text-white`}
                  >
                    {m.label.slice(0, 2)}
                  </span>
                  <span className="font-mono text-xs text-text-secondary">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Letter Values & Distribution */}
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
                    <span className="font-mono text-sm font-bold">
                      {lv.letter}
                    </span>
                    <div className="flex flex-col text-right text-[10px] text-text-secondary">
                      <span>{lv.pts}pt</span>
                      <span>x{lv.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Dictionary Accuracy & FAQ */}
          <section className="mt-10">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-indigo-light">
                <rect x="2" y="1" width="12" height="14" rx="2" />
                <path d="M5 5h6M5 8h6M5 11h3" />
              </svg>
              <h2 className="text-xl font-bold text-text-primary">
                <span className="hidden md:inline">Dictionary Accuracy & FAQ</span>
                <span className="md:hidden">System FAQ</span>
              </h2>
            </div>

            {/* Desktop: grid layout */}
            <div className="mt-4 hidden grid-cols-2 gap-6 md:grid">
              {faqItems.map((item, i) => (
                <div key={i}>
                  <h3 className="font-mono text-sm font-bold text-text-primary">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile: accordion */}
            <div className="mt-4 flex flex-col gap-2 md:hidden">
              {faqItems.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border-subtle bg-bg-secondary"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === i ? null : i)
                    }
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
                      className={`shrink-0 transition-transform ${
                        expandedFaq === i ? "rotate-180" : ""
                      }`}
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
