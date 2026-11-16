"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { triggerFullScreenConfetti } from "@/utils/confettiHelper";
import { soundFx } from "@/utils/audioHelper";
import { RotateCcw, CheckCircle2, Volume2, Sparkles, RefreshCcw } from "lucide-react";

interface TouchTracingCanvasProps {
  character: string;
  guideHint?: string;
  soundPrompt?: string;
  onComplete?: () => void;
}

const BRUSH_COLORS = [
  { name: "Indigo", value: "#4F46E5" },
  { name: "Emerald", value: "#10B981" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Purple", value: "#8B5CF6" },
];

export default function TouchTracingCanvas({
  character,
  guideHint = "Trace along the guide lines with your finger or mouse!",
  soundPrompt,
  onComplete,
}: TouchTracingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState(BRUSH_COLORS[0].value);
  const [coveragePercent, setCoveragePercent] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  // Checkpoints along the letter to verify actual tracing
  const letterCheckpoints = useRef<{ x: number; y: number; hit: boolean }[]>([]);

  // Initialize and generate letter checkpoints
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = Math.max(rect.width, 320);
    const height = Math.max(rect.height, 260);

    canvas.width = width;
    canvas.height = height;

    // Create or resize mask canvas
    if (!maskCanvasRef.current) {
      maskCanvasRef.current = document.createElement("canvas");
    }
    const mask = maskCanvasRef.current;
    mask.width = width;
    mask.height = height;

    const mCtx = mask.getContext("2d", { willReadFrequently: true });
    if (!mCtx) return;

    // Draw solid letter on mask to sample checkpoints
    mCtx.clearRect(0, 0, width, height);
    const fontSize = Math.round(height * 0.62);
    mCtx.font = `900 ${fontSize}px "Fredoka", "Nunito", sans-serif`;
    mCtx.textAlign = "center";
    mCtx.textBaseline = "middle";
    mCtx.fillStyle = "#000000";
    mCtx.fillText(character, width / 2, height * 0.52);

    // Extract checkpoints from the solid letter image
    const imgData = mCtx.getImageData(0, 0, width, height).data;
    const sampledPoints: { x: number; y: number; hit: boolean }[] = [];
    const step = 14; // sample grid every 14 pixels

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        if (imgData[index + 3] > 120) {
          sampledPoints.push({ x, y, hit: false });
        }
      }
    }

    letterCheckpoints.current = sampledPoints;
    setCoveragePercent(0);
    setHasCompleted(false);
    setValidationMsg(null);

    // Draw visible guides on the main canvas
    drawGuide(width, height);
  }, [character]);

  useEffect(() => {
    setupCanvas();
    const handleResize = () => setupCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setupCanvas]);

  const drawGuide = (width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Lined writing guides
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    // Top rule line
    ctx.beginPath();
    ctx.moveTo(25, height * 0.22);
    ctx.lineTo(width - 25, height * 0.22);
    ctx.stroke();

    // Midline rule (dashed blue/slate)
    ctx.strokeStyle = "#94A3B8";
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(25, height * 0.52);
    ctx.lineTo(width - 25, height * 0.52);
    ctx.stroke();

    // Baseline rule
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(25, height * 0.82);
    ctx.lineTo(width - 25, height * 0.82);
    ctx.stroke();

    // Semi-transparent target letter fill
    const fontSize = Math.round(height * 0.62);
    ctx.font = `900 ${fontSize}px "Fredoka", "Nunito", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
    ctx.fillText(character, width / 2, height * 0.52);

    // Dashed guidance border along the letter
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.strokeText(character, width / 2, height * 0.52);
    ctx.setLineDash([]);

    // Green Starting Indicator Dot
    if (letterCheckpoints.current.length > 0) {
      // Find top-leftmost point of the letter
      let startPt = letterCheckpoints.current[0];
      for (const pt of letterCheckpoints.current) {
        if (pt.y < startPt.y || (pt.y === startPt.y && pt.x < startPt.x)) {
          startPt = pt;
        }
      }

      ctx.fillStyle = "#10B981";
      ctx.beginPath();
      ctx.arc(startPt.x, startPt.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#065F46";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("START", startPt.x, startPt.y - 14);
    }
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const checkTracingHits = (x: number, y: number) => {
    const radius = 26; // generous touch margin for foundation phase kids
    let updated = false;

    for (const pt of letterCheckpoints.current) {
      if (!pt.hit) {
        const dist = Math.hypot(pt.x - x, pt.y - y);
        if (dist <= radius) {
          pt.hit = true;
          updated = true;
        }
      }
    }

    if (updated) {
      const hitCount = letterCheckpoints.current.filter((p) => p.hit).length;
      const total = letterCheckpoints.current.length;
      const pct = total > 0 ? Math.round((hitCount / total) * 100) : 0;
      setCoveragePercent(pct);
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e) {
      e.stopPropagation();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 20;
    ctx.strokeStyle = brushColor;
    setIsDrawing(true);
    setValidationMsg(null);

    checkTracingHits(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    if ("touches" in e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();

    checkTracingHits(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    soundFx.playRetryBoing();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setupCanvas();
  };

  const handleHearSound = () => {
    soundFx.speakPhoneme(character);
  };

  const handleVerifyTracing = () => {
    // Require at least 38% coverage along the letter path so random clicks outside are rejected!
    if (coveragePercent < 38) {
      soundFx.playRetryBoing();
      soundFx.speakText("Trace right on top of the letter to fill your star meter!");
      setValidationMsg(`Keep tracing! You've covered ${coveragePercent}%. Trace all the way along the letter!`);
      return;
    }

    soundFx.playSuccessChime();
    soundFx.playHooray();
    triggerFullScreenConfetti();
    setHasCompleted(true);
    setValidationMsg("Wonderful handwriting! You traced the letter beautifully! ⭐");
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Top Controls Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <button
          onClick={handleHearSound}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-950 hover:bg-amber-200 font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm"
        >
          <Volume2 className="w-4 h-4 text-amber-800" />
          <span>Hear Sound</span>
        </button>

        {/* Brush Colors */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {BRUSH_COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => setBrushColor(c.value)}
              className={`w-7 h-7 rounded-xl transition-all transform ${
                brushColor === c.value ? "scale-115 ring-3 ring-slate-900 shadow-md" : "hover:scale-105 opacity-80"
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
          title="Clear and Try Again"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Tracing Coverage Progress Meter */}
      <div className="w-full mb-3 px-2 flex items-center justify-between gap-3">
        <div className="flex-1 bg-slate-200 rounded-full h-3.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-200 rounded-full ${
              coveragePercent >= 38 ? "bg-emerald-500" : "bg-indigo-600"
            }`}
            style={{ width: `${Math.min(coveragePercent, 100)}%` }}
          />
        </div>
        <span className="text-xs font-black text-slate-700 whitespace-nowrap">
          {coveragePercent}% Covered {coveragePercent >= 38 ? "⭐" : ""}
        </span>
      </div>

      {/* Tracing Canvas Container */}
      <div className="relative w-full aspect-4/3 max-h-[360px] bg-white rounded-3xl border-4 border-dashed border-indigo-300 shadow-xl overflow-hidden touch-none select-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair block"
        />

        {coveragePercent === 0 && (
          <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/75 text-white text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Start at the green dot and trace along the shape!
            </span>
          </div>
        )}
      </div>

      {/* Validation / Retry Feedback */}
      {validationMsg && (
        <div
          className={`w-full mt-3 p-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 ${
            hasCompleted
              ? "bg-emerald-50 border border-emerald-300 text-emerald-900"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          {hasCompleted ? (
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <RefreshCcw className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{validationMsg}</span>
        </div>
      )}

      {/* Bottom Completion Action */}
      <div className="w-full mt-4 flex justify-center">
        <button
          onClick={handleVerifyTracing}
          className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg flex items-center gap-2.5 transition-all transform active:scale-95 ${
            hasCompleted
              ? "bg-emerald-600 text-white ring-4 ring-emerald-200 cursor-default"
              : coveragePercent >= 38
              ? "bg-emerald-600 hover:bg-emerald-700 text-white animate-bounce-short"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{hasCompleted ? "Tracing Mastered! ⭐" : "Check My Tracing"}</span>
        </button>
      </div>
    </div>
  );
}
