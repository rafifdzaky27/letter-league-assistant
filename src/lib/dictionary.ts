import fs from 'fs';
import path from 'path';

let wordsCache: string[] | null = null;
let wordsSetCache: Set<string> | null = null;

export function getDictionary(): { words: string[], wordSet: Set<string> } {
  if (wordsCache && wordsSetCache) {
    return { words: wordsCache, wordSet: wordsSetCache };
  }

  const filePath = path.join(process.cwd(), 'src/data/wordlist.txt');
  let fileContent = '';
  
  try {
    fileContent = fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error("Could not load dictionary file:", error);
    return { words: [], wordSet: new Set() };
  }
  
  const words = fileContent
    .split('\n')
    .map(line => line.trim().replace(/"/g, '').toUpperCase())
    .filter(word => word.length > 0);

  wordsCache = words;
  wordsSetCache = new Set(words);

  return { words: wordsCache, wordSet: wordsSetCache };
}
