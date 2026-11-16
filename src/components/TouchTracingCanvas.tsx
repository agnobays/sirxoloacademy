"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { triggerFullScreenConfetti } from "@/utils/confettiHelper";
import { soundFx } from "@/utils/audioHelper";
import { RotateCcw, CheckCircle2, Volume2, Sparkles, RefreshCcw, AlertCircle } from "lucide-react";

interface TouchTracingCanvasProps {
  character: string;
  guideHint?: string;
  soundPrompt?: string;
  onComplete?: () => void;
}

interface Checkpoint {
  x: number;
  y: number;
  zone: "top" | "middle" | "bottom";
  hit: boolean;
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
  guideHint = "Start at 1, trace through 2, and finish at 3!",
  onComplete,
}: TouchTracingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState(BRUSH_COLORS[0].value);
  const [coveragePercent, setCoveragePercent] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [validationMsg, setValidationMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Tracing analytics refs
  const checkpoints = useRef<Checkpoint[]>([]);
  const userDrawnPoints = useRef<{ x: number; y: number; onTarget: boolean }[]>([]);

  // Setup canvas, letter checkpoints, and zoned segments
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = Math.max(rect.width, 320);
    const height = Math.max(rect.height, 280);

    canvas.width = width;
    canvas.height = height;

    // Use offscreen canvas to sample exact character shape pixels
    const offscreen = document.createElement("canvas");
    offscreen.width = width;
    offscreen.height = height;
    const oCtx = offscreen.getContext("2d", { willReadFrequently: true });
    if (!oCtx) return;

    const fontSize = Math.round(height * 0.65);
    oCtx.font = `900 ${fontSize}px "Fredoka", "Nunito", sans-serif`;
    oCtx.textAlign = "center";
    oCtx.textBaseline = "middle";
    oCtx.fillStyle = "#000000";
    const centerX = width / 2;
    const centerY = height * 0.52;
    oCtx.fillText(character, centerX, centerY);

    const imgData = oCtx.getImageData(0, 0, width, height).data;

    // Sample points along the letter
    const sampled: Checkpoint[] = [];
    const step = 12; // grid resolution
    const topThreshold = height * 0.40;
    const bottomThreshold = height * 0.64;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4;
        if (imgData[idx + 3] > 120) {
          let zone: "top" | "middle" | "bottom" = "middle";
          if (y < topThreshold) zone = "top";
          else if (y > bottomThreshold) zone = "bottom";

          sampled.push({ x, y, zone, hit: false });
        }
      }
    }

    checkpoints.current = sampled;
    userDrawnPoints.current = [];
    setCoveragePercent(0);
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
    const fontSize = Math.round(height * 0.65);
    ctx.font = `900 ${fontSize}px "Fredoka", "Nunito", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "rgba(241, 245, 249, 0.9)";
    ctx.fillText(character, width / 2, height * 0.52);

    // Dashed guidance border along the letter
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 6]);
    ctx.strokeText(character, width / 2, height * 0.52);
    ctx.setLineDash([]);

    // Draw Sequential Waypoint Guide Dots (1 🟢, 2 🟡, 3 🔴)
    const pts = checkpoints.current;
    if (pts.length > 5) {
      // Find top-most point for Start 1
      const topPts = pts.filter((p) => p.zone === "top");
      const midPts = pts.filter((p) => p.zone === "middle");
      const botPts = pts.filter((p) => p.zone === "bottom");

      const pt1 = topPts[0] || pts[0];
      const pt2 = midPts[Math.floor(midPts.length / 2)] || pts[Math.floor(pts.length / 2)];
      const pt3 = botPts[botPts.length - 1] || pts[pts.length - 1];

      const drawWaypoint = (pt: Checkpoint, label: string, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, pt.x, pt.y);
      };

      if (pt1) drawWaypoint(pt1, "1", "#10B981"); // Start 1 Green
      if (pt2) drawWaypoint(pt2, "2", "#F59E0B"); // Middle 2 Amber
      if (pt3) drawWaypoint(pt3, "3", "#EF4444"); // End 3 Red
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

  const checkPoint = (x: number, y: number) => {
    const hitRadius = 24; // Tolerance radius around letter checkpoints
    let hitFound = false;

    for (const pt of checkpoints.current) {
      const dist = Math.hypot(pt.x - x, pt.y - y);
      if (dist <= hitRadius) {
        pt.hit = true;
        hitFound = true;
      }
    }

    userDrawnPoints.current.push({ x, y, onTarget: hitFound });

    const hitCount = checkpoints.current.filter((p) => p.hit).length;
    const total = checkpoints.current.length;
    const pct = total > 0 ? Math.round((hitCount / total) * 100) : 0;
    setCoveragePercent(pct);
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
    ctx.lineWidth = 22;
    ctx.strokeStyle = brushColor;
    setIsDrawing(true);
    setValidationMsg(null);

    checkPoint(x, y);
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

    checkPoint(x, y);
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

  const handleVerifyTracing = () => {
    const totalPts = userDrawnPoints.current.length;
    if (totalPts < 8) {
      soundFx.playRetryBoing();
      soundFx.speakText("Trace the shape with your finger first!");
      setValidationMsg({ type: "error", text: "Trace along the shape from point 1 to 3!" });
      return;
    }

    // 1. Check Precision (Strokes on letter vs wild scribbles outside)
    const onTargetCount = userDrawnPoints.current.filter((p) => p.onTarget).length;
    const precision = onTargetCount / totalPts;

    if (precision < 0.55) {
      soundFx.playRetryBoing();
      soundFx.speakText("Stay on the lines of the letter!");
      setValidationMsg({
        type: "error",
        text: "Oops! You drew outside the letter shape. Follow the curves of the letter!",
      });
      return;
    }

    // 2. Check Zonal Coverage (Top, Middle, Bottom)
    const topPts = checkpoints.current.filter((p) => p.zone === "top");
    const midPts = checkpoints.current.filter((p) => p.zone === "middle");
    const botPts = checkpoints.current.filter((p) => p.zone === "bottom");

    const topHitRate = topPts.length > 0 ? topPts.filter((p) => p.hit).length / topPts.length : 1;
    const midHitRate = midPts.length > 0 ? midPts.filter((p) => p.hit).length / midPts.length : 1;
    const botHitRate = botPts.length > 0 ? botPts.filter((p) => p.hit).length / botPts.length : 1;

    if (topHitRate < 0.40) {
      soundFx.playRetryBoing();
      soundFx.speakText("Start at the green dot 1 and trace the top curve!");
      setValidationMsg({
        type: "error",
        text: "Make sure to trace the top curve starting at point 1 🟢!",
      });
      return;
    }

    if (midHitRate < 0.40) {
      soundFx.playRetryBoing();
      soundFx.speakText("Trace through the middle curve!");
      setValidationMsg({
        type: "error",
        text: "Make sure to follow the middle crossing curve at point 2 🟡!",
      });
      return;
    }

    if (botHitRate < 0.40) {
      soundFx.playRetryBoing();
      soundFx.speakText("Trace the bottom curve all the way to red dot 3!");
      setValidationMsg({
        type: "error",
        text: "You missed the bottom curve! Trace all the way down to point 3 🔴!",
      });
      return;
    }

    // 3. Overall Coverage requirement
    if (coveragePercent < 55) {
      soundFx.playRetryBoing();
      soundFx.speakText("Keep tracing to cover the whole letter shape!");
      setValidationMsg({
        type: "error",
        text: `You've covered ${coveragePercent}%. Follow the full curves to complete the shape!`,
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
      text: "Wonderful handwriting! You traced the full letter shape beautifully! ⭐",
    });
    if (onComplete) {
      onComplete();
    }
  };

  const isShapeReady = coveragePercent >= 55;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Top Controls Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <button
          onClick={handleHearSound}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-950 hover:bg-amber-200 font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm cursor-pointer"
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

      {/* Real-time Shape Coverage Meter */}
      <div className="w-full mb-3 px-2 flex items-center justify-between gap-3">
        <div className="flex-1 bg-slate-200 rounded-full h-3.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-200 rounded-full ${
              isShapeReady ? "bg-emerald-500" : "bg-indigo-600"
            }`}
            style={{ width: `${Math.min(coveragePercent, 100)}%` }}
          />
        </div>
        <span className="text-xs font-black text-slate-700 whitespace-nowrap">
          Shape Match: {coveragePercent}% {isShapeReady ? "⭐" : ""}
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
              : isShapeReady
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
