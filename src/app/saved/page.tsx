"use client";

import Link from "next/link";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAppStore } from "@/lib/store";
import { letterValues } from "@/lib/solver";

export default function SavedWordsPage() {
  const { savedWords, removeWord } = useAppStore();

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 pb-24 md:p-8 md:pb-8">
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
              Saved Words
            </h1>
            <p className="text-sm text-text-secondary md:text-base">
              Your bookmarked words for quick reference.
            </p>
          </div>

          {savedWords.length === 0 ? (
            <section className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-bg-secondary p-16 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 text-text-muted">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <h2 className="text-lg font-semibold text-text-secondary">
                No saved words yet
              </h2>
              <p className="mt-2 max-w-sm text-sm text-text-muted">
                Click the &quot;Save to Rack&quot; button on any word detail page to bookmark words here for later.
              </p>
              <Link
                href="/"
                className="mt-6 rounded bg-accent-indigo px-6 py-2 text-sm font-semibold text-white no-underline transition-colors hover:brightness-110"
              >
                Go to Solver
              </Link>
            </section>
          ) : (
            <section className="overflow-hidden rounded-xl border border-[rgba(69,70,85,0.4)] bg-bg-secondary">
              <div className="border-b border-border-subtle bg-bg-tertiary px-4 py-3">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">
                  {savedWords.length} saved word{savedWords.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="divide-y divide-border-faint">
                {savedWords.map((sw) => (
                  <div
                    key={sw.word}
                    className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                  >
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/word/${sw.word.toLowerCase()}`}
                        className="font-mono text-base font-bold uppercase tracking-wider text-text-primary no-underline hover:text-accent-indigo-light"
                      >
                        {sw.word}
                      </Link>
                      <span className="rounded-sm border border-accent-green-border bg-accent-green-bg px-2.5 py-0.5 font-mono text-sm font-medium text-accent-green">
                        {sw.score}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted">
                        {new Date(sw.savedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => removeWord(sw.word)}
                        className="rounded p-1 text-text-secondary transition-colors hover:bg-accent-red-bg hover:text-accent-red"
                        aria-label={`Remove ${sw.word}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
