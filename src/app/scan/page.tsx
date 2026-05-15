"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Tile from "@/components/Tile";
import { useAppStore } from "@/lib/store";
import { recognizeText, cleanRackText, terminateWorker } from "@/lib/ocr";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

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
}

type Stage = "upload" | "crop" | "processing" | "review" | "results";

export default function ScanPage() {
  const router = useRouter();
  const recordSolve = useAppStore((s) => s.recordSolve);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [stage, setStage] = useState<Stage>("upload");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  
  const [ocrRawText, setOcrRawText] = useState("");
  const [ocrConfidence, setOcrConfidence] = useState(0);
  
  const [rack, setRack] = useState("");
  const [pattern, setPattern] = useState("");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<WordResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRawOcr, setShowRawOcr] = useState(false);

  // ── Stage 1: Upload ──
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, etc.)");
      return;
    }
    setError("");
    
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result?.toString() || null);
      setStage("crop");
      // Default crop: a rough rectangle in the center-bottom
      setCrop({ unit: "%", width: 50, height: 15, x: 25, y: 70 });
    });
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) handleFileSelect(file);
          return;
        }
      }
    },
    [handleFileSelect]
  );

  // ── Stage 2: Extract Crop & Process ──
  const getCroppedImgDataUrl = (): string | null => {
    if (!completedCrop || !imgRef.current) return null;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return canvas.toDataURL("image/png");
  };

  const handleConfirmCrop = async () => {
    const croppedDataUrl = getCroppedImgDataUrl();
    if (!croppedDataUrl) {
      setError("Please select an area to crop first.");
      return;
    }

    setStage("processing");
    setProgress(10);
    setError("");

    try {
      // Simulate progress while OCR runs
      const progressTimer = setInterval(() => {
        setProgress((p) => Math.min(p + 8, 85));
      }, 300);

      const result = await recognizeText(croppedDataUrl);
      clearInterval(progressTimer);
      setProgress(100);

      setOcrRawText(result.text);
      setOcrConfidence(result.confidence);
      
      const extractedRack = cleanRackText(result.text);
      setRack(extractedRack);

      await new Promise((r) => setTimeout(r, 400));
      setStage("review");
    } catch (err: any) {
      setError("OCR failed: " + (err.message || "Unknown error"));
      setStage("crop");
    }
  };

  // ── Stage 3: Solve ──
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
      if (!res.ok) throw new Error(data.error);

      setResults(data.results || []);
      setTotalResults(data.total || 0);

      if (data.results?.length > 0) {
        recordSolve(
          data.total || data.results.length,
          data.results[0].score,
          data.results[0].wordStr
        );
      }

      setStage("results");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Reset ──
  const handleReset = () => {
    setStage("upload");
    setImageSrc(null);
    setCrop(undefined);
    setCompletedCrop(null);
    setOcrRawText("");
    setOcrConfidence(0);
    setShowRawOcr(false);
    setRack("");
    setPattern("");
    setResults([]);
    setTotalResults(0);
    setError("");
    setProgress(0);
    terminateWorker();
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary" onPaste={handlePaste}>
      <TopNav />
      <main className="flex flex-1 flex-col items-center overflow-y-auto px-4 pb-24 pt-8 md:px-8 md:pb-8">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-text-primary md:text-4xl">
              Screenshot Scanner
            </h1>
            <p className="mt-2 text-sm text-text-secondary md:text-base">
              Upload a screenshot and crop your rack for perfect OCR.
            </p>
            {/* Step indicator */}
            <div className="mx-auto mt-6 flex max-w-md items-center gap-2">
              {(["Upload", "Crop", "Review", "Results"] as const).map(
                (label, i) => {
                  const stageMap = { upload: 0, crop: 1, processing: 1, review: 2, results: 3 };
                  const stageIndex = stageMap[stage];
                  const isActive = i === stageIndex;
                  const isDone = i < stageIndex;
                  return (
                    <div key={label} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                          isActive
                            ? "border-accent-indigo bg-accent-indigo text-white"
                            : isDone
                            ? "border-accent-green bg-accent-green-bg text-accent-green"
                            : "border-border-default text-text-muted"
                        }`}
                      >
                        {isDone ? "✓" : i + 1}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        isActive ? "text-accent-indigo-light" : isDone ? "text-accent-green" : "text-text-muted"
                      }`}>
                        {label}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* ═══════ STAGE: UPLOAD ═══════ */}
          {stage === "upload" && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex flex-col items-center rounded-xl border-2 border-dashed border-border-default bg-bg-secondary p-12 transition-colors hover:border-accent-indigo md:p-20"
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-6 text-text-muted">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <h2 className="text-xl font-bold text-text-primary">Drop screenshot here</h2>
              <p className="mt-2 text-sm text-text-secondary">or paste from clipboard (Ctrl+V)</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-6 rounded bg-accent-indigo px-8 py-3 font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
              >
                Choose File
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }} />
              {error && <p className="mt-4 text-sm text-accent-red">{error}</p>}
            </div>
          )}

          {/* ═══════ STAGE: CROP ═══════ */}
          {stage === "crop" && imageSrc && (
            <div className="flex flex-col items-center rounded-xl border border-border-subtle bg-bg-secondary p-6">
              <p className="mb-4 text-sm font-semibold text-text-primary">
                Drag the box to select exactly your 7 rack letters.
              </p>
              <div className="overflow-hidden rounded-lg border border-border-default bg-bg-tertiary">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Crop area"
                    className="max-h-[60vh] w-auto object-contain"
                  />
                </ReactCrop>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-border-default bg-transparent px-6 py-3 font-semibold text-text-primary transition-colors hover:bg-bg-tertiary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCrop}
                  disabled={!completedCrop?.width || !completedCrop?.height}
                  className="rounded-lg bg-accent-indigo px-8 py-3 font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
                >
                  Confirm & Scan Rack
                </button>
              </div>
            </div>
          )}

          {/* ═══════ STAGE: PROCESSING ═══════ */}
          {stage === "processing" && (
            <div className="flex flex-col items-center rounded-xl border border-border-subtle bg-bg-secondary p-12">
              <div className="w-full max-w-sm">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-text-primary">Running OCR...</span>
                  <span className="font-mono text-accent-indigo-light">{progress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-tile">
                  <div
                    className="h-full rounded-full bg-accent-indigo transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-4 text-center text-xs text-text-secondary">
                  Analyzing cropped rack...
                </p>
              </div>
            </div>
          )}

          {/* ═══════ STAGE: REVIEW ═══════ */}
          {stage === "review" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-border-subtle bg-bg-secondary p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">
                      OCR Confidence
                    </h3>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className={`text-3xl font-bold ${ocrConfidence > 70 ? "text-accent-green" : "text-accent-red"}`}>
                        {ocrConfidence}%
                      </span>
                    </div>
                  </div>
                  {/* Show cropped preview if needed, or raw text toggle */}
                  <div className="flex-1 max-w-md w-full">
                    <button
                      onClick={() => setShowRawOcr(!showRawOcr)}
                      className="text-[11px] font-bold uppercase tracking-wider text-text-secondary underline hover:text-text-primary"
                    >
                      {showRawOcr ? "Hide Raw OCR Output" : "View Raw Output (Debug)"}
                    </button>
                    {showRawOcr && ocrRawText && (
                      <pre className="mt-2 w-full overflow-y-auto whitespace-pre-wrap rounded border border-border-subtle bg-bg-tertiary p-2 font-mono text-[10px] text-text-secondary">
                        {ocrRawText}
                      </pre>
                    )}
                  </div>
                </div>
              </div>

              {/* Editable fields */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-border-subtle bg-bg-secondary p-5">
                  <label className="font-mono text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">
                    Extracted Rack
                  </label>
                  <input
                    type="text"
                    value={rack}
                    onChange={(e) => setRack(e.target.value.toUpperCase())}
                    placeholder="e.g. ARTIES?"
                    className="mt-3 w-full rounded border border-border-default bg-bg-input px-4 py-3 font-mono text-lg font-bold uppercase tracking-wider text-text-primary focus:border-accent-indigo focus:outline-none"
                  />
                  <p className="mt-2 text-xs text-text-muted">Edit if OCR missed a letter.</p>
                </div>
                <div className="rounded-xl border border-border-subtle bg-bg-secondary p-5">
                  <label className="font-mono text-xs font-bold uppercase tracking-[0.88px] text-text-secondary">
                    Board Letters (Optional)
                  </label>
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value.toUpperCase())}
                    placeholder="e.g. BGHTL or .E..R"
                    className="mt-3 w-full rounded border border-border-default bg-bg-input px-4 py-3 font-mono text-lg font-bold uppercase tracking-wider text-text-primary focus:border-accent-indigo focus:outline-none"
                  />
                  <p className="mt-2 text-xs text-text-muted">Type board hooks manually here.</p>
                </div>
              </div>

              {error && <p className="text-center text-sm text-accent-red">{error}</p>}

              <div className="flex flex-col gap-3 md:flex-row">
                <button
                  onClick={handleSolve}
                  disabled={loading || (!rack && !pattern)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent-indigo py-4 text-lg font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Solving..." : "Confirm & Solve"}
                </button>
                <button onClick={handleReset} className="rounded-lg border border-border-default px-6 py-4 font-semibold text-text-primary hover:bg-bg-tertiary">
                  Start Over
                </button>
              </div>
            </div>
          )}

          {/* ═══════ STAGE: RESULTS ═══════ */}
          {stage === "results" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary">
                  Results <span className="text-sm font-normal text-text-secondary">({totalResults} words)</span>
                </h2>
                <button onClick={handleReset} className="rounded border border-border-default px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-tertiary">
                  New Scan
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded bg-bg-tertiary px-3 py-1 font-mono text-xs text-text-secondary">
                  Rack: <span className="font-bold text-text-primary">{rack}</span>
                </span>
                {pattern && (
                  <span className="rounded bg-bg-tertiary px-3 py-1 font-mono text-xs text-text-secondary">
                    Pattern: <span className="font-bold text-accent-green">{pattern}</span>
                  </span>
                )}
              </div>

              <section className="overflow-hidden rounded-xl border border-[rgba(69,70,85,0.4)] bg-bg-secondary">
                <div className="divide-y divide-border-faint">
                  {results.length === 0 ? (
                    <div className="p-8 text-center text-text-secondary">No words found.</div>
                  ) : (
                    results.map((r, idx) => (
                      <div
                        key={idx}
                        onClick={() => router.push(`/word/${r.wordStr.toLowerCase()}?rack=${encodeURIComponent(rack)}&pattern=${encodeURIComponent(pattern)}`)}
                        className="grid cursor-pointer grid-cols-12 items-center gap-1 px-4 py-3 transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                      >
                        <div className="col-span-8">
                          <span className="font-mono text-base font-bold uppercase tracking-wider text-text-primary">{r.wordStr}</span>
                        </div>
                        <div className="col-span-4 flex justify-end">
                          <span className="rounded-sm border border-accent-green-border bg-accent-green-bg px-2.5 py-0.5 font-mono text-sm font-medium text-accent-green">{r.score}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
