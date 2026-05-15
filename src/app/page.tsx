"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Tile from "@/components/Tile";
import { useAppStore } from "@/lib/store";

interface UsedTile {
  letter: string;
  points: number;
  variant: "default" | "active" | "wild" | "blank";
}

interface WordResult {
  wordStr: string;
  word: UsedTile[];
  score: number;
  length: number;
  selected?: boolean;
}

export default function SolverDashboard() {
  const router = useRouter();
  const recordSolve = useAppStore((s) => s.recordSolve);
  const [rack, setRack] = useState("");
  const [pattern, setPattern] = useState("");
  const [results, setResults] = useState<WordResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [solveMode, setSolveMode] = useState<string>("");

  const handleSolve = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rack, pattern }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to solve");
      
      const res_results = data.results || [];
      setResults(res_results);
      setTotalResults(data.total || 0);
      setSolveMode(data.mode || "");

      // Record stats
      if (res_results.length > 0) {
        recordSolve(
          data.total || res_results.length,
          res_results[0].score,
          res_results[0].wordStr
        );
      }
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWordClick = (wordStr: string) => {
    // Navigate to word detail page with the word and current rack context
    // For V1, we'll just pass the word. A robust app might pass the full state.
    router.push(`/word/${wordStr.toLowerCase()}?rack=${encodeURIComponent(rack)}&pattern=${encodeURIComponent(pattern)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col gap-2 overflow-y-auto border-r border-border-default bg-bg-secondary px-4 py-4 shadow-[1px_0_0_rgba(255,255,255,0.02)] md:flex">
          <div className="border-b border-border-subtle px-2 pb-4">
            <h2 className="text-xl font-semibold text-text-primary">Rack Editor</h2>
            <p className="text-sm text-text-secondary">Enter letters to solve</p>
          </div>
          <div className="mt-4 px-2">
            <input 
              type="text" 
              value={rack}
              onChange={(e) => setRack(e.target.value.toUpperCase())}
              placeholder="e.g. ARTIES*"
              className="w-full rounded border border-border-default bg-bg-input px-3 py-3 font-mono uppercase text-text-primary focus:border-accent-indigo focus:outline-none"
            />
            <p className="mt-2 text-xs text-text-muted">Use ? or * for blank tiles</p>
          </div>
          <div className="mt-auto border-t border-border-subtle pt-6">
            <button 
              onClick={() => { setRack(""); setPattern(""); setResults([]); }}
              className="flex w-full items-center justify-center gap-2 border border-border-default bg-transparent px-4 py-2 text-[11px] font-bold uppercase tracking-[0.88px] text-text-primary transition-colors hover:bg-bg-tile"
            >
              Clear Board
            </button>
          </div>
        </aside>

        <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 pb-24 md:p-8 md:pb-8">
          {/* Mobile Rack Editor */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">
                Current Rack
              </h2>
              <button 
                onClick={() => setRack("")}
                className="flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-[0.88px] text-text-secondary"
              >
                Clear
              </button>
            </div>
            <input 
              type="text" 
              value={rack}
              onChange={(e) => setRack(e.target.value.toUpperCase())}
              placeholder="e.g. ARTIES*"
              className="mt-3 w-full rounded border border-border-subtle bg-bg-secondary px-3 py-3 font-mono text-lg uppercase text-text-primary focus:border-accent-indigo focus:outline-none"
            />
          </div>

          {/* Board Pattern Input */}
          <section className="relative overflow-hidden rounded bg-bg-secondary border border-[rgba(69,70,85,0.5)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-xl bg-[rgba(88,101,242,0.05)] blur-[32px]" />
            <div className="relative flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text-primary">Board Pattern</h2>
              {solveMode && (
                <span className={`rounded-sm border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.88px] ${
                  solveMode === 'positional'
                    ? 'border-accent-indigo/30 bg-accent-indigo/10 text-accent-indigo-light'
                    : solveMode === 'available'
                    ? 'border-accent-green-border bg-accent-green-bg text-accent-green'
                    : solveMode === 'extension'
                    ? 'border-[#ff7b52]/30 bg-[#ff7b52]/10 text-[#ff7b52]'
                    : 'border-accent-yellow-border bg-accent-yellow-bg text-accent-yellow'
                }`}>
                  {solveMode === 'positional' ? 'Positional' : solveMode === 'available' ? 'Board Letters' : solveMode === 'extension' ? 'Extend Word' : 'Rack Only'}
                </span>
              )}
            </div>
            <div className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleSolve()}
                  placeholder="e.g. BGHTL or .E..R or -ENJOYS-"
                  className="w-full border-b-2 border-border-default bg-bg-input px-4 py-4 font-mono text-lg font-bold text-text-primary placeholder:text-text-placeholder focus:border-accent-indigo focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <p className="font-mono text-[11px] tracking-[0.55px] text-text-secondary">
                <span className="text-accent-green">BGHTL</span> — letters on the board to hook into
              </p>
              <p className="font-mono text-[11px] tracking-[0.55px] text-text-secondary">
                <span className="text-[#ff7b52]">-ENJOYS-</span> — build off a word already on the board
              </p>
              <p className="font-mono text-[11px] tracking-[0.55px] text-text-secondary">
                <span className="text-accent-indigo-light">.E..R</span> — positional pattern (dots = fill from rack)
              </p>
              <p className="font-mono text-[11px] tracking-[0.55px] text-text-secondary">
                <span className="text-accent-yellow">empty</span> — find all words from rack only
              </p>
            </div>
            {error && <p className="mt-2 text-sm text-accent-red">{error}</p>}
          </section>

          {/* Action & Filter Row */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button 
              onClick={handleSolve}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-sm bg-accent-indigo px-10 py-4 text-xl font-semibold text-white shadow-[0_0_7.5px_rgba(88,101,242,0.2)] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Solving..." : "Execute Solve"}
            </button>
            <div className="flex gap-2 overflow-x-auto">
              {/* Dummy filters for V1 UI */}
              <button className="flex shrink-0 items-center gap-1 rounded-sm border border-border-default bg-bg-secondary px-4 py-2 text-[11px] font-bold uppercase tracking-[0.88px] text-text-primary">
                Score (Desc)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between md:hidden">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">
              Top Plays ({totalResults})
            </span>
          </div>

          {/* Results Data Grid */}
          <section className="flex-1 overflow-hidden rounded border border-[rgba(69,70,85,0.4)] bg-bg-secondary shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="hidden border-b border-[rgba(69,70,85,0.5)] bg-bg-tertiary px-4 py-2 md:grid md:grid-cols-12 md:gap-1">
              <span className="col-span-6 text-[11px] font-bold tracking-[0.55px] text-text-secondary">Suggested Word ({totalResults} total)</span>
              <span className="col-span-2 text-right text-[11px] font-bold tracking-[0.55px] text-text-secondary">Est. Score</span>
              <span className="col-span-2 text-right text-[11px] font-bold tracking-[0.55px] text-text-secondary">Length</span>
              <span className="col-span-2 text-right text-[11px] font-bold tracking-[0.55px] text-text-secondary">Action</span>
            </div>

            <div className="divide-y divide-[rgba(69,70,85,0.1)]">
              {results.length === 0 && !loading && (
                <div className="p-8 text-center text-text-secondary">
                  {totalResults === 0 && pattern ? "No valid words found. Try adjusting your rack or pattern." : "Enter your rack and board pattern to generate words."}
                </div>
              )}
              
              {results.map((r, idx) => (
                <div
                  key={idx}
                  onClick={() => handleWordClick(r.wordStr)}
                  className="grid cursor-pointer grid-cols-12 items-center gap-1 px-4 py-1.5 transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                >
                  <div className="col-span-6 hidden gap-0.5 md:flex">
                    {r.word.map((t, ti) => (
                      <Tile key={ti} letter={t.letter} points={t.points} variant={t.variant} size="sm" />
                    ))}
                  </div>

                  <div className="col-span-8 md:hidden">
                    <span className="font-mono text-base font-bold uppercase tracking-wider text-text-primary">
                      {r.wordStr}
                    </span>
                    <span className="ml-2 text-xs text-text-secondary">
                      Len: {r.length}
                    </span>
                  </div>

                  <div className="col-span-2 flex justify-end md:col-span-2">
                    <span className="rounded-sm border border-accent-green-border bg-accent-green-bg px-2.5 py-0.5 font-mono text-sm font-medium text-accent-green shadow-[0_0_10px_rgba(67,225,121,0.1)]">
                      {r.score}
                    </span>
                  </div>

                  <span className="col-span-2 hidden text-right font-mono text-sm text-text-secondary md:block">
                    {r.length}
                  </span>

                  <div className="col-span-2 flex justify-end">
                    <button className="text-text-secondary hover:text-accent-indigo-light">
                      View
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
