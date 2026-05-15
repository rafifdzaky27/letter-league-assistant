"use client";

import { useState } from "react";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Tile from "@/components/Tile";

const recentChecks = [
  {
    word: "AILERON",
    valid: true,
    type: "Noun",
    points: 7,
  },
  {
    word: "QWERTY",
    valid: false,
    type: "Not in Dictionary",
    points: null,
  },
  {
    word: "ZENITH",
    valid: true,
    type: "Noun",
    points: 18,
  },
];

const queryResult = {
  word: "QUERENT",
  valid: true,
  score: 16,
  length: 7,
  probability: "Rare",
  tiles: [
    { letter: "Q", pts: 10 },
    { letter: "U", pts: 1 },
    { letter: "E", pts: 1 },
    { letter: "R", pts: 1 },
    { letter: "E", pts: 1 },
    { letter: "N", pts: 1 },
    { letter: "T", pts: 1 },
  ],
};

export default function DictionaryCheckerPage() {
  const [searchQuery, setSearchQuery] = useState("QUERENT");

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 pb-24 md:p-8 md:pb-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              Dictionary Checker
            </h1>
            <p className="text-sm text-text-secondary">
              Quickly verify words and check base scores.
            </p>
          </div>

          {/* Search Interface */}
          <section className="rounded-lg border border-border-default bg-[#181c1f] p-6 shadow-[0_0_12px_rgba(0,0,0,0.4)]">
            {/* Mobile search bar */}
            <div className="relative md:hidden">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="7" cy="7" r="5" />
                <path d="M11 11l3 3" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                className="w-full border-b border-border-default bg-transparent py-3 pl-10 pr-10 font-mono text-sm uppercase tracking-wider text-text-primary placeholder:text-text-placeholder focus:border-accent-indigo focus:outline-none"
                placeholder="Search word..."
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 2l8 8M10 2L2 10" />
                </svg>
              </button>
            </div>

            {/* Desktop search bar */}
            <div className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                  className="w-full border border-[#8f8fa0] border-b-2 bg-bg-tile px-4 py-6 font-mono text-lg font-bold uppercase tracking-[1.8px] text-text-primary placeholder:text-text-placeholder focus:border-accent-indigo focus:outline-none"
                  placeholder="TYPE A WORD..."
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-accent-indigo p-2 text-white transition-all hover:brightness-110">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="7" cy="7" r="5" />
                    <path d="M11 11l5 5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 flex items-start gap-2 border border-[rgba(69,70,85,0.5)] bg-bg-secondary p-2">
              <svg
                className="mt-0.5 shrink-0 text-text-muted"
                width="13"
                height="15"
                viewBox="0 0 13 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <circle cx="6.5" cy="7.5" r="6" />
                <path d="M6.5 10V7M6.5 5h.01" />
              </svg>
              <span className="text-xs text-text-muted">
                Checked against bundled dictionary v1.1. Results may vary from
                live game logic.
              </span>
            </div>
          </section>

          {/* Result Status */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Valid Result Card */}
            <div className="flex flex-col items-center justify-center gap-2 overflow-hidden rounded border border-accent-green-border bg-bg-secondary p-6 text-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#43e179" strokeWidth="2" fill="rgba(67,225,121,0.1)" />
                <path d="M12 20l6 6 10-10" stroke="#43e179" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h2 className="text-2xl font-semibold uppercase tracking-tight text-accent-green">
                VALID WORD
              </h2>

              {/* Mobile description */}
              <p className="text-sm text-text-secondary md:hidden">
                Found in NWL2023 and CSW21 dictionaries.
              </p>

              {/* Tiles display */}
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {queryResult.tiles.map((t, i) => (
                  <Tile key={i} letter={t.letter} points={t.pts} />
                ))}
              </div>

              {/* Mobile base score text */}
              <p className="mt-2 text-xs text-text-secondary md:hidden">
                Base score before board multipliers.
              </p>
            </div>

            {/* Score Card */}
            <div className="flex flex-col justify-between rounded border border-border-default bg-bg-secondary p-6">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.88px] text-text-secondary">
                  BASE SCORE
                </h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-mono text-5xl font-bold text-text-primary">
                    {queryResult.score}
                  </span>
                  <span className="text-xs text-text-muted">pts</span>
                </div>
              </div>
              <div className="mt-4 border-t border-[rgba(69,70,85,0.5)] pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Length</span>
                  <span className="font-mono text-sm text-text-primary">
                    {queryResult.length} letters
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">
                    Probability
                  </span>
                  <span className="font-mono text-sm text-accent-yellow">
                    {queryResult.probability}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Base Score Analysis */}
            <div className="md:hidden rounded border border-border-default bg-bg-secondary p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">
                  Base Score Analysis
                </span>
                <span className="font-mono text-sm text-accent-green">
                  {queryResult.score} PTS
                </span>
              </div>
            </div>
          </div>

          {/* Recent Checks */}
          <section className="pt-4">
            <h3 className="text-xl font-semibold text-text-primary">
              Recent Checks
            </h3>
            <div className="mt-4 flex flex-col gap-1">
              {recentChecks.map((check, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between rounded-sm border p-2 ${
                    check.valid
                      ? "border-border-subtle bg-bg-secondary"
                      : "border-accent-red-border bg-bg-secondary"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Status icon */}
                    {check.valid ? (
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <circle cx="8.5" cy="8.5" r="7" stroke="#43e179" strokeWidth="1.5" fill="rgba(67,225,121,0.1)" />
                        <path d="M5 8.5l3 3 4-4" stroke="#43e179" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <circle cx="8.5" cy="8.5" r="7" stroke="#ffb4ab" strokeWidth="1.5" fill="rgba(147,0,10,0.1)" />
                        <path d="M6 6l5 5M11 6L6 11" stroke="#ffb4ab" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}

                    {/* Word */}
                    <span
                      className={`font-mono text-sm font-medium uppercase tracking-[0.7px] ${
                        check.valid
                          ? "text-text-primary"
                          : "text-[rgba(224,227,231,0.7)] line-through"
                      }`}
                    >
                      {check.word}
                    </span>

                    {/* Type badge */}
                    <span
                      className={`rounded-sm px-2 py-1 text-[11px] font-bold tracking-[0.88px] ${
                        check.valid
                          ? "bg-bg-tile text-text-muted"
                          : "bg-accent-red-bg text-accent-red"
                      }`}
                    >
                      {check.valid ? check.type : "Not in Dictionary"}
                    </span>

                    {/* Mobile invalid badge */}
                    {!check.valid && (
                      <span className="rounded bg-[rgba(255,100,80,0.15)] px-2 py-0.5 text-[10px] font-bold uppercase text-[#ff6450] md:hidden">
                        Invalid
                      </span>
                    )}
                  </div>

                  {/* Points */}
                  <span
                    className={`font-mono text-[11px] tracking-[0.55px] ${
                      check.valid
                        ? "text-text-secondary"
                        : "text-[rgba(198,197,215,0.5)]"
                    }`}
                  >
                    {check.points !== null ? `${check.points} pts` : "-- pts"}
                  </span>
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
