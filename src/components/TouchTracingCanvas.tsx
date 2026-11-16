"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { triggerFullScreenConfetti } from "@/utils/confettiHelper";
import { soundFx } from "@/utils/audioHelper";
import { RotateCcw, CheckCircle2, Volume2, Sparkles, AlertCircle } from "lucide-react";

interface TouchTracingCanvasProps {
  character: string;
  guideHint?: string;
  onComplete?: () => void;
}

interface Point {
  x: number;
  y: number;
}

// Normalized reference strokes for specific Foundation Phase characters [x, y] in [0, 1]
// Designed to capture the true anatomical curvature of each letter
const LETTER_STROKE_TEMPLATES: Record<string, Point[]> = {
  // Letter 's': Smooth continuous S-curve (11 sequential checkpoints)
  s: [
    { x: 0.68, y: 0.28 }, // Start top-right loop
    { x: 0.52, y: 0.22 }, // Top apex curve
    { x: 0.35, y: 0.26 }, // Top-left curve
    { x: 0.30, y: 0.36 }, // Left upper shoulder
    { x: 0.40, y: 0.47 }, // Slanting down-right to center
    { x: 0.50, y: 0.53 }, // Crossing dead center
    { x: 0.63, y: 0.59 }, // Moving down-right into bottom loop
    { x: 0.70, y: 0.69 }, // Right lower belly
    { x: 0.62, y: 0.79 }, // Bottom right curve
    { x: 0.45, y: 0.81 }, // Bottom apex
    { x: 0.30, y: 0.74 }, // Bottom tail hook left
  ],
  // Uppercase 'A': Three distinct strokes (Left diagonal, Right diagonal, Crossbar)
  A: [
    // Left diagonal: Apex to bottom left
    { x: 0.50, y: 0.20 },
    { x: 0.42, y: 0.40 },
    { x: 0.34, y: 0.60 },
    { x: 0.26, y: 0.80 },
    // Right diagonal: Apex to bottom right
    { x: 0.58, y: 0.40 },
    { x: 0.66, y: 0.60 },
    { x: 0.74, y: 0.80 },
    // Crossbar
    { x: 0.38, y: 0.56 },
    { x: 0.50, y: 0.56 },
    { x: 0.62, y: 0.56 },
  ],
};

