import { NextResponse } from 'next/server';
import { getDictionary } from '@/lib/dictionary';
import { letterValues } from '@/lib/solver';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json({ error: 'Word is required' }, { status: 400 });
  }

  const query = word.toUpperCase().trim();
  const { wordSet } = getDictionary();

  const isValid = wordSet.has(query);
  
  // Calculate base score
  let score = 0;
  const tiles = [];
  for (const char of query) {
    const pts = letterValues[char] || 0;
    score += pts;
    tiles.push({ letter: char, pts });
  }

  // Determine probability just to match the UI aesthetic
  // For V1, we just do a rough mapping based on word length / score
  let probability = "Medium";
  if (query.length >= 7) probability = "Rare";
  else if (score > 15) probability = "Rare";
  else if (query.length <= 4) probability = "High";

  return NextResponse.json({
    word: query,
    valid: isValid,
    score: isValid ? score : null,
    length: query.length,
    probability,
    tiles
  });
}
