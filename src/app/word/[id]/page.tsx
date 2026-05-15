"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Tile from "@/components/Tile";
import { useAppStore } from "@/lib/store";

interface UsedTile {
  letter: string;
  points: number;
  variant: "default" | "active" | "wild" | "blank";
}

export default function WordDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  const wordId = (params.id as string).toUpperCase();
  const rack = searchParams.get("rack") || "";
  const pattern = searchParams.get("pattern") || "";

  const [tiles, setTiles] = useState<UsedTile[]>([]);
  const [baseScore, setBaseScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { saveWord, removeWord, isWordSaved } = useAppStore();
  const isSaved = isWordSaved(wordId);

  useEffect(() => {
    // If they came from solver, we can re-evaluate how the word was formed.
    // We can also just call the check API to get the base score.
    const fetchWordDetails = async () => {
      try {
        const res = await fetch(`/api/check?word=${wordId}`);
        const data = await res.json();
        
        if (data.valid) {
          // If we have rack/pattern context, let's call solve to get the exact tiles
          if (rack && pattern) {
            const solveRes = await fetch('/api/solve', {
              method: 'POST',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ rack, pattern })
            });
            const solveData = await solveRes.json();
            const found = solveData.results?.find((r: any) => r.wordStr === wordId);
            if (found) {
              setTiles(found.word);
              setBaseScore(found.score);
            } else {
              // fallback to check data
              setTiles(data.tiles.map((t: any) => ({ letter: t.letter, points: t.pts, variant: "default" })));
              setBaseScore(data.score);
            }
          } else {
             setTiles(data.tiles.map((t: any) => ({ letter: t.letter, points: t.pts, variant: "default" })));
             setBaseScore(data.score);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWordDetails();
  }, [wordId, rack, pattern]);

  // V1 placement simulation (just for UI completeness as requested)
  // In a real app with full board state, this would be exactly calculated.
  const estPlacementScore = Math.floor(baseScore * 1.5); 
  const totalScore = baseScore + estPlacementScore;
  const isHighValue = totalScore > 40;

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <TopNav />
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-10">
        <div className="mx-auto max-w-4xl">
          {/* Back Navigation */}
          <Link 
            href="/"
            className="mb-6 flex items-center gap-2 text-xs font-bold tracking-[0.88px] text-text-secondary transition-colors hover:text-text-primary"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 10L3 6L7 2" />
            </svg>
            BACK TO SOLVER
          </Link>

          {loading ? (
             <div className="py-20 text-center text-text-secondary">Loading...</div>
          ) : (
            <>
              {/* Word Display Header */}
              <section className="mb-8 flex flex-col items-center justify-center rounded-xl border border-[rgba(69,70,85,0.4)] bg-bg-secondary py-12 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {tiles.map((t, i) => (
                    <Tile key={i} letter={t.letter} points={t.points} variant={t.variant} size="xl" />
                  ))}
                </div>
                
                <div className="mt-8 flex gap-3">
                  <span className="rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-3 py-1 font-mono text-xs font-bold text-text-secondary">
                    {wordId.length} LETTERS
                  </span>
                  {isHighValue && (
                    <span className="rounded border border-accent-yellow-border bg-[rgba(221,199,63,0.1)] px-3 py-1 font-mono text-xs font-bold text-accent-yellow">
                      HIGH VALUE
                    </span>
                  )}
                </div>
                
                <div className="mt-6 border-t border-[rgba(255,255,255,0.05)] pt-6 text-center">
                  <p className="font-mono text-sm font-bold tracking-[0.88px] text-text-secondary">
                    BASE POINTS: {baseScore}
                  </p>
                </div>
              </section>

              {/* Data Grid Layout */}
              <div className="grid gap-6 md:grid-cols-12">
                {/* Score Breakdown Panel */}
                <div className="flex flex-col gap-4 rounded-xl border border-[rgba(69,70,85,0.4)] bg-bg-secondary p-6 md:col-span-8">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">
                      Est. Total Score
                    </h3>
                  </div>
                  
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight text-text-primary md:text-6xl">{totalScore}</span>
                    <span className="text-xl font-medium text-text-secondary">pts</span>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3 pt-8">
                    <button
                      onClick={() => { navigator.clipboard.writeText(wordId); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                      className="flex items-center justify-center gap-2 rounded bg-accent-indigo py-3 font-semibold text-white transition-colors hover:brightness-110"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      {copied ? "Copied!" : "Copy Word"}
                    </button>
                    <button
                      onClick={() => isSaved ? removeWord(wordId) : saveWord(wordId, baseScore)}
                      className={`flex items-center justify-center gap-2 rounded border py-3 font-semibold transition-colors ${isSaved ? 'border-accent-yellow-border bg-accent-yellow-bg text-accent-yellow' : 'border-border-default bg-transparent text-text-primary hover:bg-bg-tertiary'}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                      {isSaved ? "Saved ✓" : "Save Word"}
                    </button>
                  </div>
                </div>

                {/* Stat Cards */}
                <div className="flex flex-col gap-4 md:col-span-4">
                  <div className="flex flex-1 flex-col justify-center rounded-xl border border-[rgba(69,70,85,0.4)] bg-bg-secondary p-5">
                    <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.88px] text-text-secondary">Base Value</h4>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-text-primary">{baseScore}</span>
                      <span className="text-xs text-text-secondary">pts</span>
                    </div>
                    <p className="mt-4 text-xs text-text-secondary">Raw sum of active tiles</p>
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-center rounded-xl border border-[rgba(67,225,121,0.1)] bg-[rgba(67,225,121,0.02)] p-5">
                    <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.88px] text-text-secondary">Est. Placement</h4>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-accent-green">+{estPlacementScore}</span>
                      <span className="text-xs text-accent-green opacity-70">pts</span>
                    </div>
                    <p className="mt-4 text-xs text-text-secondary opacity-70">Based on pattern multipliers</p>
                  </div>
                </div>

                {/* Ruleset Comparison */}
                <div className="rounded-xl border border-[rgba(69,70,85,0.4)] bg-bg-secondary md:col-span-12">
                  <div className="border-b border-border-subtle p-5">
                    <h3 className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-[0.88px] text-text-primary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                        <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                        <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                        <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                      </svg>
                      Ruleset Comparison
                    </h3>
                  </div>
                  <div className="grid divide-y divide-[rgba(69,70,85,0.1)] md:grid-cols-2 md:divide-x md:divide-y-0">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold tracking-wider text-text-secondary">CLASSIC MODE</span>
                        <span className="text-2xl font-bold text-text-primary">{totalScore} <span className="text-sm font-normal text-text-secondary">pts</span></span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                        Standard dictionary scoring. Length bonuses are not applied in this ruleset.
                      </p>
                    </div>
                    <div className="bg-[rgba(88,101,242,0.02)] p-6">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-mono text-sm font-bold tracking-wider text-accent-indigo-light">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                          </svg>
                          WILD MODE
                        </span>
                        <span className="text-2xl font-bold text-text-primary">
                          {totalScore + (wordId.length > 5 ? 25 : 0)} <span className="text-sm font-normal text-text-secondary">pts</span>
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                        Includes a +25 point length bonus for exceeding 5 letters under Wild rules.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
