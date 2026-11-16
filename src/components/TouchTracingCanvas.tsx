"use client";

import React, { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { soundFx } from "@/utils/audioHelper";
import { RotateCcw, CheckCircle2, Volume2, Sparkles, Palette } from "lucide-react";

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
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState(BRUSH_COLORS[0].value);
  const [strokeCount, setStrokeCount] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Resize and initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use internal dimensions matching display
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    drawGuide();
  }, [character]);

  const drawGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.getBoundingClientRect().width;
    const height = canvas.getBoundingClientRect().height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw lined paper guides (top line, midline dashed, baseline)
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    // Top line
    ctx.beginPath();
    ctx.moveTo(30, height * 0.22);
    ctx.lineTo(width - 30, height * 0.22);
    ctx.stroke();

    // Midline (dashed)
    ctx.strokeStyle = "#CBD5E1";
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(30, height * 0.52);
    ctx.lineTo(width - 30, height * 0.52);
    ctx.stroke();

    // Baseline
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(30, height * 0.82);
    ctx.lineTo(width - 30, height * 0.82);
    ctx.stroke();

    // Draw Character Watermark
    ctx.font = `bold ${Math.round(height * 0.65)}px "Fredoka", "Nunito", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(226, 232, 240, 0.9)";
    ctx.fillText(character, width / 2, height * 0.52);

    // Character outline
    ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 6]);
    ctx.strokeText(character, width / 2, height * 0.52);
    ctx.setLineDash([]);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e) {
      // Prevent scrolling when drawing on touchscreen
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
    ctx.lineWidth = 18;
    ctx.strokeStyle = brushColor;
    setIsDrawing(true);
    setStrokeCount((prev) => prev + 1);
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
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    soundFx.playRetryBoing();
    setStrokeCount(0);
    setHasCompleted(false);
    drawGuide();
  };

  const handleHearSound = () => {
    soundFx.speakText(soundPrompt || character);
  };

  const handleVerifyTracing = () => {
    if (strokeCount < 1) {
      soundFx.playRetryBoing();
      soundFx.speakText("Trace the shape with your finger first!");
      return;
    }

    soundFx.playSuccessChime();
    soundFx.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setHasCompleted(true);
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
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm"
        >
          <Volume2 className="w-4 h-4 text-indigo-600" />
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

      {/* Tracing Canvas Container */}
      <div className="relative w-full aspect-4/3 max-h-[380px] bg-white rounded-3xl border-4 border-dashed border-indigo-300 shadow-xl overflow-hidden touch-none select-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair"
        />

        {strokeCount === 0 && (
          <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 text-white text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {guideHint}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Completion Action */}
      <div className="w-full mt-4 flex justify-center">
        <button
          onClick={handleVerifyTracing}
          className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg flex items-center gap-2.5 transition-all transform active:scale-95 ${
            hasCompleted
              ? "bg-emerald-600 text-white ring-4 ring-emerald-200"
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
