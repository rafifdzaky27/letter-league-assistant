/**
 * OCR helper — runs Tesseract.js client-side.
 *
 * We do TWO passes on the uploaded screenshot:
 *   1. A tight crop around the rack area (bottom) → rack letters.
 *   2. The board area (middle) → visible letter fragments for pattern.
 *
 * Because Letter League screenshots vary, we do a single full-image
 * pass first, then attempt heuristic extraction from the raw text.
 */

import { createWorker, Worker, PSM } from "tesseract.js";

let workerInstance: Worker | null = null;

async function getWorker(): Promise<Worker> {
  if (!workerInstance) {
    workerInstance = await createWorker("eng");
    await workerInstance.setParameters({
      // We only want uppercase letters and wildcards
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ?*I",
      // SINGLE_LINE is best for a cropped rack
      tessedit_pageseg_mode: PSM.SINGLE_LINE,
    });
  }
  return workerInstance;
}

export async function terminateWorker() {
  if (workerInstance) {
    await workerInstance.terminate();
    workerInstance = null;
  }
}

// ---------- Main entry ----------

/**
 * Smart pre-processor for cropped rack images.
 * Downscales the image to blur out the tiny superscript point numbers,
 * then aggressively thresholds it so only the large, thick letters survive.
 */
async function preprocessCropForRack(imageSource: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Create a tiny canvas to destroy the small superscripts
      const TARGET_HEIGHT = 40; 
      const scale = TARGET_HEIGHT / img.height;
      const TARGET_WIDTH = Math.round(img.width * scale);

      const canvas = document.createElement("canvas");
      canvas.width = TARGET_WIDTH;
      canvas.height = TARGET_HEIGHT;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(imageSource);

      // Draw downscaled
      ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
      
      const imageData = ctx.getImageData(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
      const data = imageData.data;

      // Thresholding: keep only very bright pixels (the letters)
      // Turn background and blurred superscripts black.
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // If the pixel is mostly white/bright
        if (r > 160 && g > 160 && b > 160) {
          // Make it black for Tesseract (Tesseract prefers black text on white)
          data[i] = 0;
          data[i+1] = 0;
          data[i+2] = 0;
        } else {
          // Make background white
          data[i] = 255;
          data[i+1] = 255;
          data[i+2] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = imageSource;
  });
}

/**
 * Run OCR on a cropped image and return the raw text.
 * The UI is responsible for passing cleanly cropped images.
 */
export async function recognizeText(
  imageSource: string | File | Blob
): Promise<{ text: string; confidence: number }> {
  const worker = await getWorker();

  let src: string;
  if (typeof imageSource === "string") {
    src = imageSource;
  } else {
    src = await fileToDataUrl(imageSource);
  }

  // Apply our custom blur-and-threshold filter to kill point numbers
  const processedSrc = await preprocessCropForRack(src);

  const {
    data: { text, confidence },
  } = await worker.recognize(processedSrc);

  return { text, confidence: Math.round(confidence) };
}

/**
 * Clean up rack text extracted from the cropped image.
 * Removes non-alphanumeric and caps to 7 chars.
 */
export function cleanRackText(rawText: string): string {
  const cleaned = rawText.toUpperCase().replace(/[^A-Z?*]/g, "");
  return cleaned.substring(0, 7);
}

/**
 * Clean up board pattern text extracted from the cropped image.
 */
export function cleanPatternText(rawText: string): string {
  const boardLetters = new Set<string>();
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const words = line.split(/\s+/);
    for (const word of words) {
      const upperWord = word.toUpperCase();
      // Ignore Letter League multipliers (e.g. "2L", "3W")
      if (upperWord.includes("2L") || upperWord.includes("3L") || upperWord.includes("2W") || upperWord.includes("3W")) continue;

      const cleaned = upperWord.replace(/[^A-Z]/g, "");
      // Single or double letters on the board
      if (cleaned.length >= 1 && cleaned.length <= 3) {
        for (const ch of cleaned) {
          boardLetters.add(ch);
        }
      }
    }
  }

  return Array.from(boardLetters).join("");
}

// ---------- Utility ----------

function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