const BRUSH_COLORS = [
  { name: "Indigo", value: "#4F46E5" },
  { name: "Emerald", value: "#10B981" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Purple", value: "#8B5CF6" },
];

export default function TouchTracingCanvas({
  character,
  guideHint = "Trace along the shape of the letter from start to finish!",
  onComplete,
}: TouchTracingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState(BRUSH_COLORS[0].value);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  const [validationMsg, setValidationMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Scaled letter checkpoints in canvas pixel space
  const scaledCheckpoints = useRef<{ x: number; y: number; hit: boolean }[]>([]);
  // User drawn stroke points
  const userStrokes = useRef<Point[]>([]);

  // Calculate checkpoints matching current canvas dimensions
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = Math.max(rect.width, 320);
    const height = Math.max(rect.height, 280);

    canvas.width = width;
    canvas.height = height;

    // Use predefined template or sample from rendered character
    const template = LETTER_STROKE_TEMPLATES[character];
    if (template) {
      scaledCheckpoints.current = template.map((pt) => ({
        x: pt.x * width,
        y: pt.y * height,
        hit: false,
      }));
    } else {
      // Dynamic fallback for any letter
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const oCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (oCtx) {
        oCtx.font = `900 ${Math.round(height * 0.62)}px "Fredoka", "Nunito", sans-serif`;
        oCtx.textAlign = "center";
        oCtx.textBaseline = "middle";
        oCtx.fillText(character, width / 2, height * 0.52);
        const data = oCtx.getImageData(0, 0, width, height).data;

        const pts: { x: number; y: number; hit: boolean }[] = [];
        const step = 16;
        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            if (data[(y * width + x) * 4 + 3] > 120) {
              pts.push({ x, y, hit: false });
            }
          }
        }
        scaledCheckpoints.current = pts;
      }
    }

    userStrokes.current = [];
    setMatchScore(0);
    setHasCompleted(false);
    setValidationMsg(null);

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

    // Rule lines
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(20, height * 0.22);
    ctx.lineTo(width - 20, height * 0.22);
    ctx.stroke();

    ctx.strokeStyle = "#94A3B8";
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(20, height * 0.52);
    ctx.lineTo(width - 20, height * 0.52);
    ctx.stroke();

    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(20, height * 0.82);
    ctx.lineTo(width - 20, height * 0.82);
    ctx.stroke();

    // Large watermarked character fill
    const fontSize = Math.round(height * 0.65);
    ctx.font = `900 ${fontSize}px "Fredoka", "Nunito", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "rgba(241, 245, 249, 0.95)";
    ctx.fillText(character, width / 2, height * 0.52);

    // Dashed guidance outline
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 6]);
    ctx.strokeText(character, width / 2, height * 0.52);
    ctx.setLineDash([]);

    // Draw guidance path dots
    const pts = scaledCheckpoints.current;
    if (pts.length > 0) {
      pts.forEach((pt, idx) => {
        const isStart = idx === 0;
        const isEnd = idx === pts.length - 1;

        ctx.fillStyle = isStart ? "#10B981" : isEnd ? "#EF4444" : "rgba(148, 163, 184, 0.4)";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isStart || isEnd ? 9 : 4, 0, Math.PI * 2);
        ctx.fill();

        if (isStart) {
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = "#065F46";
          ctx.font = "bold 11px sans-serif";
          ctx.fillText("START", pt.x, pt.y - 14);
        }
      });
    }
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent): Point => {
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

  const processStrokePoint = (p: Point) => {
    userStrokes.current.push(p);

    // Check hit on checkpoints with strict tolerance (16px)
    const hitRadius = 18;
    let anyHit = false;

    scaledCheckpoints.current.forEach((cp) => {
      if (!cp.hit) {
        const dist = Math.hypot(cp.x - p.x, cp.y - p.y);
        if (dist <= hitRadius) {
          cp.hit = true;
          anyHit = true;
        }
      }
    });

    // Update real-time score
    const total = scaledCheckpoints.current.length;
    const hits = scaledCheckpoints.current.filter((c) => c.hit).length;
    const score = total > 0 ? Math.round((hits / total) * 100) : 0;
    setMatchScore(score);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e) {
      e.stopPropagation();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 20;
    ctx.strokeStyle = brushColor;
    setIsDrawing(true);
    setValidationMsg(null);

    processStrokePoint(p);
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

    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    processStrokePoint(p);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    soundFx.playRetryBoing();
    setupCanvas();
  };

  const handleHearSound = () => {
    soundFx.speakPhoneme(character);
  };

  // Rigorous verification that specifically catches straight lines / false shapes like "T"
  const handleVerifyTracing = () => {
    const strokes = userStrokes.current;
    if (strokes.length < 10) {
      soundFx.playRetryBoing();
      soundFx.speakText("Trace the shape with your finger first!");
      setValidationMsg({ type: "error", text: "Trace along the shape of the letter first!" });
      return;
    }

    const cps = scaledCheckpoints.current;
    const totalCheckpoints = cps.length;
    const hits = cps.filter((c) => c.hit).length;
    const coverage = totalCheckpoints > 0 ? (hits / totalCheckpoints) * 100 : 0;

    // 1. OUT-OF-BOUNDS DETECTION (Catches horizontal bar of "T", etc.)
    // Calculate average distance from user stroke points to nearest checkpoint on the letter
    let totalDist = 0;
    let outOfBoundsCount = 0;

    for (const sp of strokes) {
      let minDist = Infinity;
      for (const cp of cps) {
        const d = Math.hypot(sp.x - cp.x, sp.y - cp.y);
        if (d < minDist) minDist = d;
      }
      totalDist += minDist;
      if (minDist > 25) {
        outOfBoundsCount++;
      }
    }

    const avgDistance = totalDist / strokes.length;
    const outOfBoundsRatio = outOfBoundsCount / strokes.length;

    // If more than 35% of user's strokes are drawn far away from the letter path (like a horizontal crossbar):
    if (outOfBoundsRatio > 0.35 || avgDistance > 24) {
      soundFx.playRetryBoing();
      soundFx.speakText("Stay right on top of the letter curves! Do not draw straight lines.");
      setValidationMsg({
        type: "error",
        text: "You drew lines outside the letter! Follow the curved shape of the 's'.",
      });
      return;
    }

    // 2. CURVE COMPLETION DETECTION (Checks top loop, middle slant, and bottom loop)
    // For letter 's', checkpoints are ordered from top to bottom
    const third = Math.floor(cps.length / 3);
    const topZone = cps.slice(0, third);
    const midZone = cps.slice(third, third * 2);
    const botZone = cps.slice(third * 2);

    const topHitRate = topZone.filter((c) => c.hit).length / topZone.length;
    const midHitRate = midZone.filter((c) => c.hit).length / midZone.length;
    const botHitRate = botZone.filter((c) => c.hit).length / botZone.length;

    if (topHitRate < 0.65) {
      soundFx.playRetryBoing();
      soundFx.speakText("Trace the top curve starting at the green dot!");
      setValidationMsg({
        type: "error",
        text: "You missed the top curve! Start at the green dot and follow the curve.",
      });
      return;
    }

    if (midHitRate < 0.65) {
      soundFx.playRetryBoing();
      soundFx.speakText("Follow the curve through the middle!");
      setValidationMsg({
        type: "error",
        text: "Follow the S-curve through the middle!",
      });
      return;
    }

    if (botHitRate < 0.65) {
      soundFx.playRetryBoing();
      soundFx.speakText("Trace the bottom curve all the way to the end!");
      setValidationMsg({
        type: "error",
        text: "You missed the bottom curve! Trace all the way around to the red dot.",
      });
      return;
    }

    // 3. OVERALL SHAPE MATCH THRESHOLD (Must reach at least 75% coverage along the real path)
    if (coverage < 75) {
      soundFx.playRetryBoing();
      soundFx.speakText("Keep tracing to complete the shape!");
      setValidationMsg({
        type: "error",
        text: `Shape match is only ${Math.round(coverage)}%. Trace the full curves to reach at least 75%!`,
      });
      return;
    }

    // Passed All Rigorous Checks!
    soundFx.playSuccessChime();
    soundFx.playHooray();
    triggerFullScreenConfetti();
    setHasCompleted(true);
    setValidationMsg({
      type: "success",
      text: "Outstanding! You traced the authentic letter shape beautifully! ⭐",
    });
    if (onComplete) {
      onComplete();
    }
  };

  const isShapeEligible = matchScore >= 75;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Top Controls Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <button
          onClick={handleHearSound}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-950 hover:bg-amber-200 font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-amber-800" />
          <span>Hear Letter Sound</span>
        </button>

        {/* Brush Colors */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {BRUSH_COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => setBrushColor(c.value)}
              className={`w-7 h-7 rounded-xl transition-all transform cursor-pointer ${
                brushColor === c.value ? "scale-115 ring-3 ring-slate-900 shadow-md" : "hover:scale-105 opacity-80"
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
          title="Clear and Try Again"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Real-time Shape Match Meter */}
      <div className="w-full mb-3 px-2 flex items-center justify-between gap-3">
        <div className="flex-1 bg-slate-200 rounded-full h-3.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-200 rounded-full ${
              isShapeEligible ? "bg-emerald-500" : "bg-indigo-600"
            }`}
            style={{ width: `${Math.min(matchScore, 100)}%` }}
          />
        </div>
        <span className="text-xs font-black text-slate-700 whitespace-nowrap">
          Shape Match: {matchScore}% {isShapeEligible ? "⭐" : "(Need 75%)"}
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

        {matchScore === 0 && (
          <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {guideHint}
            </span>
          </div>
        )}
      </div>

      {/* Validation Feedback Banner */}
      {validationMsg && (
        <div
          className={`w-full mt-3 p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            validationMsg.type === "success"
              ? "bg-emerald-50 border border-emerald-300 text-emerald-900"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          {validationMsg.type === "success" ? (
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{validationMsg.text}</span>
        </div>
      )}

      {/* Bottom Completion Action */}
      <div className="w-full mt-4 flex justify-center">
        <button
          onClick={handleVerifyTracing}
          className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg flex items-center gap-2.5 transition-all transform active:scale-95 cursor-pointer ${
            hasCompleted
              ? "bg-emerald-600 text-white ring-4 ring-emerald-200 cursor-default"
              : isShapeEligible
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
