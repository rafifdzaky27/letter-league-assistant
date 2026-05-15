"use client";

import { useState } from "react";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Tile from "@/components/Tile";
import { useAppStore } from "@/lib/store";

interface CheckResult {
  word: string;
  valid: boolean;
  score: number | null;
  length: number;
  probability: string;
  tiles: { letter: string; pts: number }[];
}

export default function DictionaryChecker() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [history, setHistory] = useState<CheckResult[]>([]);
  const [loading, setLoading] = useState(false);
  const recordCheck = useAppStore((s) => s.recordCheck);

  const handleCheck = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/check?word=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setResult(data);
      setHistory(prev => [data, ...prev].slice(0, 50));
      recordCheck();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 pb-24 md:p-8 md:pb-8">
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
              Dictionary Checker
            </h1>
            <p className="text-sm text-text-secondary md:text-base">
              Quickly verify words and check base scores.
            </p>
          </div>

          <section className="rounded border border-[rgba(69,70,85,0.4)] bg-bg-secondary p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21L16.65 16.65" />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                placeholder="ENTER WORD..."
                className="w-full border-b border-border-default bg-transparent py-4 pl-12 pr-12 font-mono text-xl font-bold uppercase tracking-wider text-text-primary placeholder:text-text-placeholder focus:border-accent-indigo focus:outline-none"
              />
              {query && (
                <button 
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-secondary hover:text-text-primary"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 1l10 10M11 1L1 11" />
                  </svg>
                </button>
              )}
            </div>
            <div className="mt-4 flex items-start gap-2 rounded border border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.1)] p-3">
              <svg className="mt-0.5 shrink-0 text-text-secondary" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="7" cy="7" r="6" />
                <path d="M7 4v3M7 10h.01" />
              </svg>
              <p className="text-[13px] leading-tight text-text-secondary">
                Checked against bundled dictionary v1.1. Results may vary from live game logic.
              </p>
            </div>
            <button 
              onClick={handleCheck}
              disabled={!query.trim() || loading}
              className="mt-4 w-full rounded bg-accent-indigo py-3 font-semibold text-white disabled:opacity-50 md:hidden"
            >
              {loading ? "Checking..." : "Check Word"}
            </button>
          </section>

          {result && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <section className={`flex flex-col items-center justify-center rounded border border-[rgba(69,70,85,0.4)] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)] md:col-span-2 ${
                result.valid ? 'bg-[rgba(67,225,121,0.02)]' : 'bg-[rgba(255,180,171,0.02)]'
              }`}>
                {result.valid ? (
                  <>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent-green text-accent-green">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-accent-green md:text-3xl">VALID WORD</h2>
                    <div className="mt-8 flex flex-wrap justify-center gap-1 md:gap-2">
                      {result.tiles.map((t, i) => (
                        <Tile key={i} letter={t.letter} points={t.pts} variant="default" size="lg" />
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent-red text-accent-red">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-accent-red md:text-3xl">INVALID WORD</h2>
                    <p className="mt-4 text-center text-text-secondary">
                      &quot;{result.word}&quot; was not found in the dictionary.
                    </p>
                  </>
                )}
              </section>

              {result.valid && (
                <section className="flex flex-col justify-between rounded border border-[rgba(69,70,85,0.4)] bg-bg-secondary p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">Base Score</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-text-primary">{result.score}</span>
                      <span className="text-sm text-text-secondary">pts</span>
                    </div>
                  </div>
                  <div className="mt-8 space-y-3 border-t border-border-subtle pt-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">Length</span>
                      <span className="font-mono text-sm font-bold text-text-primary">{result.length} letters</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">Probability</span>
                      <span className={`text-sm font-semibold ${
                        result.probability === 'Rare' ? 'text-accent-yellow' : 'text-accent-green'
                      }`}>{result.probability}</span>
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}

          <section>
            <h3 className="mb-4 text-lg font-semibold text-text-primary">Recent Checks</h3>
            <div className="divide-y divide-[rgba(69,70,85,0.1)] rounded border border-[rgba(69,70,85,0.4)] bg-bg-secondary">
              {history.length === 0 ? (
                <div className="p-6 text-center text-sm text-text-secondary">No recent checks</div>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 transition-colors hover:bg-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        item.valid ? 'border-accent-green text-accent-green' : 'border-accent-red text-accent-red'
                      }`}>
                        {item.valid ? (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <span className={`font-mono font-bold uppercase tracking-wider ${
                        item.valid ? 'text-text-primary' : 'text-text-secondary line-through'
                      }`}>
                        {item.word}
                      </span>
                      {!item.valid && (
                        <span className="rounded bg-[rgba(255,180,171,0.1)] px-2 py-0.5 text-[10px] font-bold text-accent-red">
                          Not in Dictionary
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-sm text-text-secondary">
                      {item.score !== null ? `${item.score} pts` : '-- pts'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
