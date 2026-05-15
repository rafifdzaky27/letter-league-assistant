import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---------- Saved Words ----------

export interface SavedWord {
  word: string;
  score: number;
  savedAt: number; // timestamp
}

// ---------- Stats ----------

export interface AppStats {
  totalSolves: number;
  totalChecks: number;
  wordsFound: number;
  highestScore: number;
  highestWord: string;
  lastSolveAt: number | null;
}

// ---------- Store ----------

interface AppState {
  // Theme
  theme: "dark" | "light";
  toggleTheme: () => void;

  // Game mode
  gameMode: "classic" | "wild";
  toggleGameMode: () => void;

  // Saved words
  savedWords: SavedWord[];
  saveWord: (word: string, score: number) => void;
  removeWord: (word: string) => void;
  isWordSaved: (word: string) => boolean;

  // Stats
  stats: AppStats;
  recordSolve: (wordsFound: number, topScore: number, topWord: string) => void;
  recordCheck: () => void;
  resetStats: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: "dark",
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

      // Game mode
      gameMode: "classic",
      toggleGameMode: () =>
        set((s) => ({
          gameMode: s.gameMode === "classic" ? "wild" : "classic",
        })),

      // Saved words
      savedWords: [],
      saveWord: (word, score) =>
        set((s) => {
          if (s.savedWords.some((w) => w.word === word)) return s;
          return {
            savedWords: [
              { word, score, savedAt: Date.now() },
              ...s.savedWords,
            ],
          };
        }),
      removeWord: (word) =>
        set((s) => ({
          savedWords: s.savedWords.filter((w) => w.word !== word),
        })),
      isWordSaved: (word) => get().savedWords.some((w) => w.word === word),

      // Stats
      stats: {
        totalSolves: 0,
        totalChecks: 0,
        wordsFound: 0,
        highestScore: 0,
        highestWord: "",
        lastSolveAt: null,
      },
      recordSolve: (wordsFound, topScore, topWord) =>
        set((s) => ({
          stats: {
            ...s.stats,
            totalSolves: s.stats.totalSolves + 1,
            wordsFound: s.stats.wordsFound + wordsFound,
            lastSolveAt: Date.now(),
            highestScore:
              topScore > s.stats.highestScore
                ? topScore
                : s.stats.highestScore,
            highestWord:
              topScore > s.stats.highestScore
                ? topWord
                : s.stats.highestWord,
          },
        })),
      recordCheck: () =>
        set((s) => ({
          stats: { ...s.stats, totalChecks: s.stats.totalChecks + 1 },
        })),
      resetStats: () =>
        set({
          stats: {
            totalSolves: 0,
            totalChecks: 0,
            wordsFound: 0,
            highestScore: 0,
            highestWord: "",
            lastSolveAt: null,
          },
        }),
    }),
    {
      name: "letter-league-store",
    }
  )
);
