import { NextResponse } from "next/server";
import { getDictionary } from "@/lib/dictionary";
import {
  detectMode,
  solvePositional,
  solveAvailableLetters,
  solveRackOnly,
} from "@/lib/solver";

export async function POST(request: Request) {
  try {
    const { rack = "", pattern = "" } = await request.json();

    if (!rack.trim() && !pattern.trim()) {
      return NextResponse.json(
        { error: "Enter your rack letters to start solving." },
        { status: 400 }
      );
    }

    const { words } = getDictionary();
    const mode = detectMode(pattern);

    let results;
    switch (mode) {
      case "positional":
        results = solvePositional(words, rack, pattern);
        break;
      case "available":
        results = solveAvailableLetters(words, rack, pattern);
        break;
      case "rack-only":
        results = solveRackOnly(words, rack);
        break;
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      results: results.slice(0, 200),
      total: results.length,
      mode,
    });
  } catch (error) {
    console.error("Solver error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
