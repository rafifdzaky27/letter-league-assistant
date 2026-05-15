"use client";

import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAppStore } from "@/lib/store";

export default function StatsPage() {
  const { stats, resetStats, savedWords } = useAppStore();

  const statCards = [
    {
      label: "Total Solves",
      value: stats.totalSolves,
      sub: "solver executions",
      color: "text-accent-indigo-light",
      borderColor: "border-accent-indigo/20",
      bgColor: "bg-accent-indigo-bg",
    },
    {
      label: "Words Found",
      value: stats.wordsFound,
      sub: "candidates generated",
      color: "text-accent-green",
      borderColor: "border-accent-green-border",
      bgColor: "bg-accent-green-bg",
    },
    {
      label: "Dict Checks",
      value: stats.totalChecks,
      sub: "words validated",
      color: "text-accent-yellow",
      borderColor: "border-accent-yellow-border",
      bgColor: "bg-accent-yellow-bg",
    },
    {
      label: "Saved Words",
      value: savedWords.length,
      sub: "bookmarked",
      color: "text-text-primary",
      borderColor: "border-border-default",
      bgColor: "bg-bg-tertiary",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 pb-24 md:p-8 md:pb-8">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
                Stats
              </h1>
              <p className="text-sm text-text-secondary md:text-base">
                Your solving activity at a glance.
              </p>
            </div>
            <button
              onClick={resetStats}
              className="rounded border border-border-default px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:bg-accent-red-bg hover:text-accent-red"
            >
              Reset
            </button>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className={`flex flex-col rounded-xl border ${card.borderColor} ${card.bgColor} p-5`}
              >
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.88px] text-text-secondary">
                  {card.label}
                </span>
                <span className={`mt-2 text-4xl font-bold ${card.color}`}>
                  {card.value.toLocaleString()}
                </span>
                <span className="mt-1 text-xs text-text-muted">{card.sub}</span>
              </div>
            ))}
          </div>

          {/* Highest Score Card */}
          <section className="rounded-xl border border-border-subtle bg-bg-secondary p-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">
              Highest Scoring Word
            </h3>
            {stats.highestWord ? (
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-mono text-3xl font-bold uppercase tracking-wider text-accent-green">
                  {stats.highestWord}
                </span>
                <span className="text-2xl font-bold text-text-primary">
                  {stats.highestScore}
                  <span className="ml-1 text-sm font-normal text-text-secondary">pts</span>
                </span>
              </div>
            ) : (
              <p className="mt-4 text-sm text-text-muted">
                No solves recorded yet. Run the solver to start tracking!
              </p>
            )}
          </section>

          {/* Activity Summary */}
          <section className="rounded-xl border border-border-subtle bg-bg-secondary p-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">
              Activity
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Avg words per solve</span>
                <span className="font-mono text-sm font-bold text-text-primary">
                  {stats.totalSolves > 0
                    ? Math.round(stats.wordsFound / stats.totalSolves)
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Last solve</span>
                <span className="font-mono text-sm text-text-primary">
                  {stats.lastSolveAt
                    ? new Date(stats.lastSolveAt).toLocaleString()
                    : "Never"}
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
