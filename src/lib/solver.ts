// Letter League tile values
export const letterValues: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
  K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1,
  U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
};

export interface UsedTile {
  letter: string;
  points: number;
  variant: "default" | "active" | "wild" | "blank";
}

export interface WordResult {
  wordStr: string;
  word: UsedTile[];
  score: number;
  length: number;
}

// ---------- helpers ----------

function parseRack(rack: string) {
  const chars = rack.toUpperCase().split("").filter((c) => /[A-Z?*]/.test(c));
  const letters = chars.filter((c) => c !== "?" && c !== "*");
  const blanks = chars.filter((c) => c === "?" || c === "*").length;
  return { letters, blanks };
}

function letterCounts(arr: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const c of arr) m.set(c, (m.get(c) || 0) + 1);
  return m;
}

// ---------- MODE 1: Positional pattern ----------
// Pattern like ".E..R" — dots are positions to fill from rack,
// letters are already on the board at those exact positions.

export function solvePositional(
  words: string[],
  rack: string,
  pattern: string
): WordResult[] {
  const upper = pattern.toUpperCase();
  // Build regex: each char → itself if letter, '.' stays as wildcard
  const regexStr =
    "^" +
    upper
      .split("")
      .map((ch) => (/[A-Z]/.test(ch) ? ch : "."))
      .join("") +
    "$";
  const regex = new RegExp(regexStr);

  const { letters: rackLetters, blanks } = parseRack(rack);
  const results: WordResult[] = [];

  for (const word of words) {
    if (word.length !== upper.length) continue;
    if (!regex.test(word)) continue;

    // Try to fill dot-positions from rack
    const availRack = [...rackLetters];
    let blanksLeft = blanks;
    const tiles: UsedTile[] = [];
    let ok = true;

    for (let i = 0; i < word.length; i++) {
      const ch = word[i];

      if (/[A-Z]/.test(upper[i])) {
        // Board letter — already placed, the player doesn't spend rack tiles
        tiles.push({
          letter: ch,
          points: letterValues[ch] || 0,
          variant: "default",
        });
      } else {
        // Dot position — must come from rack
        const ri = availRack.indexOf(ch);
        if (ri !== -1) {
          availRack.splice(ri, 1);
          tiles.push({
            letter: ch,
            points: letterValues[ch] || 0,
            variant: "active",
          });
        } else if (blanksLeft > 0) {
          blanksLeft--;
          tiles.push({ letter: ch, points: 0, variant: "blank" });
        } else {
          ok = false;
          break;
        }
      }
    }

    if (!ok) continue;

    results.push({
      wordStr: word,
      word: tiles,
      score: tiles.reduce((s, t) => s + t.points, 0),
      length: word.length,
    });
  }

  return results;
}

// ---------- MODE 2: Available board letters ----------
// User lists letters visible on the board (e.g. "BGHTL").
// Find words formable from rack + any subset of those board letters.
// The word must use ≥1 rack letter (you must play something)
// and ≥1 board letter (you must connect to the board).

export function solveAvailableLetters(
  words: string[],
  rack: string,
  boardLetters: string
): WordResult[] {
  const { letters: rackLetters, blanks } = parseRack(rack);
  const boardChars = boardLetters
    .toUpperCase()
    .split("")
    .filter((c) => /[A-Z]/.test(c));

  const poolCounts = letterCounts([...rackLetters, ...boardChars]);
  const totalPool = rackLetters.length + boardChars.length + blanks;
  const hasBoardChars = boardChars.length > 0;

  const results: WordResult[] = [];

  for (const word of words) {
    if (word.length > totalPool) continue;
    if (word.length < 2) continue;

    // Quick reject: check letter counts against pool
    const wc = letterCounts(word.split(""));
    let blanksNeeded = 0;
    let possible = true;
    for (const [ch, need] of wc) {
      const have = poolCounts.get(ch) || 0;
      if (need > have) {
        blanksNeeded += need - have;
        if (blanksNeeded > blanks) {
          possible = false;
          break;
        }
      }
    }
    if (!possible) continue;

    // Detailed tile assignment
    const availRack = [...rackLetters];
    const availBoard = [...boardChars];
    let blanksLeft = blanks;
    const tiles: UsedTile[] = [];
    let usedBoard = false;
    let usedRack = false;
    let ok = true;

    for (const ch of word) {
      // Prefer board letters first (the player wants to maximise rack usage)
      const bi = availBoard.indexOf(ch);
      if (bi !== -1) {
        availBoard.splice(bi, 1);
        tiles.push({
          letter: ch,
          points: letterValues[ch] || 0,
          variant: "default",
        });
        usedBoard = true;
        continue;
      }
      const ri = availRack.indexOf(ch);
      if (ri !== -1) {
        availRack.splice(ri, 1);
        tiles.push({
          letter: ch,
          points: letterValues[ch] || 0,
          variant: "active",
        });
        usedRack = true;
        continue;
      }
      if (blanksLeft > 0) {
        blanksLeft--;
        tiles.push({ letter: ch, points: 0, variant: "blank" });
        usedRack = true;
        continue;
      }
      ok = false;
      break;
    }
    if (!ok) continue;
    if (hasBoardChars && !usedBoard) continue; // must connect to board
    if (!usedRack) continue; // must play from rack

    results.push({
      wordStr: word,
      word: tiles,
      score: tiles.reduce((s, t) => s + t.points, 0),
      length: word.length,
    });
  }

  return results;
}

// ---------- MODE 3: Rack-only anagrams ----------
// No pattern — find all words the player can spell from their rack alone.

export function solveRackOnly(
  words: string[],
  rack: string
): WordResult[] {
  const { letters: rackLetters, blanks } = parseRack(rack);
  const poolCounts = letterCounts(rackLetters);
  const totalPool = rackLetters.length + blanks;

  const results: WordResult[] = [];

  for (const word of words) {
    if (word.length > totalPool) continue;
    if (word.length < 2) continue;

    const wc = letterCounts(word.split(""));
    let blanksNeeded = 0;
    let possible = true;
    for (const [ch, need] of wc) {
      const have = poolCounts.get(ch) || 0;
      if (need > have) {
        blanksNeeded += need - have;
        if (blanksNeeded > blanks) {
          possible = false;
          break;
        }
      }
    }
    if (!possible) continue;

    // Build tiles
    const avail = [...rackLetters];
    let blanksLeft = blanks;
    const tiles: UsedTile[] = [];
    let ok = true;

    for (const ch of word) {
      const ri = avail.indexOf(ch);
      if (ri !== -1) {
        avail.splice(ri, 1);
        tiles.push({
          letter: ch,
          points: letterValues[ch] || 0,
          variant: "active",
        });
      } else if (blanksLeft > 0) {
        blanksLeft--;
        tiles.push({ letter: ch, points: 0, variant: "blank" });
      } else {
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    results.push({
      wordStr: word,
      word: tiles,
      score: tiles.reduce((s, t) => s + t.points, 0),
      length: word.length,
    });
  }

  return results;
}

// ---------- Public entry ----------

export function calculateScore(tiles: UsedTile[]): number {
  return tiles.reduce((sum, tile) => sum + tile.points, 0);
}

/**
 * Detect which solver mode to use based on the pattern string.
 *  - Contains '.' → positional pattern (`.E..R`)
 *  - Only letters   → available-board-letters mode (`BGHTL`)
 *  - Empty          → rack-only anagram mode
 */
export function detectMode(pattern: string): "positional" | "available" | "rack-only" {
  const trimmed = pattern.trim();
  if (!trimmed) return "rack-only";
  if (trimmed.includes(".")) return "positional";
  return "available";
}
